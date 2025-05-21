import React from 'react';
import { Card, CardContent, Typography, Button, Box, LinearProgress, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (value: string | boolean) => void;
  currentAnswer: string | boolean | undefined;
  onNext: () => void;
  showNext: boolean;
  totalQuestions: number;
  currentQuestion: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  currentAnswer,
  onNext,
  showNext,
  totalQuestions,
  currentQuestion,
}) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <>
      {/* Progress bar and question number */}
      <Box sx={{ width: '100%', maxWidth: 420, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
            Question {currentQuestion}/{totalQuestions}
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', height: 24, borderRadius: 12, overflow: 'hidden', bgcolor: '#181b2c' }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 24,
              borderRadius: 12,
              background: '#181b2c',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #ff5f6d 0%, #ffc371 100%)',
                borderRadius: 12,
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 600,
              fontSize: { xs: 16, md: 22 },
            }}
          >
            {currentQuestion}
          </Typography>
        </Box>
      </Box>

      {/* Question Card */}
      <Card sx={{ width: '100%', maxWidth: { xs: 420, md: 540 }, background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)', color: '#232946', borderRadius: 6, boxShadow: 6, mb: 4, p: { xs: 0, md: 2 } }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#232946', fontWeight: 700, mb: 2, fontSize: { xs: 24, md: 32 } }}>
            {question.text}
          </Typography>

          {/* Special styled country list for austrian_58c_6 */}
          {question.id === 'austrian_58c_6' && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                justifyContent: 'center',
                mb: 2,
              }}
            >
              {[
                'Austria',
                'Hungary',
                'Czech Republic',
                'Slovakia',
                'Poland',
                'Ukraine',
                'Romania',
                'Italy',
                'Slovenia',
                'Croatia',
                'Bosnia and Herzegovina',
                'Serbia',
                'Montenegro',
                'North Macedonia',
              ].map((country) => (
                <Box
                  key={country}
                  sx={{
                    borderRadius: 999,
                    borderColor: '#3a3f5a',
                    color: '#232946',
                    fontWeight: 500,
                    fontSize: 16,
                    px: 2.5,
                    py: 1,
                    background: 'rgba(0, 184, 255, 0.10)',
                    borderWidth: 2,
                    borderStyle: 'solid',
                    textAlign: 'center',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    boxShadow: 1,
                    mb: 0.5,
                  }}
                >
                  {country}
                </Box>
              ))}
            </Box>
          )}

          {/* Answer Options */}
          {question.type === 'yesNo' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {['yes', 'no', 'not_sure'].map((option) => (
                <Button
                  key={option}
                  variant="outlined"
                  onClick={() => onAnswer(option)}
                  sx={{
                    justifyContent: 'space-between',
                    borderRadius: 999,
                    borderColor: '#3a3f5a',
                    color: option === 'not_sure' ? '#ffc371' : '#43e97b',
                    background: '#232946',
                    fontWeight: 500,
                    fontSize: { xs: 18, md: 24 },
                    px: 3,
                    py: 1.5,
                    borderWidth: 2,
                    borderStyle: 'solid',
                    transition: '0.2s',
                    '&:hover': {
                      background: '#232946',
                      color: option === 'not_sure' ? '#ffc371' : '#43e97b',
                      borderColor: '#fff',
                      borderWidth: 2,
                    },
                    ...(currentAnswer === option && {
                      background: option === 'not_sure' ? '#ffc371' : '#43e97b',
                      color: '#232946',
                      borderColor: option === 'not_sure' ? '#ffc371' : '#43e97b',
                    }),
                  }}
                  endIcon={currentAnswer === option ? <CheckCircleIcon sx={{ color: '#232946' }} /> : null}
                >
                  {option === 'yes' ? 'Yes' : option === 'no' ? 'No' : "I'm not sure"}
                </Button>
              ))}
            </Box>
          )}

          {question.type === 'date' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                type="date"
                value={currentAnswer || ''}
                onChange={(e) => onAnswer(e.target.value)}
                sx={{
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
                  },
                  '& .MuiInputLabel-root': {
                    color: '#232946',
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Box>
          )}

          {question.type === 'dropdown' && question.options && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {question.options.map((option) => (
                <Button
                  key={option}
                  variant="outlined"
                  onClick={() => onAnswer(option)}
                  sx={{
                    justifyContent: 'space-between',
                    borderRadius: 999,
                    borderColor: '#3a3f5a',
                    color: '#43e97b',
                    background: '#232946',
                    fontWeight: 500,
                    fontSize: { xs: 18, md: 24 },
                    px: 3,
                    py: 1.5,
                    borderWidth: 2,
                    borderStyle: 'solid',
                    transition: '0.2s',
                    '&:hover': {
                      background: '#232946',
                      color: '#43e97b',
                      borderColor: '#fff',
                      borderWidth: 2,
                    },
                    ...(currentAnswer === option && {
                      background: '#43e97b',
                      color: '#232946',
                      borderColor: '#43e97b',
                    }),
                  }}
                  endIcon={currentAnswer === option ? <CheckCircleIcon sx={{ color: '#232946' }} /> : null}
                >
                  {option}
                </Button>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Next Button for dropdown */}
      {showNext && (
        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{
            maxWidth: 420,
            borderRadius: 999,
            fontWeight: 700,
            fontSize: { xs: 22, md: 28 },
            py: { xs: 1.5, md: 2 },
            background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
            color: '#fff',
            boxShadow: '0 4px 24px 0 rgba(33, 203, 243, 0.2)',
            mt: 2,
            mb: 2,
            '&:hover': {
              background: 'linear-gradient(90deg, #21cbf3 0%, #2196f3 100%)',
            },
          }}
          onClick={onNext}
          disabled={!currentAnswer}
        >
          {currentQuestion === totalQuestions ? 'See Results' : 'Next'}
        </Button>
      )}
    </>
  );
};

export default QuestionCard; 