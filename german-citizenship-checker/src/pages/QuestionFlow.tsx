import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Alert } from '@mui/material';
import { useMemo, useState } from 'react';
import { questions } from '../questions/questions';
import type { FormState } from '../types';
import Header from '../components/Header';
import QuestionCard from '../components/QuestionCard';

interface QuestionFlowProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}

const QuestionFlow = ({ formState, setFormState }: QuestionFlowProps) => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  // Filter questions based on selected country and path
  const filteredQuestions = useMemo(() => {
    const countryAnswer = formState.answers.find(a => a.questionId === 'country_selection');
    if (!countryAnswer) return [questions[0]];
    const selectedCountry = countryAnswer.value as string;

    if (selectedCountry === 'Germany') {
      // Check §116 Jewish ancestor question
      const jewishAnswer = formState.answers.find(a => a.questionId === 'german_116_1');
      if (jewishAnswer && jewishAnswer.value === 'no') {
        // Show simplified Section 5 questions
        return questions.filter(q => q.id.startsWith('german_5_simple_'));
      }
      // If §116_1 is not answered yet, or is 'yes', continue with §116
      const german116_1 = formState.answers.find(a => a.questionId === 'german_116_1');
      const german116_2 = formState.answers.find(a => a.questionId === 'german_116_2');
      if (!german116_1 || !german116_2) {
        return questions.filter(q => q.section === 'german_116');
      }
      if (german116_2.value === 'yes') {
        return questions.filter(q => q.section === 'german_116');
      }
      // If not a citizen, show §15 questions
      return questions.filter(q => q.section === 'german_15');
    }
    if (selectedCountry === 'Austria') {
      return questions.filter(q => q.section === 'austrian_58c');
    }
    return [];
  }, [formState.answers]);

  const handleAnswer = (value: string | boolean) => {
    const currentQuestion = filteredQuestions[formState.currentStep];
    const newAnswers = [...formState.answers];
    const existingAnswerIndex = newAnswers.findIndex((a) => a.questionId === currentQuestion.id);
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex].value = value;
    } else {
      newAnswers.push({ questionId: currentQuestion.id, value });
    }
    
    setFormState((prev) => ({ ...prev, answers: newAnswers }));

    // Show notification if answering "no" to Jewish descent question
    if (currentQuestion.id === 'german_116_1' && value === 'no') {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000); // Hide after 5 seconds
    }

    // For yes/no questions, auto-advance
    if (currentQuestion.type === 'yesNo') {
      // Special handling for parents marriage questions
      if (currentQuestion.id === 'german_5_simple_9' && value === 'no') {
        // If parents were not married at birth, we need to ask if they married after birth
        const nextQuestion = filteredQuestions[formState.currentStep + 1];
        if (nextQuestion && nextQuestion.id === 'german_5_simple_10') {
          setFormState((prev) => ({
            ...prev,
            currentStep: prev.currentStep + 1,
          }));
        }
      } else if (formState.currentStep < filteredQuestions.length - 1) {
        setFormState((prev) => ({
          ...prev,
          currentStep: prev.currentStep + 1,
        }));
      } else {
        navigate('/results');
      }
    }
  };

  const handleNext = () => {
    const currentQuestion = filteredQuestions[formState.currentStep];
    
    // For date questions, validate the date
    if (currentQuestion.type === 'date') {
      const currentAnswer = getCurrentAnswer();
      if (!currentAnswer) {
        return; // Don't proceed if no date is selected
      }
    }

    if (formState.currentStep < filteredQuestions.length - 1) {
      setFormState((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
    } else {
      navigate('/results');
    }
  };

  const handleBack = () => {
    if (formState.currentStep > 0) {
      // Check if we're going back from the "married after birth" question
      const currentQuestion = filteredQuestions[formState.currentStep];
      const previousQuestion = filteredQuestions[formState.currentStep - 1];
      
      if (currentQuestion.id === 'german_5_simple_10' && previousQuestion.id === 'german_5_simple_9') {
        // If going back from "married after birth" question, we should go back to the marriage status question
        setFormState((prev) => ({
          ...prev,
          currentStep: prev.currentStep - 1,
        }));
      } else {
        // Normal back navigation
        setFormState((prev) => ({
          ...prev,
          currentStep: prev.currentStep - 1,
        }));
      }
    } else {
      navigate('/');
    }
  };

  const getCurrentAnswer = () => {
    const currentQuestion = filteredQuestions[formState.currentStep];
    const answer = formState.answers.find(
      (a) => a.questionId === currentQuestion.id
    );
    return answer?.value;
  };

  if (!filteredQuestions[formState.currentStep]) {
    return null;
  }

  return (
    <>
      <Header showBackButton onBack={handleBack} />
      <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#232946', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        {showNotification && (
          <Alert 
            severity="info"
            sx={{
              position: 'fixed',
              top: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              width: 'auto',
              maxWidth: '90%',
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: '#1a1a1a',
              color: '#fff',
              '& .MuiAlert-icon': {
                color: '#646cff'
              }
            }}
          >
            Unfortunately, you are not eligible for sections §116 and §15. We will continue to check your eligibility for section §5 and its categories.
          </Alert>
        )}
        <Container maxWidth="sm">
          <QuestionCard
            question={filteredQuestions[formState.currentStep]}
            onAnswer={handleAnswer}
            currentAnswer={getCurrentAnswer()}
            onNext={handleNext}
            showNext={filteredQuestions[formState.currentStep].type === 'dropdown'}
            totalQuestions={filteredQuestions.length}
            currentQuestion={formState.currentStep + 1}
          />
        </Container>
      </Box>
    </>
  );
};

export default QuestionFlow; 