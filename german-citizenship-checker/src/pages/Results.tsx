import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Container, styled, Avatar, Fade, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import DownloadIcon from '@mui/icons-material/Download';
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
      const section5Answers = answers.filter(a => a.questionId.startsWith('german_5_simple_'));
      if (section5Answers.length > 0) {
        const categoryScores: Record<'1' | '2' | '3' | '4' | '5', number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
        
        // Calculate scores for each category based on 'yes' answers
        section5Answers.forEach(answer => {
          if (answer.value === 'yes') {
            const question = questions.find((q: Question) => q.id === answer.questionId);
            question?.categoryMatch?.forEach((cat: string) => {
              if (cat in categoryScores) {
                categoryScores[cat as keyof typeof categoryScores] += 1;
              }
            });
          }
        });

        // Find the category with the highest score
        const maxScore = Math.max(...Object.values(categoryScores));
        const matchedCategories = Object.entries(categoryScores)
          .filter(([_, score]) => score === maxScore && score > 0)
          .map(([cat]) => cat);

        if (matchedCategories.length > 0) {
          isEligible = true;
          eligibleSections = matchedCategories.map(cat => `§5 Category ${cat}`);
          
          // Generate explanation based on matched categories
          const categoryExplanations: Record<'1' | '2' | '3' | '4' | '5', string> = {
            '1': 'No acquisition from German mother (born between 1949-1974)',
            '2': 'No acquisition from German father (born between 1949-1993)',
            '3': 'Loss through marriage (before April 1953)',
            '4': 'Loss through legitimation',
            '5': 'Descendant of eligible parent'
          };
          
          explanation = 'You appear to be eligible for German citizenship under:\n\n';
          matchedCategories.forEach(cat => {
            if (cat in categoryExplanations) {
              explanation += `§5 Category ${cat}: ${categoryExplanations[cat as keyof typeof categoryExplanations]}\n`;
            }
          });
          explanation += '\nNote: You must apply before 19 August 2031.\n\n';
        } else {
          explanation = 'Based on your answers, you do not clearly qualify under any of the defined §5 categories. However, you may still be eligible. Please consult with a legal expert for review.\n\n';
        }
      }

      // Continue with existing §116 and §15 logic
      if (!isEligible) {
        const jewishAnswer = answers.find(a => a.questionId === 'german_116_1');
        const citizenAnswer = answers.find(a => a.questionId === 'german_116_2');
        const emigrationAnswer = answers.find(a => a.questionId === 'german_116_6');
        const relationAnswer = answers.find(a => a.questionId === 'german_116_7');

        if (jewishAnswer?.value === 'yes' && citizenAnswer?.value === 'yes') {
          if (emigrationAnswer?.value === 'yes' && relationAnswer && relationAnswer.value) {
            isEligible = true;
            eligibleSections.push('§116');
            explanation += 'You appear to be eligible for German citizenship under §116 (Restoration of citizenship to victims of Nazi persecution).\n\n';
          } else {
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
      }
    } else if (selectedCountry === 'Austria') {
      // Existing Austrian citizenship logic
      const austrian58c1 = answers.find(a => a.questionId === 'austrian_58c_1');
      const austrian58c2 = answers.find(a => a.questionId === 'austrian_58c_2');
      const austrian58c3 = answers.find(a => a.questionId === 'austrian_58c_3');
      const austrian58c4 = answers.find(a => a.questionId === 'austrian_58c_4');
      const austrian58c5 = answers.find(a => a.questionId === 'austrian_58c_5');
      const austrian58c6 = answers.find(a => a.questionId === 'austrian_58c_6');
      const validRelations = ['Child', 'Grandchild', 'Great-grandchild', 'Further descendant'];
      const isAustrian58cEligible =
        austrian58c1?.value === 'yes' &&
        austrian58c2?.value === 'yes' &&
        austrian58c3?.value === 'yes' &&
        austrian58c4?.value === 'yes' &&
        austrian58c5 &&
        validRelations.includes(String(austrian58c5.value)) &&
        austrian58c6?.value === 'yes';

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
      const introUrl = window.location.origin + '/intro';
      const shareText = 'Check your German citizenship eligibility here:';

      if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${introUrl}`)}`, '_blank');
      } else if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(introUrl)}`, '_blank');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to simple URL sharing if image sharing fails
      const introUrl = window.location.origin + '/intro';
      if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent('Check your German citizenship eligibility here: ' + introUrl)}`, '_blank');
      } else {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(introUrl)}`, '_blank');
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
      <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#232946', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, position: 'relative' }}>
        <Container maxWidth="sm" sx={{ py: 4 }}>
          
          <StyledPaper>
            {/* Special case: not_sure */}
            {result.notSure && !showContactForm && (
              <Box sx={{
                background: result.closeSection ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                color: '#232946',
                borderRadius: 3,
                p: 4,
                mb: 4,
                textAlign: 'center',
                boxShadow: 4,
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
            )}
            {/* Contact form for not_sure case */}
            {result.notSure && showContactForm && (
              <Box width="100%" mt={2}>
                <ContactFormPositive
                  eligibleSections={result.eligibleSections || []}
                  onSuccess={handleContactSuccess}
                  userData={formState.userData}
                  formState={formState}
                />
              </Box>
            )}
            {/* Usual results logic */}
            {!result.notSure && result.isEligible && !showContactForm && (
              <>
                <CongratsCard ref={congratsCardRef}>
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
                  mb: 4
                }}>
                  <StyledButton
                    fullWidth
                    sx={{ fontSize: 18, fontWeight: 600, py: 2, mt: 0, mb: 2 }}
                    onClick={() => setShowContactForm(true)}
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
              </>
            )}
            {!result.notSure && result.isEligible && showContactForm && (
              <Box width="100%" mt={2}>
                <ContactFormPositive
                  eligibleSections={result.eligibleSections || []}
                  onSuccess={handleContactSuccess}
                  userData={formState.userData}
                  formState={formState}
                />
              </Box>
            )}
            {!result.notSure && !result.isEligible && (
              <Box sx={{
                background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                color: '#232946',
                borderRadius: 3,
                p: 4,
                mb: 4,
                textAlign: 'center',
                boxShadow: 4,
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
                <Box width="100%" mt={2}>
                  <ContactFormPage
                    formState={formState}
                    setFormState={setFormState}
                  />
                </Box>
              </Box>
            )}
            {/* Share section: now always visible */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 2, 
              width: '100%',
              mb: 4
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
                  startIcon={<WhatsAppIcon />}
                  onClick={() => captureAndShare('whatsapp')}
                  sx={{
                    background: '#25D366',
                    '&:hover': {
                      background: '#128C7E',
                    },
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    fontSize: 16,
                    fontWeight: 600
                  }}
                >
                  WhatsApp
                </Button>
                <Button
                  variant="contained"
                  startIcon={<FacebookIcon />}
                  onClick={() => captureAndShare('facebook')}
                  sx={{
                    background: '#1877F2',
                    '&:hover': {
                      background: '#0C5DC7',
                    },
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    fontSize: 16,
                    fontWeight: 600
                  }}
                >
                  Facebook
                </Button>
              </Box>
            </Box>
          </StyledPaper>
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