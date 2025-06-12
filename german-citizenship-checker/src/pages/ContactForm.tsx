import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Paper, Alert, Select, MenuItem, FormControl, InputLabel, Avatar, Fade } from '@mui/material';
import { supabase } from '../lib/supabase';
import type { FormState, Question } from '../types';
import Header from '../components/Header';
import { questions } from '../questions/questions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PublicIcon from '@mui/icons-material/Public';
import YouTubeIcon from '@mui/icons-material/YouTube';

// Country codes for phone numbers
const COUNTRY_CODES = [
  { code: '+1', label: '+1 (US/CA)' },
  { code: '+44', label: '+44 (UK)' },
  { code: '+49', label: '+49 (DE)' },
  { code: '+972', label: '+972 (IL)' },
  { code: '+61', label: '+61 (AU)' },
  { code: '+33', label: '+33 (FR)' },
  { code: '+34', label: '+34 (ES)' },
  { code: '+39', label: '+39 (IT)' },
  { code: '+31', label: '+31 (NL)' },
  { code: '+32', label: '+32 (BE)' },
  { code: '+41', label: '+41 (CH)' },
  { code: '+43', label: '+43 (AT)' },
  { code: '+7', label: '+7 (RU)' },
  { code: '+380', label: '+380 (UA)' },
  { code: '+27', label: '+27 (ZA)' },
  { code: '+55', label: '+55 (BR)' },
  { code: '+54', label: '+54 (AR)' },
  { code: '+91', label: '+91 (IN)' },
  { code: '+86', label: '+86 (CN)' },
  { code: '+81', label: '+81 (JP)' },
  { code: '+90', label: '+90 (TR)' },
  { code: '+30', label: '+30 (GR)' },
  { code: '+351', label: '+351 (PT)' },
];

const CONTACT_METHODS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
];

interface ContactFormProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  hideHeader?: boolean;
}

// Helper to format answers as readable string
function formatAnswersForDescription(answers: any[]) {
  return answers.map(answer => {
    const question = questions.find((q: Question) => q.id === answer.questionId);
    return `- ${question ? question.text : answer.questionId}: ${answer.value}`;
  }).join('\n');
}

async function saveContactSubmission(userData: any, formType?: string) {
  // Get all questions from the questions array
  const formattedAnswers = userData.answers.map((answer: any) => {
    const question = questions.find((q: Question) => q.id === answer.questionId);
    return {
      question: question ? question.text : answer.questionId,
      answer: answer.value
    };
  });

  const answersPretty = formatAnswersForDescription(userData.answers);

  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([
      {
        user_data: {
          fullName: userData.fullName,
          email: userData.email,
          phone: `${userData.phone}`,
          comments: userData.comments,
          answers: formattedAnswers,
          answers_pretty: answersPretty,
          contactMethod: userData.contactMethod,
        },
        form_type: formType || 'negative'
      }
    ]);
  if (error) {
    console.error('Error saving contact submission:', error);
  }
  return data;
}

