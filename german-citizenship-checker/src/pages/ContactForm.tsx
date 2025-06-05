import { useState } from 'react';
import type { FormState } from '../types';
import type { ChangeEvent, FormEvent } from 'react';
import { Container, Card, CardContent, Typography, Button, TextField, Alert, Box, Select, MenuItem, Fade } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// Country codes for phone numbers
const COUNTRY_CODES = [
  { code: '+1', label: '+1 (US/CA)' },
  { code: '+44', label: '+44 (UK)' },
  { code: '+49', label: '+49 (DE)' },
  { code: '+972', label: '+972 (IL)' },
  { code: '+61', label: '+61 (AU)' },
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

const ContactForm = ({ formState, setFormState, hideHeader = false }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);
  const [showThankYou, setShowThankYou] = useState(false);
  const [contactMethod, setContactMethod] = useState('');
  const navigate = useNavigate();

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
      const params = new URLSearchParams({
        uid: 'fxSOVhSeeRs9',
        lead_source: '31234',
        sid,
        name: formState.userData.fullName || '',
        topic: `${selectedCountry} Citizenship - Not Eligible`,
        desc: `Preferred Contact Method: ${contactMethod}\nComments: ${formState.userData.comments || 'No comments provided'}`,
        email: formState.userData.email || '',
        phone: `${countryCode}${formState.userData.phone.replace(/^\+\d+\s*/, '')}`,
        ref_url: window.location.href,
        user_data: JSON.stringify({
          comments: formState.userData.comments,
          phone: `${countryCode}${formState.userData.phone.replace(/^\+\d+\s*/, '')}`,
          answers: formState.answers,
          contactMethod,
        }),
      });

      const url = `https://backend-eligibility-checker.onrender.com/api/proxy?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      setShowThankYou(true);
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
    // Remove country code if user types it manually
    let value = e.target.value.replace(/^\+\d+\s*/, '');
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

  // Defensive defaults for userData
  const userData = formState.userData || { phone: '', comments: '', fullName: '', email: '' };

  if (showThankYou) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Fade in={showThankYou} timeout={1000}>
          <Card sx={{ 
            width: '100%', 
            boxShadow: 6, 
            bgcolor: '#1a1a1a', 
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
              textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ 
                fontSize: 80, 
                color: '#43e97b',
                animation: 'scaleIn 0.5s ease-out'
              }} />
              <Typography variant="h4" sx={{ 
                color: 'white', 
                fontWeight: 700,
                background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Thank You{formState.userData.fullName ? ` ${formState.userData.fullName}` : ''}!
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.87)', 
                fontWeight: 500,
                maxWidth: '80%',
                lineHeight: 1.6
              }}>
                We at Decker Pex Levi Law Offices have received your submission and will get back to you as soon as possible.
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mt: 2 
              }}>
                <Button
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  onClick={() => {
                    const url = encodeURIComponent(window.location.origin);
                    window.open(`https://wa.me/?text=${encodeURIComponent('Check your German citizenship eligibility here: ' + url)}`, '_blank');
                  }}
                  sx={{
                    background: '#25D366',
                    '&:hover': {
                      background: '#128C7E',
                    },
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  WhatsApp
                </Button>
                <Button
                  variant="contained"
                  startIcon={<FacebookIcon />}
                  onClick={() => {
                    const url = encodeURIComponent(window.location.origin);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                  }}
                  sx={{
                    background: '#1877F2',
                    '&:hover': {
                      background: '#0C5DC7',
                    },
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Facebook
                </Button>
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={handleStartNewCheck}
                sx={{
                  mt: 2,
                  fontWeight: 700,
                  fontSize: 18,
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #646cff, #535bf2)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #535bf2, #646cff)',
                  },
                }}
              >
                Start New Check
              </Button>
            </Box>
          </Card>
        </Fade>
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
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 4,
        boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.15)',
      }}>
        <Typography variant="h5" align="center" fontWeight={700} gutterBottom sx={{ color: 'white', mt: 1 }}>
          Contact Information
        </Typography>
        <Typography align="center" sx={{ mb: 2, fontWeight: 600, fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.87)' }}>
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
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        bgcolor: 'rgba(35, 41, 70, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        p: 0,
        m: 0,
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
      }}
    >
      <Header showBackButton onBack={() => navigate('/results')} />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: { xs: '80vh', sm: 500 } }}>
        <Card sx={{ width: '100%', maxWidth: 420, mx: 'auto', boxShadow: 4, borderRadius: 4, p: 3, bgcolor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" align="center" fontWeight={700} gutterBottom sx={{ color: '#232946', mt: 1 }}>
            Contact Information
          </Typography>
          <Typography align="center" color="#232946" sx={{ mb: 2, fontWeight: 600, fontSize: 18, lineHeight: 1.6 }}>
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
        </Card>
      </Container>
    </Box>
  );
};

export default ContactForm; 