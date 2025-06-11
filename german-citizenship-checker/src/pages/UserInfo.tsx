import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, Typography, Avatar, TextField, Button, Fade, Container } from '@mui/material';
import Header from '../components/Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { FormState } from '../types';

const AVATAR_SRC = '/MDPIC.jpg';
const CHAT_TEXT = "Hi, I am Michael Decker. I welcome you to our Eligibility Checker. Please share your name and email so I can guide you through the process.";

interface UserInfoProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}

const UserInfo = ({ formState, setFormState }: UserInfoProps) => {
  // Pick a random avatar on mount
  const [showInputs, setShowInputs] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef<number | null>(null);

  // Robust typewriter effect for chat bubble
  useEffect(() => {
    setTypedText(''); // Only clear once at the start
    let i = 0;
    function typeNext() {
      setTypedText(CHAT_TEXT.slice(0, i + 1));
      if (i < CHAT_TEXT.length - 1) {
        i++;
        timeoutRef.current = window.setTimeout(typeNext, 30);
      }
    }
    typeNext();
    
    // Show inputs after 800ms, independent of typing animation
    const inputTimer = window.setTimeout(() => {
      setShowInputs(true);
    }, 800);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearTimeout(inputTimer);
    };
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow letters and spaces
    if (value === '' || /^[a-zA-Z\s]*$/.test(value)) {
      setName(value);
      setNameError('');
    } else {
      setNameError('Please enter only letters');
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameError) return;
    
    setFormState(prev => ({
      ...prev,
      userData: {
        ...prev.userData,
        fullName: name,
        email: email,
      }
    }));
    navigate('/questions', { state: { from: location.pathname } });
  };

  return (
    <>
      <Header showBackButton onBack={() => navigate('/')} />
      <Box sx={{ 
        minHeight: '100vh', 
        width: '100vw', 
        bgcolor: 'rgba(35, 41, 70, 0.85)',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 4,
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
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Avatar src={AVATAR_SRC} sx={{ width: 120, height: 120, mb: 2, bgcolor: '#646cff', boxShadow: 3 }} />
            <Box sx={{ bgcolor: '#fff', color: '#232946', borderRadius: 3, px: 3, py: 2, fontSize: 18, fontWeight: 500, boxShadow: 2, maxWidth: 340, minHeight: 56, textAlign: 'center', mb: 0 }}>
              {typedText}
            </Box>
            <Fade in={showInputs} timeout={700}>
              <Paper sx={{ mt: 3, p: 4, borderRadius: 4, maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
              }}>
                <Box component="form" onSubmit={handleContinue} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    placeholder="Full Name"
                    value={name}
                    onChange={handleNameChange}
                    required
                    fullWidth
                    autoFocus
                    error={!!nameError}
                    helperText={nameError}
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
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    fullWidth
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
                  >
                    Continue
                  </Button>
                </Box>
              </Paper>
            </Fade>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserInfo; 