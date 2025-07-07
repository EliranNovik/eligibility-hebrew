import { useState, useEffect, useRef } from 'react';
import { Container, Card, CardContent, Typography, Button, TextField, Alert, Box, Avatar, Fade, MenuItem, Select, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, FormControl } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import type { FormState, Question } from '../types';
import { supabase, saveEligibilityResult } from '../lib/supabase';
import { questions } from '../questions/questions';

const AVATAR_SRC = '/MDPIC.jpg';
const CHAT_TEXT = "שלח/י את פרטיך ואנו נחזור אליך! אנו במשרד דקר פקס לוי נבדוק את המקרה שלך, נבצע מחקר ארכיוני ונספק לך ייעוץ ראשוני חינם.";

interface ContactFormProps {
  eligibleSections: string[];
  onSuccess: () => void;
  userData: { fullName: string; email: string };
  formState: FormState;
}

const COUNTRY_CODES = [
  { code: '+972', label: '🇮🇱 +972' },
  { code: '+49', label: '🇩🇪 +49' },
  { code: '+43', label: '🇦🇹 +43' },
  
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

// Helper to format answers as readable string
function formatAnswersForDescription(answers: any[]) {
  return answers.map(answer => {
    const question = questions.find((q: Question) => q.id === answer.questionId);
    return `- ${question ? question.text : answer.questionId}: ${answer.value}`;
  }).join('\n');
}

async function saveContactSubmission(userData: any, formType?: string) {
  // Only map if userData.answers exists and is an array
  const formattedAnswers = Array.isArray(userData.answers)
    ? userData.answers.map((answer: any) => {
        const question = questions.find((q: Question) => q.id === answer.questionId);
        return {
          question: question ? question.text : answer.questionId,
          answer: answer.value
        };
      })
    : [];

  const answersPretty = Array.isArray(userData.answers) ? formatAnswersForDescription(userData.answers) : '';

  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([
      {
        user_data: {
          ...userData,
          answers: formattedAnswers,
          answers_pretty: answersPretty,
        },
        form_type: formType || 'positive',
      }
    ]);
  if (error) {
    console.error('Error saving contact submission:', error);
  }
  return data;
}

// Map eligibility section to Hebrew label for topic
const sectionToHebrew: Record<string, string> = {
  '§5': 'סעיף 5',
  '§15': 'סעיף 15',
  '§116': 'סעיף 116',
  '§58c': 'סעיף 58c',
};

function getSectionLabel(section?: string) {
  if (!section) return '';
  return sectionToHebrew[section] || section;
}

const ContactForm = ({ eligibleSections, onSuccess, userData, formState }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    phone: '',
    persecutedName: '',
    persecutedDob: '',
    persecutedPlace: '',
    additionalInfo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [typedText, setTypedText] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const timeoutRef = useRef<number | null>(null);
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
    const formattedQnA = formatAnswersForDescription(formState.answers);
    const sectionLabel = getSectionLabel(eligibleSections[0]);
    const params = new URLSearchParams({
      uid: 'fxSOVhSeeRs9',
      lead_source: '31234',
      sid,
      name: userData.fullName,
      topic: `${selectedCountry} אזרחות - ${sectionLabel}`,
      desc: `Persecuted Person: ${formData.persecutedName}\nDate of Birth: ${formData.persecutedDob}\nPlace of Birth: ${formData.persecutedPlace}\nAdditional Information: ${formData.additionalInfo}\nFacts of Case:\n${formattedQnA}`,
      email: userData.email,
      phone: `${countryCode}${formData.phone}`,
      ref_url: window.location.href,
    });
    const url = `https://backend-eligibility-checker.onrender.com/api/proxy?${params.toString()}`;
    try {
      // Send to external API endpoint first
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');

      // Prepare user data with all required fields
      const submissionData = {
        ...userData,
        phone: `${countryCode}${formData.phone}`,
        persecutedName: formData.persecutedName,
        persecutedDob: formData.persecutedDob,
        persecutedPlace: formData.persecutedPlace,
        additionalInfo: formData.additionalInfo,
        answers: formState.answers,
        answers_pretty: formattedQnA,
      };

      // Save contact form submission using the helper function
      await saveContactSubmission(submissionData, 'positive');
      setShowThankYou(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Failed to submit form. Please try again.');
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
    // Only allow digits, spaces, dashes, and parentheses
    let value = e.target.value.replace(/[^0-9\s\-()]/g, '');
    setFormData(prev => ({
      ...prev,
      phone: value,
    }));
  };

  const handleCountryCodeChange = (e: any) => {
    setCountryCode(e.target.value);
  };

  const handleSubmitWithoutContact = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogContinue = async () => {
    setOpenDialog(false);
    setIsSubmitting(true);
    setMessage(null);
    setMessageType(null);
    try {
      // Get the selected country
      const countryAnswer = formState.answers.find((a: { questionId: string }) => a.questionId === 'country_selection');
      const selectedCountry = countryAnswer?.value as string || 'Unknown';
      // Prepare Q&A
      const formattedQnA = formatAnswersForDescription(formState.answers);
      // Prepare params for endpoint
      const sectionLabel = getSectionLabel(eligibleSections[0]);
      const params = new URLSearchParams({
        uid: 'fxSOVhSeeRs9',
        lead_source: '31234',
        sid: Math.floor(100000 + Math.random() * 900000).toString(),
        name: userData.fullName,
        topic: `${selectedCountry} אזרחות - ${sectionLabel}`,
        desc: `Facts of Case:\n${formattedQnA}`,
        email: userData.email,
        phone: `${countryCode}${formData.phone}`,
        ref_url: window.location.href,
      });
      const url = `https://backend-eligibility-checker.onrender.com/api/proxy?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');

      // Prepare user data with all required fields
      const submissionData = {
        ...userData,
        phone: `${countryCode}${formData.phone}`,
        answers: formState.answers,
        answers_pretty: formattedQnA,
      };

      // Save contact form submission using the helper function
      await saveContactSubmission(submissionData, 'positive');
      setShowThankYou(true);
    } catch (error) {
      setMessage('Failed to submit form. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotSure = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: 'אני לא בטוח/ה בשלב הזה.',
    }));
  };

  // Always use +972 as default if countryCode is not set
  const getFullPhone = () => {
    const code = countryCode || '+972';
    return formData.phone ? `${code}${formData.phone}` : '';
  };

  if (showThankYou) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in={showThankYou} timeout={1000}>
          <Box sx={{ 
            width: '100%',
            maxWidth: 800,
            borderRadius: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            p: 4,
            mx: 'auto',
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
                WebkitTextFillColor: 'transparent',
                direction: 'rtl',
                textAlign: 'right',
              }}>
                {'!'}תודה
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.87)', 
                fontWeight: 500,
                maxWidth: '80%',
                lineHeight: 1.6,
                direction: 'rtl',
                textAlign: 'right',
              }}>
                משרד דקר פקס לוי קיבל את פנייתך ונחזור אליך בהקדם האפשרי.
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
                  fontWeight: 500,
                  textAlign: 'right',
                  direction: 'rtl',
                }}>
                  שתף את בודק הזכאות עם חברים:
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'flex-start',
                }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const url = encodeURIComponent(window.location.origin);
                      window.open(`https://wa.me/?text=Check%20your%20German%20citizenship%20eligibility%20here:%20${url}`, '_blank');
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
                      const url = encodeURIComponent(window.location.origin);
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
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
            </Box>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 'auto', p: 2, pb: { xs: 10, sm: 4 } }}>
        <CardContent sx={{ width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0, mx: 'auto' }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar src="/MDPIC.jpg" alt="Michael Decker" sx={{ width: 120, height: 120, mb: 2, boxShadow: 4 }} />
            <Box sx={{ background: 'white', color: '#232946', borderRadius: 4, p: { xs: 2, md: 3 }, fontSize: { xs: 18, md: 20 }, fontWeight: 500, boxShadow: 2, textAlign: 'right', direction: 'rtl', maxWidth: 700, width: '100%', mb: 2 }}>
              {userData.fullName && (
                <>
                  שלום {userData.fullName},<br />
                </>
              )}
              אנו בשלב הסופי של בדיקת הזכאות. אנא מלא/י את פרטיך ונחזור אליך בהקדם!<br />
            </Box>
          </Box>

          <Typography variant="h5" align="center" fontWeight={700} gutterBottom sx={{ color: 'white', mb: 1 }}>
          </Typography>
          {message && (
            <Alert severity={messageType === 'success' ? 'success' : 'error'} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 2, mt: 1, mx: 'auto' }}>
            <Box sx={{ 
              background: 'rgba(67, 233, 123, 0.18)', 
              color: '#fff', 
              borderRadius: 2, 
              p: 2, 
              mb: 2, 
              fontSize: 15, 
              fontWeight: 500, 
              boxShadow: 1, 
              borderLeft: '4px solid #43e97b', 
              mx: 'auto', 
              maxWidth: '100%',
              direction: 'rtl',
              textAlign: 'right',
            }}>
נזדקק לעוד קצת מידע לפני שנוכל להתחיל במחקר הארכיוני המהיר שלנו. לאחר קבלת הפרטים, נוכל לאתר מסמכים על אבותיך תוך יום עסקים אחד ולשלב את הממצאים בייעוץ הראשוני ללא עלות.            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%' }}>
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
                  marginTop: '8px',
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
                placeholder="מספר טלפון"
                name="phone"
                type="tel"
                value={formData.phone}
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
                    direction: 'rtl',
                    textAlign: 'right',
                  },
                }}
                InputLabelProps={{ shrink: false }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', width: '100%' }}>
              <TextField
                placeholder="שם הנרדף/ת"
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
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                    direction: 'rtl',
                    textAlign: 'right',
                  }
                }}
                InputLabelProps={{ shrink: false }}
              />
              <Button
                variant="outlined"
                sx={{
                  height: 48,
                  minWidth: 80,
                  px: 0,
                  ml: 2,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
                  borderRadius: 999,
                  boxShadow: '0 2px 8px 0 rgba(83,91,242,0.10)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  lineHeight: 1.1,
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
                  },
                }}
                onClick={() => handleNotSure('persecutedName')}
              >
                <span style={{ display: 'block' }}>לא</span>
                <span style={{ display: 'block' }}>בטוח/ה</span>
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', width: '100%' }}>
              <TextField
                placeholder="תאריך לידה של הנרדף/ת"
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
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                    direction: 'rtl',
                    textAlign: 'right',
                  }
                }}
                InputLabelProps={{ shrink: false }}
              />
              <Button
                variant="outlined"
                sx={{
                  height: 48,
                  minWidth: 80,
                  px: 0,
                  ml: 2,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
                  borderRadius: 999,
                  boxShadow: '0 2px 8px 0 rgba(83,91,242,0.10)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  lineHeight: 1.1,
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
                  },
                }}
                onClick={() => handleNotSure('persecutedDob')}
              >
                <span style={{ display: 'block' }}>לא</span>
                <span style={{ display: 'block' }}>בטוח/ה</span>
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', width: '100%' }}>
              <TextField
                placeholder="מקום לידה של הנרדף/ת"
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
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                    direction: 'rtl',
                    textAlign: 'right',
                  }
                }}
                InputLabelProps={{ shrink: false }}
              />
              <Button
                variant="outlined"
                sx={{
                  height: 48,
                  minWidth: 80,
                  px: 0,
                  ml: 2,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
                  borderRadius: 999,
                  boxShadow: '0 2px 8px 0 rgba(83,91,242,0.10)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  lineHeight: 1.1,
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
                  },
                }}
                onClick={() => handleNotSure('persecutedPlace')}
              >
                <span style={{ display: 'block' }}>לא</span>
                <span style={{ display: 'block' }}>בטוח/ה</span>
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', width: '100%' }}>
              <TextField
                placeholder="מידע נוסף (לא חובה)"
                multiline
                rows={4}
                value={formData.additionalInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: '#232946',
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#3a3f5a',
                    },
                    '&:hover fieldset': {
                      borderColor: '#43e97b',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#43e97b',
                    },
                    direction: 'rtl',
                    textAlign: 'right',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#232946',
                  },
                }}
              />
            </Box>
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
              {isSubmitting ? 'שולח...' : 'שלח'}
            </Button>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmitWithoutContact}
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
              שלח ללא פרטי יצירת קשר
            </Button>
          </Box>
        </CardContent>
      </Box>

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
          אישור
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.87)', textAlign: 'center', mb: 2 }}>
            אתה עומד לשלוח את הטופס עם המידע שמילאת בשלבים הקודמים. לידיעתך, מסירת מידע על אבותיך תאפשר לנו לבצע עבורך מחקר ארכיוני וייעוץ ראשוני ללא עלות.
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
            ביטול
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
            המשך
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContactForm; 