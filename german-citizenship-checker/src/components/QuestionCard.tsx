import React from 'react';
import { Card, CardContent, Typography, Button, Box, LinearProgress, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (value: string | boolean) => void;
  currentAnswer: string | boolean | undefined;
  totalQuestions: number;
  currentQuestion: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  currentAnswer,
  totalQuestions,
  currentQuestion,
}) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <>
      {/* Progress bar and question number */}
      <Box sx={{ width: '100%', maxWidth: 420, mb: 4, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}>
          <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600, direction: 'rtl' }}>
            שאלה {currentQuestion} מתוך {totalQuestions}
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
              direction: 'rtl',
            }}
          >
            {currentQuestion}
          </Typography>
        </Box>
      </Box>

      {/* Question Card */}
      <Card sx={{ 
        width: '100%', 
        maxWidth: { xs: '100%', md: 540 }, 
        background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)', 
        color: '#232946', 
        borderRadius: 6, 
        boxShadow: 6, 
        mb: 4, 
        p: { xs: 0, md: 2 },
        mx: 'auto',
        direction: 'rtl',
        textAlign: 'right',
      }}>
        <CardContent sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, direction: 'rtl', textAlign: 'right' }}>
          <Typography variant="h5" sx={{ color: '#232946', fontWeight: 700, mb: 2, fontSize: { xs: 24, md: 32 }, textAlign: 'right', direction: 'rtl' }}>
            {question.text}
          </Typography>

          {/* Note for german_116_1 */}
          {question.id === 'german_116_1' && (
            <Box sx={{
              background: 'rgba(67, 233, 123, 0.18)',
              color: '#232946',
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
              דוגמאות כוללות:<br />
              <ul style={{ margin: 0, paddingRight: 18, direction: 'rtl', textAlign: 'right' }}>
                <li>רקע יהודי, צועני או סלאבי</li>
                <li>מתנגדים פוליטיים (למשל, קומוניסטים, סוציאל-דמוקרטים)</li>
                <li>להט"ב</li>
                <li>עדי יהוה</li>
                <li>אנשים עם מוגבלויות</li>
                <li>בונים חופשיים, פציפיסטים, "לא-ארים" לפי הגדרת הנאצים</li>
              </ul>
            </Box>
          )}

          {/* Note for austrian_58c_3 */}
          {question.id === 'austrian_58c_3' && (
            <Box sx={{
              background: 'rgba(67, 233, 123, 0.18)',
              color: '#232946',
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
              לדוגמה: האם ברחו מאוסטריה (בין 1933-1955), נמנעו מלחזור, גורשו או נהרגו בשל היותם יהודים, צוענים, פעילים פוליטית, דתיים, בעלי מוגבלות וכו'?
            </Box>
          )}

          {/* Special styled country list for austrian_58c_2 */}
          {question.id === 'austrian_58c_2' && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                mb: 3,
                width: '100%',
                mx: 'auto',
                direction: 'rtl',
                textAlign: 'right',
              }}
            >
              {/* Austrian Citizen Section */}
              <Box sx={{ 
                background: 'linear-gradient(90deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)',
                borderRadius: 4,
                p: 2,
                border: '2px solid #43e97b',
                position: 'relative',
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -12,
                  left: -12,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#43e97b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#232946',
                  fontWeight: 700,
                  fontSize: 18,
                  border: '2px solid #232946',
                }}>
                  1
                </Box>
                <Typography sx={{ 
                  color: '#43e97b', 
                  fontWeight: 700, 
                  fontSize: 18, 
                  mb: 1,
                  textAlign: 'center',
                  mt: 1,
                }}>
                  אזרח אוסטרי
                </Typography>
                <Box sx={{ 
                  background: '#232946',
                  borderRadius: 3,
                  p: 1.5,
                  textAlign: 'center',
                  color: '#43e97b',
                  fontWeight: 600,
                  fontSize: 16,
                }}>
                  אזרחות אוסטרית
                </Box>
              </Box>

              {/* Stateless Section */}
              <Box sx={{ 
                background: 'linear-gradient(90deg, rgba(255, 195, 113, 0.1) 0%, rgba(255, 95, 109, 0.1) 100%)',
                borderRadius: 4,
                p: 2,
                border: '2px solid #ffc371',
                position: 'relative',
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -12,
                  left: -12,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#ffc371',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#232946',
                  fontWeight: 700,
                  fontSize: 18,
                  border: '2px solid #232946',
                }}>
                  2
                </Box>
                <Typography sx={{ 
                  color: '#ffc371', 
                  fontWeight: 700, 
                  fontSize: 18, 
                  mb: 1,
                  textAlign: 'center',
                  mt: 1,
                }}>
                  חסר אזרחות
                </Typography>
                <Box sx={{ 
                  background: '#232946',
                  borderRadius: 3,
                  p: 1.5,
                  textAlign: 'center',
                  color: '#ffc371',
                  fontWeight: 600,
                  fontSize: 16,
                }}>
                  ללא אזרחות
                </Box>
              </Box>

              {/* Other Countries Section */}
              <Box sx={{ 
                background: 'linear-gradient(90deg, rgba(100, 108, 255, 0.1) 0%, rgba(83, 91, 242, 0.1) 100%)',
                borderRadius: 4,
                p: 2,
                border: '2px solid #646cff',
                position: 'relative',
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -12,
                  left: -12,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#646cff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#232946',
                  fontWeight: 700,
                  fontSize: 18,
                  border: '2px solid #232946',
                }}>
                  3
                </Box>
                <Typography sx={{ 
                  color: '#646cff', 
                  fontWeight: 700, 
                  fontSize: 18, 
                  mb: 1,
                  textAlign: 'center',
                  mt: 1,
                }}>
                  חלק מהאימפריה האוסטרו-הונגרית
                </Typography>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 1,
                }}>
                  {[
                    'הונגריה',
                    'צ׳כיה',
                    'סלובקיה',
                    'פולין',
                    'אוקראינה',
                    'רומניה',
                    'איטליה',
                    'סלובניה',
                    'קרואטיה',
                    'בוסניה והרצגובינה',
                    'סרביה',
                    'מונטנגרו',
                    'מקדוניה הצפונית'
                  ].map((country) => (
                    <Box
                      key={country}
                      sx={{
                        background: '#232946',
                        borderRadius: 2,
                        p: 1,
                        textAlign: 'center',
                        color: '#646cff',
                        fontWeight: 600,
                        fontSize: 14,
                        border: '1px solid rgba(100, 108, 255, 0.3)',
                      }}
                    >
                      {country}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* Note for german_116_3 */}
          {question.id === 'german_116_3' && (
            <Box sx={{
              background: 'rgba(67, 233, 123, 0.18)',
              color: '#232946',
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
              דוגמאות לשטחים בשליטת הנאצים:<br />
              <ul style={{ margin: 0, paddingRight: 18, direction: 'rtl', textAlign: 'right' }}>
                <li>דנציג (גדנסק)</li>
                <li>ממל (קלייפדה)</li>
                <li>חבל הסודטים</li>
                <li>קניגסברג / קלינינגרד</li>
                <li>שלזיה</li>
                <li>אוסטריה (לאחר 1938)</li>
                <li>אזורים כבושים בגרמניה (פולין, צרפת וכו')</li>
              </ul>
            </Box>
          )}

          {/* Answer Options */}
          {question.type === 'yesNo' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, width: '100%', maxWidth: 400, mx: 'auto', direction: 'rtl', textAlign: 'right' }}>
              {['yes', 'no', 'not_sure'].map((option) => {
                let label = '';
                if (option === 'yes') label = 'כן';
                else if (option === 'no') label = 'לא';
                else label = 'אני לא בטוח/ה';
                return (
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
                      width: '100%',
                      direction: 'rtl',
                      textAlign: 'right',
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
                    {label}
                  </Button>
                );
              })}
            </Box>
          )}

          {question.type === 'date' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, width: '100%', maxWidth: 400, mx: 'auto', direction: 'rtl', textAlign: 'right' }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, width: '100%', maxWidth: 400, mx: 'auto', direction: 'rtl', textAlign: 'right' }}>
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
                    width: '100%',
                    direction: 'rtl',
                    textAlign: 'right',
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
    </>
  );
};

export default QuestionCard; 