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
const CHAT_TEXT = "שלח/י את הבקשה ואנו נחזור אליך!";

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
          message: 'ייתכן ואת/ה זכאי/ת לסעיף §5 אך נדרשת בדיקה נוספת.',
          sections: ['§5'],
          lawCategory: 'סעיף 5: תיקון אפליה היסטורית לילדים וצאצאים של אזרחים גרמנים שאיבדו אזרחות בשל מגדר או נישואין.'
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
        lawCategory = 'קטגוריה 2: ילדים שאמם הגרמנייה איבדה את אזרחותה הגרמנית בשל נישואין לזר לפני 1.4.1953.';
        explanation = 'את/ה זכאי/ת לאזרחות גרמנית לפי סעיף §5 לחוק.';
      } else if (lostByLegitimization) {
        category = '3';
        lawCategory = 'קטגוריה 3: ילדים שאיבדו את אזרחותם הגרמנית שנרכשה בלידה בשל הכרה באב זר לפני 1.4.1953.';
        explanation = 'את/ה זכאי/ת לאזרחות גרמנית לפי סעיף §5 לחוק.';
      } else if (section5Ancestor.value === 'Mother' || section5Ancestor.value === 'Father') {
        category = '1';
        lawCategory = 'קטגוריה 1: ילדים שנולדו להורה גרמני אך לא קיבלו אזרחות גרמנית בלידה.';
        explanation = 'את/ה זכאי/ת לאזרחות גרמנית לפי סעיף §5 לחוק.';
      } else if (section5Ancestor.value === 'Grandparent' || section5Ancestor.value === 'Great-grandparent') {
        category = '4';
        lawCategory = 'קטגוריה 4: צאצאים של ילדים מהקטגוריות הנ"ל.';
        explanation = 'את/ה זכאי/ת לאזרחות גרמנית לפי סעיף §5 לחוק.';
      } else {
        category = '';
        lawCategory = '';
        explanation = 'את/ה זכאי/ת לאזרחות גרמנית לפי סעיף §5 לחוק על סמך ההיסטוריה המשפחתית.';
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
          message: 'ייתכן ואת/ה זכאי/ת לסעיף §116 אך נדרשת בדיקה נוספת.',
          sections: ['§116'],
          lawCategory: 'סעיף §116 לחוק: השבת אזרחות לנרדפי הנאצים וצאצאיהם.'
        };
      }
      // Check for §15
      const a15 = answers.find((a) => a.questionId === 'german_15_5');
      if (a15) {
        return {
          eligible: true,
          message: 'ייתכן ואת/ה זכאי/ת לסעיף §15 אך נדרשת בדיקה נוספת.',
          sections: ['§15'],
          lawCategory: 'סעיף §15 לחוק: התאזרחות לצאצאי נרדפים שלא היו אזרחים גרמנים.'
        };
      }
      // Check for Austrian §58c
      const austrian1 = answers.find((a) => a.questionId === 'austrian_58c_1');
      if (austrian1) {
        return {
          eligible: true,
          message: 'ייתכן ואת/ה זכאי/ת לסעיף §58c אך נדרשת בדיקה נוספת.',
          sections: ['§58c'],
          lawCategory: 'סעיף §58c לחוק האזרחות האוסטרי: לצאצאי נרדפי הנאצים מאוסטריה.'
        };
      }
      // Fallback
      return {
        eligible: true,
        message: 'ייתכן ואת/ה זכאי/ת, אך נדרשת בדיקה נוספת.',
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
      if (typeof austrian4.value === 'string' && ["ילד/ה", "נכד/ה", "נין/ה", "צאצא רחוק יותר"].includes(austrian4.value)) {
        return {
          eligible: true,
          message: "את/ה זכאי/ת לאזרחות אוסטרית לפי סעיף §58c. כל התנאים הנדרשים התקיימו.",
          sections: ['§58c']
        };
      } else {
        return {
          eligible: false,
          message: "אינך זכאי/ת לאזרחות אוסטרית כיוון שאינך צאצא ישיר של האב.",
          sections: []
        };
      }
    }

    // If the user selected 'Not directly related' for german_15_5, always return negative result
    if (answers && answers.find((a) => a.questionId === 'german_15_5' && a.value === 'לא קרוב משפחה ישיר')) {
      return {
        eligible: false,
        message: "אינך זכאי/ת כיוון שאינך קרוב/ת משפחה ישיר/ה של האב.",
        sections: []
      };
    }

    // If no state is provided, return default not eligible state
    if (!location.state) {
      return {
        eligible: false,
        message: "נא השלם/י את השאלון כדי לבדוק זכאות.",
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
          message: "את/ה זכאי/ת לאזרחות גרמנית לפי סעיף §116 לחוק. כל התנאים הנדרשים התקיימו.",
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
          message: "את/ה זכאי/ת לאזרחות גרמנית לפי סעיף §15 לחוק. אבותיך לא היו אזרחים גרמנים, אך שאר התנאים התקיימו.",
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
      const no15_5 = answers.find((a) => a.questionId === 'german_15_5' && a.value === 'לא קרוב משפחה ישיר');

      if (no116_1) negativeReason = "אינך זכאי/ת כיוון שאבותיך לא נרדפו על ידי המשטר הנאצי.";
      else if (no116_2) negativeReason = "אינך זכאי/ת כיוון שאבותיך לא היו אזרחים או תושבים גרמנים לפני או במהלך תקופת הנאצים.";
      else if (no116_3) negativeReason = "אינך זכאי/ת כיוון שאבותיך לא התגוררו בגרמניה או בשטח בשליטת הנאצים בזמן הרלוונטי.";
      else if (no116_4) negativeReason = "אינך זכאי/ת כיוון שאבותיך לא ברחו בשל רדיפה בין 1933 ל-1945.";
      else if (no116_4a) negativeReason = "אינך זכאי/ת כיוון שאבותיך לא עזבו את גרמניה (או שטח בשליטת הנאצים) בין 1926 ל-1933.";
      else if (no15_5) negativeReason = "אינך זכאי/ת כיוון שאינך קרוב/ת משפחה ישיר/ה של האב.";

      // Use explanation from navigation state if present
      if (location.state && location.state.explanation) {
        // If the explanation is in English, override with Hebrew fallback
        const explanation = location.state.explanation;
        const isEnglish = /[a-zA-Z]/.test(explanation);
        if (!isEnglish) {
          negativeReason = explanation;
        }
      }

      return {
        eligible: false,
        message: negativeReason || "לצערנו, לא נמצאה זכאות על פי התשובות שמילאת. אם ברצונך לבדוק את זכאותך באופן אישי, ניתן להשאיר פרטים ונציג יחזור אליך.",
        sections: []
      };
    }

    // If we have no answers at all, redirect to questions
    navigate('/questions');
    return {
      eligible: false,
      message: "נא השלם/י את השאלון כדי לבדוק זכאות.",
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
              חזרה לבחירת מדינה
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
                <CongratsCard ref={congratsCardRef} sx={{ width: '100%', mb: 2, direction: 'rtl', textAlign: 'right' }}>
                  {result.eligible ? (
                    <CelebrationIcon sx={{ fontSize: 48, mb: 1 }} />
                  ) : (
                    <CancelIcon sx={{ fontSize: 48, mb: 1, color: '#232946' }} />
                  )}
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#232946', direction: 'rtl', textAlign: 'right' }}>
                    {result.eligible ? `מזל טוב${userName ? ` ${userName}` : ''}!` : 'לצערנו, לא נמצאה זכאות'}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontWeight: 600, 
                    color: '#232946', 
                    mb: 1, 
                    whiteSpace: 'pre-line', 
                    textAlign: 'right',
                    fontSize: '1.25rem',
                    lineHeight: 1.5,
                    direction: 'rtl',
                  }}>
                    {assessmentNeeded
                      ? `ייתכן ואת/ה זכאי/ת ל${result.sections && result.sections.length > 0 ? ` ${result.sections.join(', ')}` : ''} אך נדרשת בדיקה נוספת.`
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
                          direction: 'rtl',
                          textAlign: 'right',
                        }}>
                          {notSureQuestion ? (
                            <>
                              <span>סימנת שאינך בטוח/ה לגבי השאלה: "{notSureQuestion.text}"</span>
                              <br />
                              <span style={{ display: 'block', marginTop: 8, fontWeight: 500, fontSize: 14 }}>
                                נשמח לעזור בבדיקת זכאותך באופן אישי.
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
                        המשך למחקר ארכיוני
                      </Box>
                      <Box sx={{ fontSize: 12, color: '#232946', opacity: 0.6, fontWeight: 400, mt: 0.5 }}>
                        יש למלא פרטים נוספים
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
                    אני מעוניין/ת שיחזרו אליי מנציג
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
                    fontWeight: 500,
                    direction: 'rtl',
                    textAlign: 'right',
                  }}>
                    שתף את בודק הזכאות עם חברים:
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
        direction: 'rtl',
        textAlign: 'right',
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
                startIcon={<PublicIcon sx={{ ml: 1, fontSize: 22 }} />}
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                בקרו באתר שלנו
              </Button>
              <Button
                href="https://www.facebook.com/deckerpexlevi"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<FacebookIcon sx={{ ml: 1, fontSize: 22 }} />}
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                עקבו אחרינו בפייסבוק
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: { xs: 1, sm: 4 } }}>
              <Button
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<WhatsAppIcon sx={{ ml: 1, fontSize: 22 }} />}
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                צרו קשר בוואטסאפ
              </Button>
              <Button
                href="https://www.youtube.com/@DeckerPexLawoffice"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<YouTubeIcon sx={{ ml: 1, fontSize: 22 }} />}
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                ערוץ היוטיוב
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
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, direction: 'rtl' }}>
          שתף את התוצאה שלך
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.87)', textAlign: 'center', mb: 2, direction: 'rtl' }}>
            הקישור שותף. ניתן להוריד את תמונת התוצאה ולשתף ידנית:
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