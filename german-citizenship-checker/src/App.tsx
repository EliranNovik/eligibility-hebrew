import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './context/NavigationContext';
import { useState, useEffect } from 'react';
import type { FormState } from './types';
import GoogleAnalytics from './components/GoogleAnalytics';
import { Box } from '@mui/material';

// Pages
import Intro from './pages/Intro';
import QuestionFlow from './pages/QuestionFlow';
import Results from './pages/Results';
import ContactForm from './pages/ContactForm';
import UserInfo from './pages/UserInfo';
import AboutUs from './pages/AboutUs';
import ArchivalResearch from './pages/ArchivalResearch';
import AdminDashboard from './pages/AdminDashboard';
console.log('App loaded');

function App() {
  // Load from localStorage if present
  const [formState, setFormState] = useState<FormState>(() => {
    const saved = localStorage.getItem('formState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback to default if corrupted
      }
    }
    return {
      answers: [],
      currentStep: 0,
      userData: {
        fullName: '',
        email: '',
        phone: '',
        comments: '',
      }
    };
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('formState', JSON.stringify(formState));
  }, [formState]);

  // Helper to clear formState from localStorage (call after final submission)
  const clearFormState = () => {
    localStorage.removeItem('formState');
    setFormState({
      answers: [],
      currentStep: 0,
      userData: {
        fullName: '',
        email: '',
        phone: '',
        comments: '',
      }
    });
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          backgroundImage: 'url(/german_documents.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(35, 41, 70, 0.55)',
            zIndex: 1,
            pointerEvents: 'none',
          },
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <BrowserRouter>
          <NavigationProvider>
            <GoogleAnalytics />
            <Routes>
              <Route path="/" element={<Intro />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/archival-research" element={<ArchivalResearch />} />
              <Route path="/userinfo" element={<UserInfo formState={formState} setFormState={setFormState} />} />
              <Route 
                path="/questions" 
                element={
                  <QuestionFlow 
                    formState={formState} 
                    setFormState={setFormState} 
                  />
                } 
              />
              <Route 
                path="/results" 
                element={
                  <Results 
                    formState={formState} 
                    setFormState={setFormState} 
                    clearFormState={clearFormState}
                  />
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <ContactForm 
                    formState={formState} 
                    setFormState={setFormState} 
                    clearFormState={clearFormState}
                  />
                } 
              />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
          </NavigationProvider>
        </BrowserRouter>
      </Box>
    </>
  );
}

export default App;
