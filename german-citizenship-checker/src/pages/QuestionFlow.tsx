import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, Typography, Alert } from '@mui/material';
import { useMemo, useState, useRef, useEffect } from 'react';
import { questions } from '../questions/questions';
import type { FormState } from '../types';
import Header from '../components/Header';
import QuestionCard from '../components/QuestionCard';
import { useNavigation } from '../context/NavigationContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface QuestionFlowProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}

const QuestionFlow = ({ formState, setFormState }: QuestionFlowProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);
  const { goBack } = useNavigation();
  // Track entry point to /questions
  const entryPointRef = useRef(location.state?.from || '/userinfo');
  const [pendingSection5Jump, setPendingSection5Jump] = useState(false);

  // Filter questions based on selected country and path
  const filteredQuestions = useMemo(() => {
    const countrySelection = questions.find(q => q.id === 'country_selection');
    const countryAnswer = formState.answers.find(a => a.questionId === 'country_selection');
    if (!countryAnswer) return [countrySelection].filter(Boolean);
    const selectedCountry = countryAnswer.value as string;

    if (selectedCountry === 'Germany') {
      // Check §116 Jewish ancestor question
      const jewishAnswer = formState.answers.find(a => a.questionId === 'german_116_1');
      if (jewishAnswer && jewishAnswer.value === 'no') {
        // Section 5 branching logic
        const ancestorAnswer = formState.answers.find(a => a.questionId === 'german_5_earliest_ancestor');
        if (!ancestorAnswer) {
          // Show ancestor selection question
          const q = questions.find(q => q.id === 'german_5_earliest_ancestor');
          return [countrySelection, q].filter(Boolean);
        }
        // Branch by ancestor type
        const ancestorType = ancestorAnswer.value;
        if (ancestorType === 'Mother') {
          const q = questions.find(q => q.id === 'german_5_earliest_ancestor');
          const path = questions.filter(q => q.id.startsWith('german_5_mother_q'));
          return [countrySelection, q, ...path].filter(Boolean);
        }
        if (ancestorType === 'Father') {
          const q = questions.find(q => q.id === 'german_5_earliest_ancestor');
          const path = questions.filter(q => q.id.startsWith('german_5_father_q'));
          return [countrySelection, q, ...path].filter(Boolean);
        }
        if (ancestorType === 'Grandparent') {
          const gp1 = formState.answers.find(a => a.questionId === 'german_5_grandparent_q1');
          const gp2 = formState.answers.find(a => a.questionId === 'german_5_grandparent_q2');
          const base = [
            questions.find(q => q.id === 'german_5_earliest_ancestor'),
            questions.find(q => q.id === 'german_5_grandparent_q1'),
            questions.find(q => q.id === 'german_5_grandparent_q2')
          ].filter(Boolean);
          if (!gp1 || !gp2) return [countrySelection, ...base].filter(Boolean);
          // Determine sub-path
          if (gp1.value === 'Grandfather' && gp2.value === "My mom's parent") {
            return [
              countrySelection,
              ...base,
              ...questions.filter(q => q.id.startsWith('german_5_grandfather_mother_father_q'))
            ].filter(Boolean);
          }
          if (gp1.value === 'Grandfather' && gp2.value === "My dad's parent") {
            return [
              countrySelection,
              ...base,
              ...questions.filter(q => q.id.startsWith('german_5_grandfather_father_father_q'))
            ].filter(Boolean);
          }
          if (gp1.value === 'Grandmother' && gp2.value === "My mom's parent") {
            return [
              countrySelection,
              ...base,
              ...questions.filter(q => q.id.startsWith('german_5_grandmother_mother_mother_q'))
            ].filter(Boolean);
          }
          if (gp1.value === 'Grandmother' && gp2.value === "My dad's parent") {
            return [
              countrySelection,
              ...base,
              ...questions.filter(q => q.id.startsWith('german_5_grandmother_father_mother_q'))
            ].filter(Boolean);
          }
          return [countrySelection, ...base].filter(Boolean);
        }
        if (ancestorType === 'Great-grandparent') {
          const q = questions.find(q => q.id === 'german_5_earliest_ancestor');
          const path = questions.filter(q => q.id.startsWith('german_5_greatgrandparent_q'));
          return [countrySelection, q, ...path].filter(Boolean);
        }
        // fallback
        const q = questions.find(q => q.id === 'german_5_earliest_ancestor');
        return [countrySelection, q].filter(Boolean);
      }

      // Check German citizenship status
      const germanCitizenAnswer = formState.answers.find(a => a.questionId === 'german_116_2');

      if (!germanCitizenAnswer) {
        return [countrySelection, ...questions.filter(q => q.section === 'german_116')];
      }

      if (germanCitizenAnswer.value === 'yes') {
        return [countrySelection, ...questions.filter(q => q.section === 'german_116')];
      }

      if (germanCitizenAnswer.value === 'no') {
        return [countrySelection, ...questions.filter(q => q.section === 'german_15')];
      }

      return [countrySelection, ...questions.filter(q => q.section === 'german_116')];
    }
    if (selectedCountry === 'Austria') {
      return [countrySelection, ...questions.filter(q => q.section === 'austrian_58c')];
    }
    return [countrySelection].filter(Boolean);
  }, [formState.answers]);

  const getFilteredQuestions = (answers: typeof formState.answers) => {
    const countrySelection = questions.find(q => q.id === 'country_selection');
    const countryAnswer = answers.find(a => a.questionId === 'country_selection');
    if (!countryAnswer) return [countrySelection].filter(Boolean);
    const selectedCountry = countryAnswer.value as string;

    if (selectedCountry === 'Germany') {
      const jewishAnswer = answers.find(a => a.questionId === 'german_116_1');
      if (jewishAnswer && jewishAnswer.value === 'no') {
        const ancestorAnswer = answers.find(a => a.questionId === 'german_5_earliest_ancestor');
        if (!ancestorAnswer) {
          const q = questions.find(q => q.id === 'german_5_earliest_ancestor');
          return [countrySelection, q].filter(Boolean);
        }
        const ancestorType = ancestorAnswer.value;
        if (ancestorType === 'Mother') {
          const q = questions.find(q => q.id === 'german_5_earliest_ancestor');
          const path = questions.filter(q => q.id.startsWith('german_5_mother_q'));
          return [countrySelection, q, ...path].filter(Boolean);
        }
        if (ancestorType === 'Father') {
          const q = questions.find(q => q.id === 'german_5_earliest_ancestor');
          const path = questions.filter(q => q.id.startsWith('german_5_father_q'));
          return [countrySelection, q, ...path].filter(Boolean);
        }
        if (ancestorType === 'Grandparent') {
          const gp1 = answers.find(a => a.questionId === 'german_5_grandparent_q1');
          const gp2 = answers.find(a => a.questionId === 'german_5_grandparent_q2');
          const base = [
            questions.find(q => q.id === 'german_5_earliest_ancestor'),
            questions.find(q => q.id === 'german_5_grandparent_q1'),
            questions.find(q => q.id === 'german_5_grandparent_q2')
          ].filter(Boolean);
          if (!gp1 || !gp2) return [countrySelection, ...base].filter(Boolean);
          if (gp1.value === 'Grandfather' && gp2.value === "My mom's parent") {
            return [
              countrySelection,
              ...base,
              ...questions.filter(q => q.id.startsWith('german_5_grandfather_mother_father_q'))
            ].filter(Boolean);
          }
          if (gp1.value === 'Grandfather' && gp2.value === "My dad's parent") {
            return [
              countrySelection,
              ...base,
              ...questions.filter(q => q.id.startsWith('german_5_grandfather_father_father_q'))
            ].filter(Boolean);
          }
          if (gp1.value === 'Grandmother' && gp2.value === "My mom's parent") {
            return [
              countrySelection,
              ...base,
              ...questions.filter(q => q.id.startsWith('german_5_grandmother_mother_mother_q'))
            ].filter(Boolean);
          }
          if (gp1.value === 'Grandmother' && gp2.value === "My dad's parent") {
            return [
              countrySelection,
              ...base,
              ...questions.filter(q => q.id.startsWith('german_5_grandmother_father_mother_q'))
            ].filter(Boolean);
          }
          return [countrySelection, ...base].filter(Boolean);
        }
        if (ancestorType === 'Great-grandparent') {
          const q = questions.find(q => q.id === 'german_5_earliest_ancestor');
          const path = questions.filter(q => q.id.startsWith('german_5_greatgrandparent_q'));
          return [countrySelection, q, ...path].filter(Boolean);
        }
        const q = questions.find(q => q.id === 'german_5_earliest_ancestor');
        return [countrySelection, q].filter(Boolean);
      }
      const germanCitizenAnswer = answers.find(a => a.questionId === 'german_116_2');
      if (!germanCitizenAnswer) {
        return [countrySelection, ...questions.filter(q => q.section === 'german_116')];
      }
      if (germanCitizenAnswer.value === 'yes') {
        return [countrySelection, ...questions.filter(q => q.section === 'german_116')];
      }
      if (germanCitizenAnswer.value === 'no') {
        return [countrySelection, ...questions.filter(q => q.section === 'german_15')];
      }
      return [countrySelection, ...questions.filter(q => q.section === 'german_116')];
    }
    if (selectedCountry === 'Austria') {
      return [countrySelection, ...questions.filter(q => q.section === 'austrian_58c')];
    }
    return [countrySelection].filter(Boolean);
  };

  const handleAnswer = (value: string | boolean) => {
    const currentQuestion = filteredQuestions[formState.currentStep];
    if (!currentQuestion) {
      // Defensive: shouldn't happen, but prevents crash
      return;
    }
    const newAnswers = [...formState.answers];
    const existingAnswerIndex = newAnswers.findIndex((a) => a.questionId === currentQuestion.id);

    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex].value = value;
    } else {
      newAnswers.push({ questionId: currentQuestion.id, value });
    }

    // Handle Austrian §58c first question
    if (currentQuestion.id === 'austrian_58c_1' && value === 'no') {
      setFormState((prev) => ({ ...prev, answers: newAnswers }));
      navigate('/results', { 
        state: { 
          eligible: false,
          eligibleSections: [],
          answers: newAnswers
        }
      });
      return;
    }

    if (currentQuestion.id === 'german_116_1' && value === 'no') {
      setFormState((prev) => ({ ...prev, answers: newAnswers }));
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      setPendingSection5Jump(true);
      return;
    }

    if (currentQuestion.type === 'yesNo') {
      setFormState((prev) => {
        if (prev.currentStep < filteredQuestions.length - 1) {
          return {
            ...prev,
            answers: newAnswers,
            currentStep: prev.currentStep + 1,
          };
        } else {
          navigate('/results');
          return { ...prev, answers: newAnswers };
        }
      });
      return;
    }

    // For all other question types (e.g., dropdown), only move to next step if there is a next question
    setFormState((prev) => {
      const updatedAnswers = newAnswers;
      const nextQuestions = getFilteredQuestions(updatedAnswers);
      if (prev.currentStep < nextQuestions.length - 1) {
        return {
          ...prev,
          answers: updatedAnswers,
          currentStep: prev.currentStep + 1,
        };
      } else {
        navigate('/results');
        return { ...prev, answers: updatedAnswers };
      }
    });
  };

  const handleNext = () => {
    const currentQuestion = filteredQuestions[formState.currentStep];
    if (!currentQuestion) return;
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
    const currentQuestion = filteredQuestions[formState.currentStep];
    if (currentQuestion && currentQuestion.id === 'country_selection') {
      navigate('/userinfo', { replace: true });
    } else {
      setFormState((prev) => ({
        ...prev,
        currentStep: Math.max(prev.currentStep - 1, 0),
      }));
    }
  };

  const getCurrentAnswer = () => {
    const currentQuestion = filteredQuestions[formState.currentStep];
    if (!currentQuestion) return undefined;
    const answer = formState.answers.find(
      (a) => a.questionId === currentQuestion.id
    );
    return answer?.value;
  };

  // Debug logging for troubleshooting white screen
  console.log('filteredQuestions:', filteredQuestions);
  console.log('formState.currentStep:', formState.currentStep);

  // Defensive: Only render main UI if currentQuestion is defined
  const currentQuestion = filteredQuestions[formState.currentStep];
  if (!currentQuestion) {
    return (
      <Box sx={{ color: 'white', p: 4, textAlign: 'center' }}>
        Sorry, something went wrong with the question flow.<br />
        Please refresh the page or start again.<br />
        (Debug: No valid question at step {formState.currentStep})
      </Box>
    );
  }

  // Effect to jump to Section 5 ancestor selection after answers update
  useEffect(() => {
    if (pendingSection5Jump) {
      const section5Index = filteredQuestions.filter(Boolean).findIndex(q => q && q.id === 'german_5_earliest_ancestor');
      if (section5Index !== -1) {
        setFormState((prev) => ({
          ...prev,
          currentStep: section5Index,
        }));
        setPendingSection5Jump(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredQuestions, pendingSection5Jump]);

  return (
    <>
      <Header />
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
          {/* Back Button on top */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
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
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            currentAnswer={getCurrentAnswer()}
            totalQuestions={filteredQuestions.length}
            currentQuestion={formState.currentStep + 1}
          />
        </Container>
      </Box>
    </>
  );
};

export default QuestionFlow;
