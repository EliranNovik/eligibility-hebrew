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
  const entryPointRef = useRef(location.state?.from || '/userinfo');
  const [pendingSection5Jump, setPendingSection5Jump] = useState(false);

  // Reset currentStep if we're starting fresh
  useEffect(() => {
    // If returning from negative result, set currentStep
    if (location.state && typeof location.state.returnToStep === 'number') {
      setFormState(prev => ({ ...prev, currentStep: location.state.returnToStep }));
    }
    if (formState.currentStep > 0 && !formState.answers.length) {
      setFormState(prev => ({ ...prev, currentStep: 0 }));
    }
  }, [formState.answers.length, formState.currentStep, setFormState, location.state]);

  // Unified question sequence logic
  const getQuestionSequence = () => {
    const countrySelection = questions.find(q => q.id === 'country_selection');
    const countryAnswer = formState.answers.find(a => a.questionId === 'country_selection');
    if (!countryAnswer) return [countrySelection].filter(Boolean);

    const selectedCountry = countryAnswer.value as string;
    if (selectedCountry === 'Germany') {
      const sequence = [countrySelection];
      sequence.push(questions.find(q => q.id === 'german_116_1'));
      const a1 = formState.answers.find(a => a.questionId === 'german_116_1');

      // If 116_1 is 'no', go to Section 5 flow
      if (a1 && a1.value === 'no') {
        // Section 5: Earliest ancestor
        sequence.push(questions.find(q => q.id === 'german_5_earliest_ancestor'));
        const ancestorAnswer = formState.answers.find(a => a.questionId === 'german_5_earliest_ancestor');
        if (!ancestorAnswer) return sequence.filter(Boolean);
        // Section 5: Path logic (Mother, Father, Grandparent, Great-grandparent)
        const ancestorType = ancestorAnswer.value;
        if (ancestorType === 'Mother') {
          sequence.push(...questions.filter(q => q.id.startsWith('german_5_mother_q')));
        } else if (ancestorType === 'Father') {
          sequence.push(...questions.filter(q => q.id.startsWith('german_5_father_q')));
        } else if (ancestorType === 'Grandparent') {
          sequence.push(questions.find(q => q.id === 'german_5_grandparent_q1'));
          sequence.push(questions.find(q => q.id === 'german_5_grandparent_q2'));
          const gp1 = formState.answers.find(a => a.questionId === 'german_5_grandparent_q1');
          const gp2 = formState.answers.find(a => a.questionId === 'german_5_grandparent_q2');
          if (gp1 && gp2) {
            if (gp1.value === 'Grandfather' && gp2.value === "My mom's parent") {
              sequence.push(...questions.filter(q => q.id.startsWith('german_5_grandfather_mother_father_q')));
            } else if (gp1.value === 'Grandfather' && gp2.value === "My dad's parent") {
              sequence.push(...questions.filter(q => q.id.startsWith('german_5_grandfather_father_father_q')));
            } else if (gp1.value === 'Grandmother' && gp2.value === "My mom's parent") {
              sequence.push(...questions.filter(q => q.id.startsWith('german_5_grandmother_mother_mother_q')));
            } else if (gp1.value === 'Grandmother' && gp2.value === "My dad's parent") {
              sequence.push(...questions.filter(q => q.id.startsWith('german_5_grandmother_father_mother_q')));
            }
          }
        } else if (ancestorType === 'Great-grandparent') {
          sequence.push(...questions.filter(q => q.id.startsWith('german_5_greatgrandparent_q')));
        }
        // Always add relation question at the end of Section 5
        sequence.push(questions.find(q => q.id === 'german_5_relation'));
        return sequence.filter(Boolean);
      }

      sequence.push(questions.find(q => q.id === 'german_116_2'));
      const a2 = formState.answers.find(a => a.questionId === 'german_116_2');
      if (a2 && a2.value !== 'yes') {
        sequence.push(questions.find(q => q.id === 'german_116_3'));
      }
      sequence.push(questions.find(q => q.id === 'german_116_4'));
      const a4 = formState.answers.find(a => a.questionId === 'german_116_4');
      const a2val = a2 ? a2.value : undefined;
      if (a4 && a4.value === 'no' && a2val === 'yes') {
        sequence.push(questions.find(q => q.id === 'german_116_4a'));
      }
      sequence.push(questions.find(q => q.id === 'german_15_5'));
      return sequence.filter(Boolean);
    }

    if (selectedCountry === 'Austria') {
      return [countrySelection, ...questions.filter(q => q.section === 'austrian_58c')];
    }
    return [countrySelection].filter(Boolean);
  };

  const questionSequence = getQuestionSequence();

  // Clamp currentStep to the bounds of the question sequence and reset if needed
  useEffect(() => {
    if (formState.currentStep >= questionSequence.length) {
      setFormState(prev => ({
        ...prev,
        currentStep: Math.max(0, questionSequence.length - 1)
      }));
    }
    const currentQuestion = questionSequence[formState.currentStep];
    if (currentQuestion && !questionSequence.some(q => q && currentQuestion && q.id === currentQuestion.id)) {
      setFormState(prev => ({
        ...prev,
        currentStep: 0
      }));
    }
  }, [formState.currentStep, formState.answers, questionSequence.length]);

  const handleAnswer = (value: string | boolean) => {
    const currentQuestion = questionSequence[formState.currentStep];
    if (!currentQuestion) return;

    // Truncate answers if changing a previous answer
    const existingAnswerIndex = formState.answers.findIndex((a) => a.questionId === currentQuestion.id);
    let newAnswers;
    if (existingAnswerIndex >= 0) {
      newAnswers = [
        ...formState.answers.slice(0, existingAnswerIndex),
        { questionId: currentQuestion.id, value }
      ];
    } else {
      newAnswers = [...formState.answers, { questionId: currentQuestion.id, value }];
    }

    // Special logic for the German flow
    if (currentQuestion.id === 'german_116_3' && value === 'no') {
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

    // Add new logic for german_116_4
    if (currentQuestion.id === 'german_116_4') {
      const a2 = formState.answers.find(a => a.questionId === 'german_116_2');
      if (a2 && a2.value === 'no' && value === 'no') {
        setFormState((prev) => ({ ...prev, answers: newAnswers }));
        navigate('/results', { 
          state: { 
            eligible: false,
            eligibleSections: [],
            answers: newAnswers,
            explanation: 'You are not eligible for German citizenship under paragraph 116 because your ancestor was not a German citizen and did not flee due to persecution.'
          }
        });
        return;
      }
    }

    if (currentQuestion.id === 'german_15_5' || currentQuestion.id === 'german_5_relation') {
      setFormState((prev) => ({ ...prev, answers: newAnswers }));
      if (value === 'Not directly related') {
        navigate('/results', { 
          state: { 
            eligible: false,
            eligibleSections: [],
            answers: newAnswers
          }
        });
        return;
      }
      // Check if any previous answer was "not sure"
      const hasNotSure = newAnswers.some(a => a.value === 'not_sure');
      navigate('/results', { 
        state: { 
          eligible: true,
          eligibleSections: [currentQuestion.id === 'german_5_relation' ? '§5' : '§15'],
          assessmentNeeded: hasNotSure && currentQuestion.id !== 'german_5_relation',
          answers: newAnswers
        }
      });
      return;
    }

    // Add negative result logic for Section 5 questions
    if (currentQuestion.section === 'german_5' && value === 'no') {
      let explanation = '';
      
      // Mother path explanations
      if (currentQuestion.id === 'german_5_mother_q1') {
        explanation = 'Your mother was never a German citizen.';
      } else if (currentQuestion.id === 'german_5_mother_q2') {
        explanation = 'You were born before May 23, 1949.';
      } else if (currentQuestion.id === 'german_5_mother_q3') {
        explanation = 'Your father was a German citizen when you were born.';
      } else if (currentQuestion.id === 'german_5_mother_q4') {
        explanation = 'Your parents were married before your birth.';
      } else if (currentQuestion.id === 'german_5_mother_q5') {
        explanation = 'Your mother did not marry a non-German man before April 1, 1953.';
      } else if (currentQuestion.id === 'german_5_mother_q6') {
        explanation = 'You were born before your mother\'s marriage to a non-German man.';
      }

      // Father path explanations
      else if (currentQuestion.id === 'german_5_father_q1') {
        explanation = 'Your father was never a German citizen.';
      } else if (currentQuestion.id === 'german_5_father_q2') {
        explanation = 'You were born outside the eligible period (after May 23, 1949 and before July 1, 1993).';
      } else if (currentQuestion.id === 'german_5_father_q3') {
        explanation = 'Your mother was a German citizen when you were born.';
      } else if (currentQuestion.id === 'german_5_father_q4') {
        explanation = 'Your parents were married at the time of your birth.';
      } else if (currentQuestion.id === 'german_5_father_q5') {
        explanation = 'Your father was not officially recognized as your father before you turned 23.';
      }

      // Grandparent path explanations
      else if (currentQuestion.id.startsWith('german_5_grandfather_mother_father_q')) {
        if (currentQuestion.id === 'german_5_grandfather_mother_father_q1') {
          explanation = 'Your grandfather (mother\'s father) was never a German citizen.';
        } else if (currentQuestion.id === 'german_5_grandfather_mother_father_q2') {
          explanation = 'Your mother was born outside the eligible period (after May 23, 1949 and before July 1, 1993).';
        } else if (currentQuestion.id === 'german_5_grandfather_mother_father_q3') {
          explanation = 'You were born before May 23, 1949.';
        } else if (currentQuestion.id === 'german_5_grandfather_mother_father_q4') {
          explanation = 'Your grandmother (mother\'s mother) was a German citizen.';
        } else if (currentQuestion.id === 'german_5_grandfather_mother_father_q5') {
          explanation = 'Your grandparents were married when your mother was born.';
        } else if (currentQuestion.id === 'german_5_grandfather_mother_father_q6') {
          explanation = 'Your grandfather was not officially recognized as your mother\'s father before she turned 23.';
        }
      }
      else if (currentQuestion.id.startsWith('german_5_grandfather_father_father_q')) {
        if (currentQuestion.id === 'german_5_grandfather_father_father_q1') {
          explanation = 'Your grandfather (father\'s father) was never a German citizen.';
        } else if (currentQuestion.id === 'german_5_grandfather_father_father_q2') {
          explanation = 'Your father was born outside the eligible period (after May 23, 1949 and before July 1, 1993).';
        } else if (currentQuestion.id === 'german_5_grandfather_father_father_q3') {
          explanation = 'You were born before May 23, 1949.';
        } else if (currentQuestion.id === 'german_5_grandfather_father_father_q4') {
          explanation = 'Your grandmother (father\'s mother) was a German citizen.';
        } else if (currentQuestion.id === 'german_5_grandfather_father_father_q5') {
          explanation = 'Your grandparents were married when your father was born.';
        } else if (currentQuestion.id === 'german_5_grandfather_father_father_q6') {
          explanation = 'Your grandfather was not officially recognized as your father\'s father before he turned 23.';
        }
      }
      else if (currentQuestion.id.startsWith('german_5_grandmother_mother_mother_q')) {
        if (currentQuestion.id === 'german_5_grandmother_mother_mother_q1') {
          explanation = 'Your grandmother (mother\'s mother) was never a German citizen.';
        } else if (currentQuestion.id === 'german_5_grandmother_mother_mother_q2') {
          explanation = 'Your mother was born before May 23, 1949.';
        } else if (currentQuestion.id === 'german_5_grandmother_mother_mother_q3') {
          explanation = 'You were born before May 23, 1949.';
        } else if (currentQuestion.id === 'german_5_grandmother_mother_mother_q4') {
          explanation = 'Your grandfather was a German citizen.';
        } else if (currentQuestion.id === 'german_5_grandmother_mother_mother_q5') {
          explanation = 'Your grandparents were not married before your mother was born.';
        } else if (currentQuestion.id === 'german_5_grandmother_mother_mother_q6') {
          explanation = 'Your grandmother did not marry a non-German man before April 1, 1953.';
        } else if (currentQuestion.id === 'german_5_grandmother_mother_mother_q7') {
          explanation = 'Your mother was born before your grandmother\'s marriage to a non-German man.';
        }
      }
      else if (currentQuestion.id.startsWith('german_5_grandmother_father_mother_q')) {
        if (currentQuestion.id === 'german_5_grandmother_father_mother_q1') {
          explanation = 'Your grandmother (father\'s mother) was never a German citizen.';
        } else if (currentQuestion.id === 'german_5_grandmother_father_mother_q2') {
          explanation = 'Your father was born before May 23, 1949.';
        } else if (currentQuestion.id === 'german_5_grandmother_father_mother_q3') {
          explanation = 'You were born before May 23, 1949.';
        } else if (currentQuestion.id === 'german_5_grandmother_father_mother_q4') {
          explanation = 'Your grandfather was a German citizen.';
        } else if (currentQuestion.id === 'german_5_grandmother_father_mother_q5') {
          explanation = 'Your grandparents were not married before your father was born.';
        } else if (currentQuestion.id === 'german_5_grandmother_father_mother_q6') {
          explanation = 'Your grandmother did not marry a non-German man before April 1, 1953.';
        } else if (currentQuestion.id === 'german_5_grandmother_father_mother_q7') {
          explanation = 'Your father was born before your grandmother\'s marriage to a non-German man.';
        }
      }

      setFormState((prev) => ({ ...prev, answers: newAnswers }));
      navigate('/results', {
        state: {
          eligible: false,
          eligibleSections: [],
          answers: newAnswers,
          explanation: `You are not eligible for German citizenship under paragraph 5. ${explanation}`
        }
      });
      return;
    }

    // Austrian citizenship results logic
    if (currentQuestion.id === 'austrian_58c_4') {
      setFormState((prev) => ({ ...prev, answers: newAnswers }));
      // Negative result if not a direct descendant
      if (value === 'Not directly related') {
        navigate('/results', {
          state: {
            eligible: false,
            eligibleSections: [],
            answers: newAnswers,
            explanation: 'You are not eligible for Austrian citizenship because you are not a direct descendant of the ancestor.'
          }
        });
        return;
      }
      // Positive result for valid relation
      navigate('/results', {
        state: {
          eligible: true,
          eligibleSections: ['§58c'],
          answers: newAnswers
        }
      });
      return;
    }

    // For all other questions, just go to the next question
    setFormState((prev) => ({
      ...prev,
      answers: newAnswers,
      currentStep: newAnswers.length,
    }));
  };

  const handleNext = () => {
    const currentQuestion = questionSequence[formState.currentStep];
    if (!currentQuestion) return;
    if (currentQuestion.type === 'date') {
      const currentAnswer = getCurrentAnswer();
      if (!currentAnswer) return;
    }

    if (formState.currentStep < questionSequence.length - 1) {
      setFormState((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
    } else {
      navigate('/results');
    }
  };

  const handleBack = () => {
    const currentQuestion = questionSequence[formState.currentStep];
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
    const currentQuestion = questionSequence[formState.currentStep];
    if (!currentQuestion) return undefined;
    const answer = formState.answers.find(
      (a) => a.questionId === currentQuestion.id
    );
    return answer?.value;
  };

  // Debug logging
  console.log('Current Step:', formState.currentStep);
  console.log('Filtered Questions:', questionSequence);
  console.log('Current Question:', questionSequence[formState.currentStep]);
  console.log('Answers:', formState.answers);

  // Defensive: Only render main UI if currentQuestion is defined
  const currentQuestion = questionSequence[formState.currentStep];
  if (!currentQuestion) {
    return (
      <Box sx={{ color: 'white', p: 4, textAlign: 'center' }}>
        Sorry, something went wrong with the question flow.<br />
        Please refresh the page or start again.<br />
        (Debug: No valid question at step {formState.currentStep})
      </Box>
    );
  }

  const currentQuestionIndex = formState.currentStep;

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
            totalQuestions={questionSequence.length}
            currentQuestion={currentQuestionIndex + 1}
          />
        </Container>
      </Box>
    </>
  );
};

export default QuestionFlow;