const ContactForm = ({ formState, setFormState, hideHeader = false }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);
  const [showThankYou, setShowThankYou] = useState(false);
  const [contactMethod, setContactMethod] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setMessageType(null);

    try {
      // Get the selected country
      const countryAnswer = formState.answers.find((a: { questionId: string }) => a.questionId === 'country_selection');
      const selectedCountry = countryAnswer?.value as string || 'Unknown';

      // Generate random sid
      const sid = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Prepare params
      const formattedQnA = formatAnswersForDescription(formState.answers);
      const params = new URLSearchParams({
        uid: 'fxSOVhSeeRs9',
        lead_source: '31234',
        sid,
        name: formState.userData.fullName || '',
        topic: `${selectedCountry} Citizenship - Not Eligible`,
        desc: `The client wants to be contacted by ${CONTACT_METHODS.find(m => m.value === contactMethod)?.label || contactMethod}.\nComments: ${formState.userData.comments || 'No comments provided'}\nFacts of Case:\n${formattedQnA}`,
        email: formState.userData.email || '',
        phone: `${countryCode}${formState.userData.phone}`,
        ref_url: window.location.href,
      });

      const url = `https://backend-eligibility-checker.onrender.com/api/proxy?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      setShowThankYou(true);
      await saveContactSubmission(formState.userData, 'negative');
    } catch (error) {
      setMessage('There was an error submitting your information. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      userData: {
        ...prev.userData,
        [field]: value,
      },
    }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, spaces, dashes, and parentheses
    let value = e.target.value.replace(/[^0-9\s\-()]/g, '');
    handleInputChange('phone', value);
  };

  const handleCountryCodeChange = (e: any) => {
    setCountryCode(e.target.value);
  };

  const handleContactMethodChange = (e: any) => {
    setContactMethod(e.target.value);
  };

  const handleStartNewCheck = () => {
    setFormState({
      answers: [],
      currentStep: 0,
      userData: {
        fullName: '',
        email: '',
        phone: '',
        comments: '',
      },
    });
  };

  // Custom back logic (like QuestionFlow)
  const handleBack = () => {
    navigate('/results', { state: location.state });
  };

  // Defensive defaults for userData
  const userData = formState.userData || { phone: '', comments: '', fullName: '', email: '' };

  if (showThankYou) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Fade in={showThankYou} timeout={1000}>
          <Paper sx={{ 
            width: '100%', 
            boxShadow: 6, 
            bgcolor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            p: 4
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 3,
              textAlign: 'center',
              color: '#232946',
            }}>
              <CheckCircleIcon sx={{ 
                fontSize: 80, 
                color: '#43e97b',
              }} />
              <Typography variant="h4" sx={{ 
                color: '#232946', 
                fontWeight: 700,
              }}>
                Thank You{formState.userData.fullName ? ` ${formState.userData.fullName}` : ''}!
              </Typography>
              <Typography variant="h6" sx={{ 
                color: '#232946', 
                fontWeight: 500,
                maxWidth: '80%',
                lineHeight: 1.6
              }}>
                We at Decker Pex Levi Law Offices have received your submission and will get back to you as soon as possible.
              </Typography>
              <Typography sx={{ color: '#232946', fontWeight: 600, mt: 2, mb: 1, fontSize: 16 }}>
                <span style={{ color: '#232946' }}>Share the eligibility checker with your friends:</span>
              </Typography>
              <Box sx={{
                display: 'flex',
                gap: 2,
                mt: 1,
                justifyContent: 'center',
              }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    const shareUrl = 'https://eligibility-checker-o4xu.onrender.com/';
                    const shareText = 'Check your German citizenship eligibility here:';
                    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
                  }}
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
                  onClick={() => {
                    const shareUrl = 'https://eligibility-checker-o4xu.onrender.com/';
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                  }}
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
          </Paper>
        </Fade>
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
                  href="https://wa.me/+972503489649"
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
      </Container>
    );
  }

  if (hideHeader) {
    return (
      <Box sx={{ 
        width: '100%', 
        maxWidth: 420, 
        mx: 'auto', 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 4,
        boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.15)',
        color: '#232946',
      }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%', mb: 2 }}>
  <Button
    variant="contained"
    color="primary"
    startIcon={<ArrowBackIcon sx={{ fontSize: 28 }} />}
    onClick={handleBack}
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
    Back
  </Button>
</Box>
        <Typography variant="h5" align="center" fontWeight={700} gutterBottom sx={{ color: '#232946', mt: 1 }}>
          <span style={{ color: '#000' }}>Contact Information</span>
        </Typography>
        <Typography align="center" sx={{ mb: 2, fontWeight: 600, fontSize: 18, lineHeight: 1.6, color: '#000' }}>
          Please provide your phone number and any comments. We will get in touch with you about your eligibility assessment.
        </Typography>
        {message && (
          <Alert severity={messageType === 'success' ? 'success' : 'error'} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <Select
            value={contactMethod}
            onChange={handleContactMethodChange}
            variant="outlined"
            displayEmpty
            renderValue={selected =>
              selected ? CONTACT_METHODS.find(opt => opt.value === selected)?.label : 'How do you wish to be contacted?'
            }
            sx={{
              minWidth: 180,
              bgcolor: 'rgba(255,255,255,0.9)',
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 16,
              mb: 1,
              '& .MuiOutlinedInput-input': {
                padding: '16.5px 14px',
              },
              '& .MuiSelect-select': { 
                display: 'flex', 
                alignItems: 'center',
              },
              marginTop: '8px',
            }}
          >
            <MenuItem value="" disabled>
              How do you wish to be contacted?
            </MenuItem>
            {CONTACT_METHODS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', width: '100%' }}>
            <Select
              value={countryCode}
              onChange={handleCountryCodeChange}
              variant="outlined"
              sx={{
                minWidth: 120,
                bgcolor: 'rgba(255,255,255,0.9)',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 16,
                '& .MuiOutlinedInput-input': {
                  padding: '16.5px 14px',
                },
                '& .MuiSelect-select': { 
                  display: 'flex', 
                  alignItems: 'center',
                },
                marginTop: '16px',
              }}
            >
              {COUNTRY_CODES.map(option => (
                <MenuItem key={option.code} value={option.code}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <TextField
              placeholder="Phone Number"
              type="tel"
              value={userData.phone}
              onChange={handlePhoneChange}
              required
              fullWidth
              margin="normal"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                borderRadius: 2,
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#646cff',
                  },
                },
              }}
            />
          </Box>
          <TextField
            placeholder="Comments"
            value={userData.comments || ''}
            onChange={e => handleInputChange('comments', e.target.value)}
            multiline
            minRows={3}
            fullWidth
            margin="normal"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.9)', 
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#646cff',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ 
              fontWeight: 700, 
              fontSize: 18, 
              py: 1.5, 
              mt: 2, 
              borderRadius: 3, 
              background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(100, 108, 255, 0.2)',
              '&:hover': {
                background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Information'}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Header showBackButton={false} />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          bgcolor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          p: 0,
          m: 0,
          color: '#232946',
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
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(35, 41, 70, 0.5)',
            zIndex: 1,
          },
          zIndex: 1,
        }}
      >
        <Container maxWidth="sm" sx={{ 
          position: 'relative', 
          zIndex: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: { xs: '90vh', sm: 650 },
          maxWidth: 400,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 4,
          boxShadow: '0 6px 32px 0 rgba(0,0,0,0.10)',
          p: { xs: 2, sm: 6 },
          color: '#232946',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon sx={{ fontSize: 28 }} />}
              onClick={handleBack}
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
              Back
            </Button>
          </Box>
          <Typography variant="h5" align="center" fontWeight={700} gutterBottom sx={{ color: '#fff', mt: 1 }}>
            <span style={{ color: '#000' }}>Contact Information</span>
          </Typography>
          <Typography align="center" sx={{ mb: 2, fontWeight: 600, fontSize: 18, lineHeight: 1.6, color: '#000' }}>
            Please provide your phone number and any comments. We will get in touch with you about your eligibility assessment.
          </Typography>
          {message && (
            <Alert severity={messageType === 'success' ? 'success' : 'error'} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <Select
              value={contactMethod}
              onChange={handleContactMethodChange}
              variant="outlined"
              displayEmpty
              renderValue={selected =>
                selected ? CONTACT_METHODS.find(opt => opt.value === selected)?.label : 'How do you wish to be contacted?'
              }
              sx={{
                minWidth: 180,
                bgcolor: '#fff',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 16,
                mb: 1,
                '& .MuiOutlinedInput-input': {
                  padding: '16.5px 14px',
                },
                '& .MuiSelect-select': { 
                  display: 'flex', 
                  alignItems: 'center',
                },
                marginTop: '8px',
              }}
            >
              <MenuItem value="" disabled>
                How do you wish to be contacted?
              </MenuItem>
              {CONTACT_METHODS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', width: '100%' }}>
              <Select
                value={countryCode}
                onChange={handleCountryCodeChange}
                variant="outlined"
                sx={{
                  minWidth: 120,
                  bgcolor: '#fff',
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: 16,
                  '& .MuiOutlinedInput-input': {
                    padding: '16.5px 14px',
                  },
                  '& .MuiSelect-select': { 
                    display: 'flex', 
                    alignItems: 'center',
                  },
                  marginTop: '16px',
                }}
              >
                {COUNTRY_CODES.map(option => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                placeholder="Phone Number"
                type="tel"
                value={userData.phone}
                onChange={handlePhoneChange}
                required
                fullWidth
                margin="normal"
                sx={{ 
                  bgcolor: '#fff', 
                  borderRadius: 2,
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(100, 108, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(100, 108, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#646cff',
                    },
                  },
                }}
              />
            </Box>
            <TextField
              placeholder="Comments"
              value={userData.comments || ''}
              onChange={e => handleInputChange('comments', e.target.value)}
              multiline
              minRows={3}
              fullWidth
              margin="normal"
              sx={{ 
                bgcolor: '#fff', 
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(100, 108, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(100, 108, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#646cff',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ 
                fontWeight: 700, 
                fontSize: 18, 
                py: 1.5, 
                mt: 2, 
                borderRadius: 3, 
                background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(100, 108, 255, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Information'}
            </Button>
          </Box>
        </Container>
      </Box>
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
    </>
  );
};

export default ContactForm; 