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
        return questions.filter(q => q.id.startsWith('german_5_q'));
      }

      // Check German citizenship status
      const germanCitizenAnswer = formState.answers.find(a => a.questionId === 'german_116_2');

      if (!germanCitizenAnswer) {
        return questions.filter(q => q.section === 'german_116');
      }

      if (germanCitizenAnswer.value === 'yes') {
        return questions.filter(q => q.section === 'german_116');
      }

      if (germanCitizenAnswer.value === 'no') {
        return questions.filter(q => q.section === 'german_15');
      }

      return questions.filter(q => q.section === 'german_116');
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

    if (currentQuestion.id === 'german_116_1' && value === 'no') {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }

    if (currentQuestion.type === 'yesNo') {
      if (formState.currentStep < filteredQuestions.length - 1) {
        setFormState((prev) => ({
          ...prev,
          currentStep: prev.currentStep + 1,
        }));
      } else {
        navigate('/results');
      }
    }

    if (currentQuestion.id === 'german_5_q7' && value === 'no') {
      // Skip q8 (loss of citizenship) if grandmother was not German
      const nextQuestion = filteredQuestions[formState.currentStep + 1];
      if (nextQuestion?.id === 'german_5_q8') {
        setFormState((prev) => ({
          ...prev,
          currentStep: prev.currentStep + 2,
        }));
        return;
      }
    }
    
  };

  const handleNext = () => {
    const currentQuestion = filteredQuestions[formState.currentStep];
    if (currentQuestion.type === 'date') {
      const currentAnswer = getCurrentAnswer();
      if (!currentAnswer) return;
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
      setFormState((prev) => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
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
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
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
