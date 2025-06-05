import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './context/NavigationContext';
import { useState } from 'react';
import type { FormState } from './types';

// Pages
import Intro from './pages/Intro';
import QuestionFlow from './pages/QuestionFlow';
import Results from './pages/Results';
import ContactForm from './pages/ContactForm';
import UserInfo from './pages/UserInfo';
import AboutUs from './pages/AboutUs';
import ArchivalResearch from './pages/ArchivalResearch';

function App() {
  const [formState, setFormState] = useState<FormState>({
    answers: [],
    currentStep: 0,
    userData: {
      fullName: '',
      email: '',
      phone: '',
      comments: '',
    }
  });

  return (
    <BrowserRouter>
      <NavigationProvider>
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
              />
            } 
          />
          <Route 
            path="/contact" 
            element={
              <ContactForm 
                formState={formState} 
                setFormState={setFormState} 
              />
            } 
          />
        </Routes>
      </NavigationProvider>
    </BrowserRouter>
  );
}

export default App;
