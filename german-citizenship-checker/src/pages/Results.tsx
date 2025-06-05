import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Container, styled, Avatar, Fade, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import DownloadIcon from '@mui/icons-material/Download';
import PublicIcon from '@mui/icons-material/Public';
import YouTubeIcon from '@mui/icons-material/YouTube';
import html2canvas from 'html2canvas';
import type { FormState, Question } from '../types';
import ContactFormPositive from '../components/ContactFormPositive';
import Header from '../components/Header';
import ContactFormPage from './ContactForm';
import { questions } from '../questions/questions';

const AVATARS = ['/Avatar1.png'];
const CHAT_TEXT = "Submit your application and we'll get back to you!";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: '#1a1a1a',
  color: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  overflow: 'hidden',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 'bold',
  background: 'linear-gradient(90deg, #646cff, #535bf2)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(90deg, #535bf2, #646cff)',
  },
}));

const CongratsCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
  color: '#232946',
  borderRadius: theme.spacing(2),
  boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.15)',
  padding: theme.spacing(3, 2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

interface ResultsProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}

const Results: React.FC<ResultsProps> = ({ formState, setFormState }) => {
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormType, setContactFormType] = useState<'positive' | 'negative' | null>(null);
  const [typedText, setTypedText] = useState('');
  const timeoutRef = useRef<number | null>(null);
  const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
  const congratsCardRef = useRef<HTMLDivElement>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);

  const section5Equivalents: Record<string, string[]> = {
    'german_5_cat1_birth': ['german_5_cat2_birth', 'german_5_cat4_birth'],
    'german_5_cat1_mother_citizen': ['german_5_cat4_mother_citizen_father_not', 'german_5_cat3_mother_citizen_before_marriage'],
    'german_5_cat1_father_not_citizen': ['german_5_cat3_father_not_citizen'],
    'german_5_cat1_parents_married': ['german_5_cat2_parents_not_married', 'german_5_cat4_parents_married_after_birth'],
    // ...add more as needed
  };

  function getSection5Answer(questionId: string, answers: typeof formState.answers) {
    const allIds = [questionId, ...(section5Equivalents[questionId] || [])];
    return answers.find(a => allIds.includes(a.questionId));
  }

  const analyzeEligibility = () => {
    const answers = formState.answers;
    const countryAnswer = answers.find(a => a.questionId === 'country_selection');
    const selectedCountry = countryAnswer?.value as string;
    
    if (!selectedCountry) {
      return {
        isEligible: false,
        explanation: 'Please complete the questionnaire to check your eligibility.',
      };
    }

    // Check for "not sure" answers
    const notSureAnswers = answers.filter(a => a.value === 'not_sure');
    if (notSureAnswers.length > 0) {
      // Get the first "not sure" answer's question ID
      const firstNotSureQuestionId = notSureAnswers[0].questionId;

      // Special case for German citizenship before 1933 question
      if (firstNotSureQuestionId === 'german_116_2') {
        return {
          isEligible: false,
          eligibleSections: ['§15'],
          explanation: `You may be eligible under §15!\n\nBased on your answers, there is a real possibility that you qualify for citizenship under this section.\n\nHowever, some of your responses require a more detailed review by our legal experts to ensure you receive the most accurate advice for your unique situation.\n\nOur Lawyers team at Decker Pex Levi will be happy to assess your case and guide you through the next steps.`,
          notSure: true,
          closeSection: '§15'
        };
      }

      // If the first "not sure" is in section 5 questions
      if (firstNotSureQuestionId.startsWith('german_5')) {
        return {
          isEligible: false,
          eligibleSections: ['§5'],
          explanation: `You may be eligible under §5!\n\nBased on your answers, there is a real possibility that you qualify for citizenship under this section.\n\nHowever, some of your responses require a more detailed review by our legal experts to ensure you receive the most accurate advice for your unique situation.\n\nOur Lawyers team at Decker Pex Levi will be happy to assess your case and guide you through the next steps.`,
          notSure: true,
          closeSection: '§5'
        };
      }
      
      // If "not sure" appears in §116 or §15 questions (except for german_116_2)
      if (firstNotSureQuestionId.startsWith('german_116') || firstNotSureQuestionId.startsWith('german_15')) {
        const section = firstNotSureQuestionId.startsWith('german_116') ? '§116' : '§15';
        return {
          isEligible: false,
          eligibleSections: [section],
          explanation: `You may be eligible under ${section}!\n\nBased on your answers, there is a real possibility that you qualify for citizenship under this section.\n\nHowever, some of your responses require a more detailed review by our legal experts to ensure you receive the most accurate advice for your unique situation.\n\nOur Lawyers team at Decker Pex Levi will be happy to assess your case and guide you through the next steps.`,
          notSure: true,
          closeSection: section
        };
      }

      // For Austrian citizenship
      if (firstNotSureQuestionId.startsWith('austrian_58c')) {
        return {
          isEligible: false,
          eligibleSections: ['§58c'],
          explanation: `You may be eligible under §58c!\n\nBased on your answers, there is a real possibility that you qualify for Austrian citizenship under this section.\n\nHowever, some of your responses require a more detailed review by our legal experts to ensure you receive the most accurate advice for your unique situation.\n\nOur Lawyers team at Decker Pex Levi will be happy to assess your case and guide you through the next steps.`,
          notSure: true,
          closeSection: '§58c'
        };
      }
    }

    let explanation = '';
    let isEligible = false;
    let eligibleSections: string[] = [];

    if (selectedCountry === 'Germany') {
      // New Section 5 Analysis Logic
      const ancestorAnswer = answers.find(a => a.questionId === 'german_5_earliest_ancestor');
      if (ancestorAnswer) {
        let pathIds: string[] = [];
        if (ancestorAnswer.value === 'Mother') {
          pathIds = questions.filter(q => q.id.startsWith('german_5_mother_q')).map(q => q.id);
        } else if (ancestorAnswer.value === 'Father') {
          pathIds = questions.filter(q => q.id.startsWith('german_5_father_q')).map(q => q.id);
        } else if (ancestorAnswer.value === 'Grandparent') {
          const gp1 = answers.find(a => a.questionId === 'german_5_grandparent_q1');
          const gp2 = answers.find(a => a.questionId === 'german_5_grandparent_q2');
          if (gp1 && gp2) {
            if (gp1.value === 'Grandfather' && gp2.value === "My mom's parent") {
              pathIds = questions.filter(q => q.id.startsWith('german_5_grandfather_mother_father_q')).map(q => q.id);
            } else if (gp1.value === 'Grandfather' && gp2.value === "My dad's parent") {
              pathIds = questions.filter(q => q.id.startsWith('german_5_grandfather_father_father_q')).map(q => q.id);
            } else if (gp1.value === 'Grandmother' && gp2.value === "My mom's parent") {
              pathIds = questions.filter(q => q.id.startsWith('german_5_grandmother_mother_mother_q')).map(q => q.id);
            } else if (gp1.value === 'Grandmother' && gp2.value === "My dad's parent") {
              pathIds = questions.filter(q => q.id.startsWith('german_5_grandmother_father_mother_q')).map(q => q.id);
            }
          }
        } else if (ancestorAnswer.value === 'Great-grandparent') {
          pathIds = questions.filter(q => q.id.startsWith('german_5_greatgrandparent_q')).map(q => q.id);
        }
        if (pathIds.length > 0) {
          const pathAnswers = pathIds
            .map(id => answers.find(a => a.questionId === id))
            .filter((a): a is { questionId: string; value: string | boolean } => !!a);
          if (pathAnswers.some(a => a && a.value === 'no')) {
            return {
              isEligible: false,
              eligibleSections: ['§5'],
              explanation: 'Based on your answers, you are not eligible for German citizenship under §5. One or more answers indicate ineligibility.'
            };
          }
          if (pathAnswers.some(a => a && a.value === 'not_sure')) {
            return {
              isEligible: false,
              eligibleSections: ['§5'],
              explanation: 'Some of your answers require further assessment. Please consult with a legal expert for a detailed review.',
              notSure: true,
              closeSection: '§5'
            };
          }
          if (pathAnswers.length === pathIds.length && pathAnswers.every(a => a && a.value === 'yes')) {
            // Determine Section 5 category and explanation
            let category = '';
            let categoryExplanation = '';
            if (ancestorAnswer.value === 'Mother') {
              category = 'Category 1';
              categoryExplanation = 'No acquisition from German mother (born between 1949-1974)';
            } else if (ancestorAnswer.value === 'Father') {
              category = 'Category 2';
              categoryExplanation = 'No acquisition from German father (born between 1949-1993)';
            } else if (ancestorAnswer.value === 'Grandparent') {
              const gp1 = answers.find(a => a.questionId === 'german_5_grandparent_q1');
              const gp2 = answers.find(a => a.questionId === 'german_5_grandparent_q2');
              if (gp1 && gp2) {
                if (gp1.value === 'Grandfather' && gp2.value === "My mom's parent") {
                  category = 'Category 2';
                  categoryExplanation = 'No acquisition from German father (born between 1949-1993)';
                } else if (gp1.value === 'Grandfather' && gp2.value === "My dad's parent") {
                  category = 'Category 2';
                  categoryExplanation = 'No acquisition from German father (born between 1949-1993)';
                } else if (gp1.value === 'Grandmother' && gp2.value === "My mom's parent") {
                  category = 'Category 1';
                  categoryExplanation = 'No acquisition from German mother (born between 1949-1974)';
                } else if (gp1.value === 'Grandmother' && gp2.value === "My dad's parent") {
                  category = 'Category 1';
                  categoryExplanation = 'No acquisition from German mother (born between 1949-1974)';
                }
              }
            } else if (ancestorAnswer.value === 'Great-grandparent') {
              category = 'Category 5';
              categoryExplanation = 'Descendant of eligible parent';
            }
            return {
              isEligible: true,
              eligibleSections: ['§5'],
              explanation: `You appear to be eligible for German citizenship under §5 (Correction of historical discrimination).\n\n${category ? `\n${category}: ${categoryExplanation}` : ''}`
            };
          }
        }
      }

      // Continue with existing §116 and §15 logic
      if (!isEligible) {
        const jewishAnswer = answers.find(a => a.questionId === 'german_116_1');
        const citizenAnswer = answers.find(a => a.questionId === 'german_116_2');
        const livedInGermany = answers.find(a => a.questionId === 'german_116_3');
        const centerOfLife = answers.find(a => a.questionId === 'german_116_4');
        const emigrated = answers.find(a => a.questionId === 'german_116_5');
        const relationAnswer = answers.find(a => a.questionId === 'german_116_6');

        // If they were a German citizen, check §116 eligibility
        if (citizenAnswer?.value === 'yes') {
          if (jewishAnswer?.value === 'yes' && 
              livedInGermany?.value === 'yes' && 
              centerOfLife?.value === 'yes' && 
              emigrated?.value === 'yes' && 
              relationAnswer?.value) {
            isEligible = true;
            eligibleSections.push('§116');
            explanation += 'You appear to be eligible for German citizenship under §116 (Restoration of citizenship to victims of Nazi persecution).\n\n';
          }
        }
        // If they were NOT a German citizen, check §15 eligibility
        else if (citizenAnswer?.value === 'no') {
          const german15Answers = answers.filter(a => a.questionId.startsWith('german_15'));
          const isGerman15Eligible = german15Answers.every(a => {
            if (a.questionId === 'german_15_5') {
              return a.value !== undefined && a.value !== '';
            }
            return a.value === 'yes';
          });
          
          if (isGerman15Eligible) {
            isEligible = true;
            eligibleSections.push('§15');
            explanation += 'You appear to be eligible for German citizenship under §15 (Naturalization of descendants of persecuted residents).\n\n';
          }
        }
      }
    } else if (selectedCountry === 'Austria') {
      // Existing Austrian citizenship logic
      const austrian58c1 = answers.find(a => a.questionId === 'austrian_58c_1');
      const austrian58c2 = answers.find(a => a.questionId === 'austrian_58c_2');
      const austrian58c3 = answers.find(a => a.questionId === 'austrian_58c_3');
      const austrian58c4 = answers.find(a => a.questionId === 'austrian_58c_4');
      const validRelations = ['Child', 'Grandchild', 'Great-grandchild', 'Further descendant'];

      // Check if any answer is "no"
      if (austrian58c1?.value === 'no' || austrian58c2?.value === 'no' || austrian58c3?.value === 'no') {
        isEligible = false;
        explanation = 'Based on your answers, you are not eligible for Austrian citizenship under §58c. To be eligible, your ancestor must have lived in Austria before 1955, been a citizen of one of the listed countries, and been in danger from the Nazis.';
        return {
          isEligible,
          eligibleSections: [],
          explanation,
        };
      }

      const isAustrian58cEligible =
        austrian58c1?.value === 'yes' &&
        austrian58c2?.value === 'yes' &&
        austrian58c3?.value === 'yes' &&
        austrian58c4 &&
        validRelations.includes(String(austrian58c4.value));

      if (isAustrian58cEligible) {
        isEligible = true;
        eligibleSections.push('§58c');
        explanation += 'You appear to be eligible for Austrian citizenship under §58c (Descendants of victims of Nazi persecution).\n\n';
      }
    }

    if (!isEligible && !explanation) {
      explanation = `Based on your answers, you may not be eligible for automatic ${selectedCountry} citizenship restoration. However, we recommend consulting with a legal expert for a detailed assessment of your specific case.`;
    }

    return {
      isEligible,
      eligibleSections,
      explanation,
    };
  };

  const result = analyzeEligibility();

  useEffect(() => {
    if (result.isEligible && !showContactForm) {
      setTypedText('');
      let i = 0;
      function typeNext() {
        setTypedText(CHAT_TEXT.slice(0, i + 1));
        if (i < CHAT_TEXT.length - 1) {
          i++;
          timeoutRef.current = window.setTimeout(typeNext, 30);
        }
      }
      typeNext();
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [result.isEligible, showContactForm]);

  const handleRestart = () => {
    setFormState((prev) => ({
      ...prev,
      answers: [],
      currentStep: 0,
    }));
    navigate('/questions');
  };

  const handleContactSuccess = () => {
    setShowContactForm(false);
    handleRestart();
  };

  const captureAndShare = async (platform: 'whatsapp' | 'facebook') => {
    if (!congratsCardRef.current) return;

    try {
      const canvas = await html2canvas(congratsCardRef.current);
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });
      // Create a URL for the image
      const imageUrl = URL.createObjectURL(blob);
      setShareImageUrl(imageUrl);
      setShowShareDialog(true);

      // Share the intro page link
      const shareUrl = 'https://eligibility-checker-o4xu.onrender.com/';
      const shareText = 'Check your German citizenship eligibility here:';

      if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
      } else if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to simple URL sharing if image sharing fails
      const shareUrl = 'https://eligibility-checker-o4xu.onrender.com/';
      if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent('Check your German citizenship eligibility here: ' + shareUrl)}`, '_blank');
      } else {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    }
  };

  const handleDownloadImage = () => {
    if (!shareImageUrl) return;
    
    const link = document.createElement('a');
    link.href = shareImageUrl;
    link.download = 'eligibility-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Header showBackButton onBack={() => navigate('/questions')} />
      <Box sx={{ 
        minHeight: '100vh', 
        width: '100vw', 
        bgcolor: 'rgba(35, 41, 70, 0.85)',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        py: 0, 
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/german_documents.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
          zIndex: 0,
        }
      }}>
        <Container maxWidth="md" sx={{ py: 1, mt: 0, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
          {/* Group assessment and contact form in a single card */}
          <Paper elevation={6} sx={{
            width: '100%',
            maxWidth: 600,
            mx: 'auto',
            borderRadius: 4,
            p: { xs: 2, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.15)',
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}>
            {showContactForm ? (
              // Show positive contact form for positive results, or if user chose 'Proceed with Archival Research' after negative
              (result.isEligible || contactFormType === 'positive') ? (
                <Box width="100%" mt={3}>
                  <ContactFormPositive
                    eligibleSections={result.eligibleSections || []}
                    onSuccess={handleContactSuccess}
                    userData={formState.userData}
                    formState={formState}
                  />
                </Box>
              ) : contactFormType === 'negative' ? (
                <Box width="100%" mt={3}>
                  <ContactFormPage
                    formState={formState}
                    setFormState={setFormState}
                    hideHeader={true}
                  />
                </Box>
              ) : null
            ) : (
              <>
                {/* Special case: not_sure */}
                {result.notSure && (
                  <>
                    <Box sx={{
                      background: result.closeSection ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                      color: '#232946',
                      borderRadius: 3,
                      p: 4,
                      textAlign: 'center',
                      boxShadow: 2,
                      width: '100%',
                      mb: 0,
                    }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#232946' }}>
                        {result.closeSection ? `You may be eligible under ${result.closeSection}!` : 'You may be eligible!'}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#232946', mb: 2, whiteSpace: 'pre-line' }}>
                        {result.explanation.replace(/^You may be eligible under .*?!\n\n|^You may be eligible!\n\n/, '')}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ 
                          mt: 2, 
                          fontWeight: 700, 
                          fontSize: 18, 
                          borderRadius: 3, 
                          background: 'linear-gradient(90deg, #646cff, #535bf2)',
                          color: '#fff', 
                          boxShadow: 2,
                          '&:hover': {
                            background: 'linear-gradient(90deg, #535bf2, #646cff)',
                          }
                        }}
                        onClick={() => setShowContactForm(true)}
                      >
                        Next Step
                      </Button>
                    </Box>
                  </>
                )}
                {/* Usual results logic */}
                {!result.notSure && result.isEligible && (
                  <>
                    <CongratsCard ref={congratsCardRef} sx={{ width: '100%', mb: 2 }}>
                      <CelebrationIcon sx={{ fontSize: 48, mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#232946' }}>
                        {`Congratulations${formState.userData.fullName ? ` ${formState.userData.fullName}` : ''}!`}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#232946', mb: 1, whiteSpace: 'pre-line', textAlign: 'center' }}>
                        {result.explanation}
                      </Typography>
                    </CongratsCard>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      width: '100%',
                      mb: 2
                    }}>
                      <StyledButton
                        fullWidth
                        sx={{ fontSize: 18, fontWeight: 600, py: 2, mt: 0, mb: 2 }}
                        onClick={() => {
                          setShowContactForm(true);
                          setContactFormType('positive');
                        }}
                      >
                        Next Step
                      </StyledButton>
                      <StyledButton
                        fullWidth
                        sx={{ fontSize: 18, fontWeight: 600, py: 2, mt: 0 }}
                        onClick={handleRestart}
                      >
                        Start New Check
                      </StyledButton>
                    </Box>
                    {/* Share section */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: 2, 
                      width: '100%',
                      mb: 2
                    }}>
                      <Typography variant="subtitle1" sx={{ 
                        color: 'white', 
                        fontWeight: 500 
                      }}>
                        Share this eligibility checker with friends:
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        justifyContent: 'center' 
                      }}>
                        <Button
                          variant="contained"
                          onClick={() => captureAndShare('whatsapp')}
                          sx={{
                            background: '#25D366',
                            minWidth: 56,
                            minHeight: 56,
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 0,
                            '&:hover': {
                              background: '#128C7E',
                            },
                          }}
                        >
                          <WhatsAppIcon sx={{ fontSize: 32, color: '#fff' }} />
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => captureAndShare('facebook')}
                          sx={{
                            background: '#1877F2',
                            minWidth: 56,
                            minHeight: 56,
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 0,
                            '&:hover': {
                              background: '#0C5DC7',
                            },
                          }}
                        >
                          <FacebookIcon sx={{ fontSize: 32, color: '#fff' }} />
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}
                {/* Negative result: show choice before contact form */}
                {!result.notSure && !result.isEligible && (
                  <>
                    <Box sx={{
                      background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                      color: '#232946',
                      borderRadius: 3,
                      p: 4,
                      textAlign: 'center',
                      boxShadow: 2,
                      width: '100%',
                      mb: 0,
                    }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#232946' }}>
                        Eligibility Assessment
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        mb: 4, 
                        color: '#232946', 
                        whiteSpace: 'pre-line',
                        fontWeight: 600,
                        fontSize: 18,
                        lineHeight: 1.6
                      }}>
                        {result.explanation}
                      </Typography>
                    </Box>
                    {/* Choice buttons before contact form */}
                    {contactFormType === null && (
                      <Box sx={{ width: '100%', mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          sx={{
                            fontWeight: 700,
                            fontSize: 18,
                            borderRadius: 3,
                            background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                            color: '#232946',
                            boxShadow: '0 4px 20px rgba(67,233,123,0.10)',
                            px: 4,
                            py: 2,
                            '&:hover': {
                              background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
                            },
                          }}
                          onClick={() => {
                            setContactFormType('positive');
                            setShowContactForm(true);
                          }}
                        >
                          Proceed with Archival Research
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="large"
                          sx={{
                            fontWeight: 700,
                            fontSize: 18,
                            borderRadius: 3,
                            background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
                            color: '#fff',
                            boxShadow: '0 4px 20px rgba(100,108,255,0.10)',
                            px: 4,
                            py: 2,
                            '&:hover': {
                              background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
                            },
                          }}
                          onClick={() => {
                            setContactFormType('negative');
                            setShowContactForm(true);
                          }}
                        >
                          I wish to be contacted by a representative
                        </Button>
                      </Box>
                    )}
                  </>
                )}
              </>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Links Section */}
      <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        py: 2,
        zIndex: 1000,
      }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'row' },
              justifyContent: { xs: 'space-between', sm: 'center' },
              alignItems: 'center',
              width: '100%',
              gap: { xs: 0, sm: 4 },
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: { xs: 1, sm: 4 } }}>
              <Button
                href="https://lawoffice.org.il/en/"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<PublicIcon />}
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Visit Our Website
              </Button>
              <Button
                href="https://www.facebook.com/deckerpexlevi"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<FacebookIcon />}
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Follow Us on Facebook
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: { xs: 1, sm: 4 } }}>
              <Button
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<WhatsAppIcon />}
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Contact on WhatsApp
              </Button>
              <Button
                href="https://www.youtube.com/@DeckerPexLawoffice"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<YouTubeIcon />}
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                YouTube Channel
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
          Share Your Result
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.87)', textAlign: 'center', mb: 2 }}>
            The link has been shared. You can now download your result image to share it manually:
          </Typography>
          {shareImageUrl && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <img 
                src={shareImageUrl} 
                alt="Eligibility Result" 
                style={{ 
                  maxWidth: '100%', 
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }} 
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button
            onClick={() => setShowShareDialog(false)}
            variant="outlined"
            sx={{
              color: '#646cff',
              borderColor: '#646cff',
              '&:hover': {
                borderColor: '#535bf2',
                color: '#535bf2',
              },
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleDownloadImage}
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              background: 'linear-gradient(90deg, #646cff, #535bf2)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(90deg, #535bf2, #646cff)',
              },
            }}
          >
            Download Image
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Results; 