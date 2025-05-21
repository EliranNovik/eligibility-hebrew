import { useState, useEffect, useRef } from 'react';
import { Container, Card, CardContent, Typography, Button, TextField, Alert, Box, Avatar, Fade, MenuItem, Select, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import type { FormState } from '../types';

const AVATARS = ['/Avatar1.png'];
const CHAT_TEXT = "Submit your information and we'll get back to you! We at Decker Pex Levi will review your case, conduct an archival research and provide you with a free consultation.";

interface ContactFormProps {
  eligibleSections: string[];
  onSuccess: () => void;
  userData: { fullName: string; email: string };
  formState: FormState;
}

const COUNTRY_CODES = [
  { code: '+49', label: '🇩🇪 +49' },
  { code: '+43', label: '🇦🇹 +43' },
  { code: '+972', label: '🇮🇱 +972' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+33', label: '🇫🇷 +33' },
  { code: '+39', label: '🇮🇹 +39' },
  { code: '+7', label: '🇷🇺 +7' },
  { code: '+34', label: '🇪🇸 +34' },
  { code: '+31', label: '🇳🇱 +31' },
  { code: '+41', label: '🇨🇭 +41' },
  { code: '+48', label: '🇵🇱 +48' },
  { code: '+420', label: '🇨🇿 +420' },
  { code: '+36', label: '🇭🇺 +36' },
  { code: '+380', label: '🇺🇦 +380' },
  { code: '+386', label: '🇸🇮 +386' },
  { code: '+40', label: '🇷🇴 +40' },
  { code: '+90', label: '🇹🇷 +90' },
  { code: '+27', label: '🇿🇦 +27' },
];

const ContactForm = ({ eligibleSections, onSuccess, userData, formState }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    phone: '',
    persecutedName: '',
    persecutedDob: '',
    persecutedPlace: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [typedText, setTypedText] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);

  useEffect(() => {
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setMessageType(null);

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
      name: userData.fullName,
      topic: `${selectedCountry} Citizenship - ${eligibleSections[0]}`,
      desc: `Persecuted Person: ${formData.persecutedName}\nDate of Birth: ${formData.persecutedDob}\nPlace of Birth: ${formData.persecutedPlace}`,
      email: userData.email,
      phone: `${countryCode}${formData.phone.replace(/^\+\d+\s*/, '')}`,
      ref_url: window.location.href,
      user_data: JSON.stringify({
        persecutedName: formData.persecutedName,
        persecutedDob: formData.persecutedDob,
        persecutedPlace: formData.persecutedPlace,
        eligibleSections,
        phone: `${countryCode}${formData.phone.replace(/^\+\d+\s*/, '')}`,
      }),
    });
    const url = `https://backend-eligibility-checker.onrender.com/api/proxy?${params.toString()}`;
    try {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    console.log('Form field updated:', { field: name, value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove country code if user types it manually
    let value = e.target.value.replace(/^\+\d+\s*/, '');
    setFormData(prev => ({
      ...prev,
      phone: `${countryCode} ${value}`.trim(),
    }));
  };

  const handleCountryCodeChange = (e: any) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    // Remove old code and update phone
    setFormData(prev => {
      const value = prev.phone.replace(/^\+\d+\s*/, '');
      return { ...prev, phone: `${newCode} ${value}`.trim() };
    });
  };

  const handleSubmitWithoutContact = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogContinue = () => {
    console.log('Submitting without contact information');
    setOpenDialog(false);
    setShowThankYou(true);
  };

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
                Thank You!
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.87)', 
                fontWeight: 500,
                maxWidth: '80%',
                lineHeight: 1.6
              }}>
                We at Decker Pex Levi Law Offices have received your submition and will get back to you as soon as possible.
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 2, 
                width: '100%',
                mt: 2 
              }}>
                <Typography variant="subtitle1" sx={{ 
                  color: 'rgba(255,255,255,0.87)', 
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
                    onClick={() => {
                      const url = encodeURIComponent(window.location.origin);
                      window.open(`https://wa.me/?text=Check%20your%20German%20citizenship%20eligibility%20here:%20${url}`, '_blank');
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
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={onSuccess}
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

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card sx={{ width: '100%', boxShadow: 6, bgcolor: '#1a1a1a', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar src={avatar} sx={{ width: 72, height: 72, mb: 2, bgcolor: '#646cff', boxShadow: 3 }} />
            <Box sx={{ bgcolor: '#fff', color: '#232946', borderRadius: 3, px: 3, py: 2, fontSize: 18, fontWeight: 500, boxShadow: 2, maxWidth: 340, minHeight: 56, textAlign: 'center' }}>
              {typedText}
            </Box>
          </Box>

          <Typography variant="h5" align="center" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
            Contact Information
          </Typography>
          {message && (
            <Alert severity={messageType === 'success' ? 'success' : 'error'} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'flex-start', width: '100%' }}>
              <Select
                value={countryCode}
                onChange={handleCountryCodeChange}
                variant="outlined"
                sx={{
                  minWidth: 120,
                  background: '#fff',
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                  '& .MuiOutlinedInput-input': {
                    padding: '16.5px 14px',
                  },
                  '& .MuiSelect-select': { 
                    display: 'flex', 
                    alignItems: 'center',
                  },
                  marginTop: '16px',
                }}
                MenuProps={{
                  PaperProps: {
                    sx: { bgcolor: '#fff', color: '#232946', fontWeight: 600 }
                  }
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
                name="phone"
                type="tel"
                value={formData.phone.replace(/^\+\d+\s*/, '')}
                onChange={handlePhoneChange}
                required
                fullWidth
                margin="normal"
                InputProps={{
                  style: {
                    background: '#fff',
                    borderRadius: 8,
                    fontSize: 18,
                    fontWeight: 500,
                    color: '#232946',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                    height: '56px',
                  },
                }}
                InputLabelProps={{ shrink: false }}
                sx={{ flex: 1 }}
              />
            </Box>
            <TextField
              placeholder="Name of Persecuted"
              name="persecutedName"
              value={formData.persecutedName}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              InputProps={{
                style: {
                  background: '#fff',
                  borderRadius: 8,
                  fontSize: 18,
                  fontWeight: 500,
                  color: '#232946',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
                }
              }}
              InputLabelProps={{ shrink: false }}
            />
            <TextField
              placeholder="Date of Birth"
              name="persecutedDob"
              type="text"
              value={formData.persecutedDob}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              InputProps={{
                style: {
                  background: '#fff',
                  borderRadius: 8,
                  fontSize: 18,
                  fontWeight: 500,
                  color: '#232946',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
                }
              }}
              InputLabelProps={{ shrink: false }}
            />
            <TextField
              placeholder="Place of Birth of Persecuted"
              name="persecutedPlace"
              value={formData.persecutedPlace}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              InputProps={{
                style: {
                  background: '#fff',
                  borderRadius: 8,
                  fontSize: 18,
                  fontWeight: 500,
                  color: '#232946',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
                }
              }}
              InputLabelProps={{ shrink: false }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleSubmitWithoutContact}
              sx={{
                fontWeight: 700,
                fontSize: 18,
                borderRadius: 3,
                color: '#646cff',
                borderColor: '#646cff',
                '&:hover': {
                  borderColor: '#535bf2',
                  color: '#535bf2',
                },
              }}
            >
              Submit without Contact Information
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
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
          Confirmation
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.87)', textAlign: 'center', mb: 2 }}>
            You are about to submit your form with the information provided in previous sections. Please be aware that by providing information about the persecuted we are able to provide a free archival research and consultation.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button
            onClick={handleDialogClose}
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
            Cancel
          </Button>
          <Button
            onClick={handleDialogContinue}
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #646cff, #535bf2)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(90deg, #535bf2, #646cff)',
              },
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContactForm; 