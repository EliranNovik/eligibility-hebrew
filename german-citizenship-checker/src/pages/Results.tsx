import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Paper, Container, styled, Avatar, Fade, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CancelIcon from '@mui/icons-material/Cancel';
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
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    __eligibilitySaved?: boolean;
  }
}

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
  clearFormState?: () => void;
}

async function saveEligibilityResult(section: string, additionalInfo?: any) {
  const { data, error } = await supabase
    .from('eligibility_results')
    .insert([
      {
        eligible_section: section,
        additional_info: additionalInfo || null,
      }
    ]);
  if (error) {
    console.error('Error saving eligibility result:', error);
  }
  return data;
}

const Results: React.FC<ResultsProps> = ({ formState, setFormState, clearFormState }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showContactForm, setShowContactForm] = useState(() => {
    const saved = localStorage.getItem('showContactForm');
    return saved ? JSON.parse(saved) : false;
  });
  const [contactFormType, setContactFormType] = useState<'positive' | 'negative' | null>(() => {
    const saved = localStorage.getItem('contactFormType');
    return saved ? saved as 'positive' | 'negative' : null;
  });
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
    // Always use formState.answers as the source of truth
    const answers = formState.answers;

    // Section 5 result logic (should be before §116/§15 logic)
    const section5Ancestor = answers.find((a) => a.questionId === 'german_5_earliest_ancestor');
    if (section5Ancestor) {
      let category = '';
      let lawCategory = '';
      let explanation = '';

      // Check if any answer is 'not_sure'
      const hasNotSure = answers.some(a => a.value === 'not_sure');
      if (hasNotSure) {
        return {
          eligible: true,
          message: 'You may be eligible for §5 but further assessment is needed.',
          sections: ['§5'],
          lawCategory: 'Section 5: Correction of historical discrimination for children and descendants of German citizens who lost citizenship due to gender-based or marital status laws.'
        };
      }

      // Category 2: Mother lost citizenship by marriage to a foreigner before April 1, 1953
      const motherLostCitizenship = answers.find(
        (a) => a.questionId === 'german_5_mother_q5' && a.value === 'yes'
      );
      // Category 3: Lost by legitimization by foreign father before April 1, 1953
      const lostByLegitimization = answers.find(
        (a) => a.questionId === 'german_5_mother_q6' && a.value === 'yes'
      );
      if (motherLostCitizenship) {
        category = '2';
        lawCategory = 'Category 2: Children whose German mother had lost German citizenship through marriage to a foreigner prior to April 1st 1953 pursuant to Section 17 (6) of the Reich and Nationality Act (old version)';
        explanation = 'You are eligible for German citizenship under §5 StAG.';
      } else if (lostByLegitimization) {
        category = '3';
        lawCategory = 'Category 3: Children who lost their German nationality acquired by birth through legitimization by their foreign father prior to April 1st 1953 and valid under German law pursuant to Section 17 (5) of the Reich and Nationality Act (old Version)';
        explanation = 'You are eligible for German citizenship under §5 StAG.';
      } else if (section5Ancestor.value === 'Mother' || section5Ancestor.value === 'Father') {
        category = '1';
        lawCategory = 'Category 1: Children born to a German parent who did not acquire German nationality by birth (children born in wedlock prior to January 1st 1975 to a German mother and a foreign father or children born out of wedlock prior to July 1st 1993 to a German father and a foreign mother)';
        explanation = 'You are eligible for German citizenship under §5 StAG.';
      } else if (section5Ancestor.value === 'Grandparent' || section5Ancestor.value === 'Great-grandparent') {
        category = '4';
        lawCategory = 'Category 4: Descendants of the above-mentioned children';
        explanation = 'You are eligible for German citizenship under §5 StAG.';
      } else {
        category = '';
        lawCategory = '';
        explanation = 'You are eligible for German citizenship under §5 StAG based on your family history.';
      }
      return {
        eligible: true,
        message: explanation,
        sections: ['§5'],
        category,
        lawCategory
      };
    }

    // If any answer is 'not_sure', return assessment needed for the correct section
    const hasNotSure = answers.some(a => a.value === 'not_sure');
    if (hasNotSure) {
      // Check for §116
      const a1 = answers.find((a) => a.questionId === 'german_116_1');
      const a2 = answers.find((a) => a.questionId === 'german_116_2');
      if (a1 && a2) {
        return {
          eligible: true,
          message: 'You may be eligible for §116 but further assessment is needed.',
          sections: ['§116'],
          lawCategory: '§116 StAG: Restoration for Nazi persecution victims and their descendants.'
        };
      }
      // Check for §15
      const a15 = answers.find((a) => a.questionId === 'german_15_5');
      if (a15) {
        return {
          eligible: true,
          message: 'You may be eligible for §15 but further assessment is needed.',
          sections: ['§15'],
          lawCategory: '§15 StAG: Naturalization for descendants of persecuted persons who were not German citizens.'
        };
      }
      // Check for Austrian §58c
      const austrian1 = answers.find((a) => a.questionId === 'austrian_58c_1');
      if (austrian1) {
        return {
          eligible: true,
          message: 'You may be eligible for §58c but further assessment is needed.',
          sections: ['§58c'],
          lawCategory: '§58c Austrian Citizenship Act: For descendants of Nazi persecution victims from Austria.'
        };
      }
      // Fallback
      return {
        eligible: true,
        message: 'You may be eligible, but further assessment is needed.',
        sections: [],
        lawCategory: ''
      };
    }

    // Austrian citizenship logic
    const austrian1 = answers && answers.find((a) => a.questionId === 'austrian_58c_1');
    const austrian2 = answers && answers.find((a) => a.questionId === 'austrian_58c_2');
    const austrian3 = answers && answers.find((a) => a.questionId === 'austrian_58c_3');
    const austrian4 = answers && answers.find((a) => a.questionId === 'austrian_58c_4');
    if (austrian1 && austrian2 && austrian3 && austrian4) {
      // Only allow positive if relation is Child, Grandchild, Great-grandchild, or Further descendant
      if (typeof austrian4.value === 'string' && ["Child", "Grandchild", "Great-grandchild", "Further descendant"].includes(austrian4.value)) {
        return {
          eligible: true,
          message: "You are eligible for Austrian citizenship under §58c. All required conditions are met.",
          sections: ['§58c']
        };
      } else {
        return {
          eligible: false,
          message: "You are not eligible for Austrian citizenship because you are not a direct descendant of the ancestor.",
          sections: []
        };
      }
    }

    // If the user selected 'Not directly related' for german_15_5, always return negative result
    if (answers && answers.find((a) => a.questionId === 'german_15_5' && a.value === 'Not directly related')) {
      return {
        eligible: false,
        message: "You are not eligible because you are not directly related to the ancestor.",
        sections: []
      };
    }

    // If no state is provided, return default not eligible state
    if (!location.state) {
      return {
        eligible: false,
        message: "Please complete the questionnaire to check your eligibility.",
        sections: []
      };
    }

    // If we have answers but they're incomplete, stay on the current page
    if (answers && answers.length > 0) {
      // Check for §116 eligibility: all 116 questions are 'yes', or 116_4 is 'no' and 116_4a is 'yes'
      const a1 = answers.find((a) => a.questionId === 'german_116_1');
      const a2 = answers.find((a) => a.questionId === 'german_116_2');
      const a3 = answers.find((a) => a.questionId === 'german_116_3');
      const a4 = answers.find((a) => a.questionId === 'german_116_4');
      const a4a = answers.find((a) => a.questionId === 'german_116_4a');
      if (
        a1 && a1.value === 'yes' &&
        a2 && a2.value === 'yes' &&
        (!a3 || a3.value === 'yes') &&
        (
          (a4 && a4.value === 'yes' && (!a4a || a4a.value === 'yes')) ||
          (a4 && a4.value === 'no' && a4a && a4a.value === 'yes')
        )
      ) {
        return {
          eligible: true,
          message: "You are eligible for German citizenship under §116 StAG. All required conditions are met.",
          sections: ['§116']
        };
      }
      // If user clicked 'no' on 116_2, and the rest are yes, eligible for §15
      if (
        a1 && a1.value === 'yes' &&
        a2 && a2.value === 'no' &&
        (!a3 || a3.value === 'yes') &&
        a4 && a4.value === 'yes' &&
        (!a4a || a4a.value === 'yes')
      ) {
        return {
          eligible: true,
          message: "You are eligible for German citizenship under §15 StAG. Your ancestor was not a German citizen, but all other conditions are met.",
          sections: ['§15']
        };
      }

      // Negative explanation logic
      let negativeReason = "";
      const no116_1 = answers.find((a) => a.questionId === 'german_116_1' && a.value === 'no');
      const no116_2 = answers.find((a) => a.questionId === 'german_116_2' && a.value === 'no');
      const no116_3 = answers.find((a) => a.questionId === 'german_116_3' && a.value === 'no');
      const no116_4 = answers.find((a) => a.questionId === 'german_116_4' && a.value === 'no');
      const no116_4a = answers.find((a) => a.questionId === 'german_116_4a' && a.value === 'no');
      const no15_5 = answers.find((a) => a.questionId === 'german_15_5' && a.value === 'Not directly related');

      if (no116_1) negativeReason = "You are not eligible because your ancestor was not persecuted by the Nazi regime.";
      else if (no116_2) negativeReason = "You are not eligible because your ancestor was not a German citizen before or during the Nazi era.";
      else if (no116_3) negativeReason = "You are not eligible because your ancestor was not a resident of Germany or Nazi-controlled territory at the relevant time.";
      else if (no116_4) negativeReason = "You are not eligible because your ancestor did not flee due to persecution between 1933 and 1945.";
      else if (no116_4a) negativeReason = "You are not eligible because your ancestor did not leave Germany (or Nazi-controlled territory) between 1926 and 1933.";
      else if (no15_5) negativeReason = "You are not eligible because you are not directly related to the ancestor.";

      // Use explanation from navigation state if present
      if (location.state && location.state.explanation) {
        negativeReason = location.state.explanation;
      }

      return {
        eligible: false,
        message: negativeReason || "Based on your answers, you are not eligible for German citizenship.",
        sections: []
      };
    }

    // If we have no answers at all, redirect to questions
    navigate('/questions');
    return {
      eligible: false,
      message: "Please complete the questionnaire to check your eligibility.",
      sections: []
    };
  };

  const result = analyzeEligibility();

  // Determine if assessment is needed - only if there's a not_sure answer
  const assessmentNeeded = formState.answers.some(a => a.value === 'not_sure');
  // Get user's name for greeting
  const userName = formState.userData?.fullName || '';

  useEffect(() => {
    if (result.eligible && !showContactForm) {
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
  }, [result.eligible, showContactForm]);

  useEffect(() => {
    // Save eligibility result to Supabase only once per check
    if (result && typeof result.eligible !== 'undefined' && result.sections && result.sections.length > 0) {
      if (!window.__eligibilitySaved) {
        window.__eligibilitySaved = true;
        result.sections.forEach(async (section: string) => {
          const { data, error } = await supabase.from('eligibility_results').insert([
            {
              eligible_section: section,
              is_eligible: result.eligible,
              explanation: result.message || null,
              user_data: formState.userData || null,
            }
          ]);
          console.log('Eligibility insert', { section, data, error });
        });
      }
    }
  }, [result, formState.userData]);

  // Persist showContactForm and contactFormType to localStorage
  useEffect(() => {
    localStorage.setItem('showContactForm', JSON.stringify(showContactForm));
  }, [showContactForm]);
  useEffect(() => {
    if (contactFormType) {
      localStorage.setItem('contactFormType', contactFormType);
    } else {
      localStorage.removeItem('contactFormType');
    }
  }, [contactFormType]);

  const handleRestart = () => {
    setShowContactForm(false);
    setContactFormType(null);
    localStorage.removeItem('showContactForm');
    localStorage.removeItem('contactFormType');
    setFormState((prev) => ({
      ...prev,
      answers: [],
      currentStep: 0,
    }));
    navigate('/questions');
  };

  const handleContactSuccess = () => {
    setShowContactForm(false);
    setContactFormType(null);
    localStorage.removeItem('showContactForm');
    localStorage.removeItem('contactFormType');
    if (clearFormState) {
      clearFormState();
    } else {
      handleRestart();
    }
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
      const shareUrl = 'https://eligibility-checker.lawoffice.org.il/';
      const shareText = 'Check your German or Austrian citizenship eligibility here:';

      if (platform === 'whatsapp') {
        // Create a form data object to send the image
        const formData = new FormData();
        formData.append('image', blob, 'eligibility-result.png');
        
        // First try to share with image
        try {
          // Use Web Share API if available and the device supports sharing files
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'eligibility-result.png', { type: 'image/png' })] })) {
            await navigator.share({
              files: [new File([blob], 'eligibility-result.png', { type: 'image/png' })],
              title: 'My Citizenship Eligibility Result',
              text: `${shareText} ${shareUrl}`,
            });
          } else {
            // Fallback to regular WhatsApp share with just text
            window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
          }
        } catch (error) {
          // If sharing with image fails, fallback to regular text share
          window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
        }
      } else if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to simple URL sharing if image sharing fails
      const shareUrl = 'https://eligibility-checker.lawoffice.org.il/';
      const shareText = 'Check your German or Austrian citizenship eligibility here:';
      if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
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

  // Always return to the first question (country selection)
  const returnToStep = 0;

  return (
    <>
      <Header showBackButton={false} />
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
          {/* Custom Back Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, mt: 2, ml: { xs: 2, sm: 4 } }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon sx={{ fontSize: 28 }} />}
              onClick={() => {
                setFormState(prev => ({
                  ...prev,
                  answers: [],
                  currentStep: 0,
                }));
                navigate('/questions');
              }}
              sx={{
                borderRadius: 999,
                px: 3,
                py: 1.5,
                fontWeight: 700,
                fontSize: 18,
                background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(100, 108, 255, 0.2)',
                minWidth: 0,
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
                },
              }}
            >
              Back to Citizenship Selection
            </Button>
          </Box>
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
              (result.eligible || contactFormType === 'positive') ? (
                <Box width="100%" mt={3}>
                  <ContactFormPositive
                    eligibleSections={result.sections || []}
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
                {/* Unified Congratulations Card for both positive and negative results */}
                <CongratsCard ref={congratsCardRef} sx={{ width: '100%', mb: 2 }}>
                  {result.eligible ? (
                    <CelebrationIcon sx={{ fontSize: 48, mb: 1 }} />
                  ) : (
                    <CancelIcon sx={{ fontSize: 48, mb: 1, color: '#232946' }} />
                  )}
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#232946' }}>
                    {result.eligible ? `Congratulations${userName ? ` ${userName}` : ''}!` : ''}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontWeight: 600, 
                    color: '#232946', 
                    mb: 1, 
                    whiteSpace: 'pre-line', 
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    lineHeight: 1.5
                  }}>
                    {assessmentNeeded
                      ? `You may be eligible for${result.sections && result.sections.length > 0 ? ` ${result.sections.join(', ')}` : ''} but further assessment is needed.`
                      : result.message}
                  </Typography>
                  {/* Show law category box for both assessment needed and positive results, except for Austrian positive results */}
                  {(assessmentNeeded || (result.eligible && !result.sections?.includes('§58c'))) && (
                    (() => {
                      const notSureAnswer = formState.answers.find(a => a.value === 'not_sure');
                      const notSureQuestion = notSureAnswer ? questions.find(q => q.id === notSureAnswer.questionId) : null;
                      return (
                        <Box sx={{
                          mt: 2,
                          background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                          color: '#232946',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          fontWeight: 600,
                          fontSize: 15,
                          display: 'inline-block',
                          boxShadow: 1,
                        }}>
                          {notSureQuestion ? (
                            <>
                              <span>You appeared unsure about how to answer: "{notSureQuestion.text}"</span>
                              <br />
                              <span style={{ display: 'block', marginTop: 8, fontWeight: 500, fontSize: 14 }}>
                                We will be able to assist you with a final assessment of your personal case.
                              </span>
                            </>
                          ) : (result.lawCategory || result.message)}
                        </Box>
                      );
                    })()
                  )}
                </CongratsCard>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  width: '100%',
                  mb: 2,
                  justifyContent: 'center',
                }}>
                  {/* Only show Archival Research button for positive results */}
                  {result.eligible && (
                    <Button
                      fullWidth
                      sx={{
                        fontSize: 18,
                        fontWeight: 600,
                        py: 2,
                        mt: 0,
                        mb: 1,
                        background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                        color: '#232946',
                        boxShadow: 2,
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
                        },
                      }}
                      onClick={() => {
                        setShowContactForm(true);
                        setContactFormType('positive');
                      }}
                    >
                      <Box sx={{ fontWeight: 700, fontSize: 18 }}>
                        Proceed with Archival Research
                      </Box>
                      <Box sx={{ fontSize: 12, color: '#232946', opacity: 0.6, fontWeight: 400, mt: 0.5 }}>
                        further information submission needed
                      </Box>
                    </Button>
                  )}
                  <Button
                    fullWidth
                    sx={{
                      fontSize: 18,
                      fontWeight: 600,
                      py: 2,
                      mt: 0,
                      background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
                      color: '#fff',
                      boxShadow: 2,
                      borderRadius: 3,
                      '&:hover': {
                        background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
                      },
                    }}
                    onClick={() => {
                      setShowContactForm(true);
                      setContactFormType('negative');
                      navigate('/contact', {
                        state: {
                          eligible: false,
                          eligibleSections: result.sections || [],
                          answers: formState.answers,
                          explanation: result.message,
                        }
                      });
                    }}
                  >
                    I wish to be contacted by a representative
                  </Button>
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