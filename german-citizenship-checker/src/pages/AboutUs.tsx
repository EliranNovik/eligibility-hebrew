import React from 'react';
import { Box, Typography, Container, Divider, Button } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GavelIcon from '@mui/icons-material/Gavel';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  const titleColor = '#7ecbff';

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          pt: 8,
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(13, 27, 62, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%)',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 8, flex: 1, position: 'relative', zIndex: 2 }}>
          <Typography variant="h3" fontWeight={700} mb={6} sx={{ color: 'white', textAlign: 'center', direction: 'rtl' }}>
            אודות המשרד
          </Typography>
          <Divider sx={{ mb: 6, mx: 'auto', width: 80, borderColor: 'primary.main', opacity: 0.5 }} />

          {/* Partners Row */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: 4,
            mb: 10,
          }}>
            {/* Joshua Pex */}
            <Box sx={{
              flex: 1,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
              pt: 4,
              boxShadow: 6,
              minWidth: 260,
              maxWidth: 340,
            }}>
              <img src="/JOSHUA.jpg" alt="Joshua Pex" style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 16, marginBottom: 16 }} />
              <Typography fontWeight={700} fontSize={22} sx={{ color: '#fff', textAlign: 'right', mb: 0.5 }}>
                יהושע פקס, עו"ד
              </Typography>
              <Typography fontWeight={600} fontSize={18} sx={{ color: '#b0b8c9', textAlign: 'right', mb: 1 }}>
                שותף מייסד
              </Typography>
            </Box>
            {/* Michael Decker */}
            <Box sx={{
              flex: 1,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
              pt: 4,
              boxShadow: 6,
              minWidth: 260,
              maxWidth: 340,
            }}>
              <img src="/MDIMAGE.jpg" alt="Michael Decker" style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 16, marginBottom: 16 }} />
              <Typography fontWeight={700} fontSize={22} sx={{ color: 'white', textAlign: 'right', mb: 0.5 }}>
                מיכאל דקר, עו"ד
              </Typography>
              <Typography fontWeight={600} fontSize={18} sx={{ color: '#b0b8c9', textAlign: 'right', mb: 1 }}>
                שותף מייסד
              </Typography>
            </Box>
            {/* Anat Levi */}
            <Box sx={{
              flex: 1,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
              pt: 4,
              boxShadow: 6,
              minWidth: 260,
              maxWidth: 340,
            }}>
              <img src="/ANAT.jpg" alt="Anat Levi" style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 16, marginBottom: 16 }} />
              <Typography fontWeight={700} fontSize={22} sx={{ color: 'white', textAlign: 'right', mb: 0.5 }}>
                ענת לוי, עו"ד
              </Typography>
              <Typography fontWeight={600} fontSize={18} sx={{ color: '#b0b8c9', textAlign: 'right', mb: 1 }}>
                שותפה
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" fontSize={22} sx={{ color: 'white', mb: 8, mt: 16, textAlign: 'right', maxWidth: 900, mx: 'auto', direction: 'rtl' }}>
משרד עורכי הדין דקר, פקס, לוי הוא משרד דינמי ומוערך, הפועל בתל אביב ובירושלים ומשרת לקוחות בישראל וברחבי העולם. המשרד ידוע במחויבותו למצוינות משפטית, לשירות אישי ללקוח, ולגישה מעשית וממוקדת תוצאות. אנו נהנים ממוניטין חזק בתחומי האזרחות האירופית, דיני ההגירה והמשפט המנהלי, ומסייעים ליחידים ולמשפחות בהתמודדות עם אתגרים משפטיים מורכבים בביטחון ובמקצועיות.
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 5,
            mb: 7,
            mt: 16,
            alignItems: 'stretch',
            justifyContent: 'center',
            maxWidth: '100%',
            width: '100%',
            boxSizing: 'border-box',
            px: { xs: 1, sm: 0 },
          }}>
            {/* Who We Are - Left */}
            <Box sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: 500,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.10)',
              borderRadius: 4,
              color: 'white',
              p: { xs: 3, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              mb: { xs: 4, md: 0 },
            }}>
              <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: titleColor, textAlign: 'right', direction: 'rtl' }}>
                מי אנחנו
              </Typography>
              <Typography variant="body1" fontSize={18} mb={2} sx={{ color: 'white', textAlign: 'right', direction: 'rtl' }}>
המשרד נוסד על ידי צוות עורכי דין בעלי רקע בינלאומי מגוון, המשלבים מומחיות מקומית מעמיקה עם ראייה גלובלית רחבה. עורכי הדין שלנו דוברים מספר שפות, בהן גרמנית, אנגלית, רוסית ועברית, מה שמאפשר לנו להעניק שירות מותאם ורגיש ללקוחות מרקעים תרבותיים ולאומיים שונים.
              </Typography>
              <Typography variant="body1" fontSize={18} mb={2} sx={{ color: 'white', textAlign: 'right', direction: 'rtl' }}>
תחום התמחות מרכזי של המשרד הוא סיוע ללקוחות בהשבת אזרחות גרמנית ואוסטרית – בפרט לצאצאי ניצולי שואה ולבני משפחות שאיבדו את אזרחותם בשל רדיפה, עקירה או עוולות היסטוריות. צוות המשרד כולל משפטנים וחוקרים מנוסים בעלי ידע רב בעבודה ארכיונית ובליווי משפטי מקצועי.
              </Typography>
             
            </Box>
            {/* What We Do - Right */}
            <Box sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: 500,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.10)',
              borderRadius: 4,
              color: 'white',
              p: { xs: 3, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}>
              <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: titleColor, textAlign: 'right', direction: 'rtl' }}>
                מה אנחנו עושים
              </Typography>
              <Typography variant="body1" fontSize={18} mb={2} sx={{ color: 'white', textAlign: 'right', direction: 'rtl' }}>
המשרד מעניק ללקוחותיו לא רק ייצוג משפטי, אלא ליווי מקיף לאורך כל תהליך קבלת האזרחות. החל מביצוע מחקר ארכיוני והערכת זכאות, דרך איסוף והכנת המסמכים הדרושים, ועד להגשת הבקשה לרשויות – אנו דואגים שכל שלב יתבצע ברמה הגבוהה ביותר ובשירות אישי ומוקפד.
              </Typography>
              <Typography variant="body1" fontSize={18} mb={2} sx={{ color: 'white', textAlign: 'right', direction: 'rtl' }}>
                בנוסף לשירותי אזרחות אירופית, אנו מציעים ייעוץ משפטי גם בתחומים הבאים:
              </Typography>
              <Box sx={{ textAlign: 'right', display: 'inline-block', mx: 'auto', mb: 2, direction: 'rtl' }}>
                <ul style={{ fontSize: 21, color: '#7ecbff', fontWeight: 500, margin: 0, paddingRight: 24, direction: 'rtl', textAlign: 'right' }}>
                  <li>דיני הגירה (עלייה, אשרות, התאזרחות)</li>
                  <li>משפט מנהלי בישראל</li>
                  <li>דיני משפחה וירושה</li>
                  <li>נדל"ן ודיני חברות</li>
                </ul>
              </Box>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={600} mb={3} sx={{ color: titleColor, textAlign: 'center', mt: 12, direction: 'rtl' }}>
            מדוע לבחור בנו
          </Typography>
          <Box
            sx={{
              overflowX: { xs: 'auto', sm: 'visible' },
              whiteSpace: { xs: 'nowrap', sm: 'normal' },
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: 2,
              mb: 6,
              mt: 3,
              pb: { xs: 2, sm: 0 },
              pr: { xs: 10, sm: 0 },
              pl: { xs: 68, sm: 10 },
            }}
          >
            <Box sx={{ flex: 1, minWidth: { xs: 220, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.10)', borderRadius: 4, color: 'white', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
              <GavelIcon sx={{ color: '#fff', fontSize: 32, mb: 1 }} />
              <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="white" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center', direction: 'rtl' }}>
                שנות ניסיון משפטי מצטבר רבות
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: { xs: 220, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: '0 6px 32px 0 rgba(33, 150, 243, 0.10)', borderRadius: 4, color: 'white', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
              <PublicIcon sx={{ color: '#fff', fontSize: 32, mb: 1 }} />
              <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="white" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center', direction: 'rtl' }}>
                צוות רב-לשוני הדובר אנגלית, עברית, גרמנית, רוסית וצרפתית
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: { xs: 220, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: '0 6px 32px 0 rgba(255, 179, 0, 0.10)', borderRadius: 4, color: 'white', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
              <PeopleIcon sx={{ color: '#fff', fontSize: 32, mb: 1 }} />
              <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="white" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center', direction: 'rtl' }}>
                שירות אישי עם גישה ישירה לעורך דין מלווה
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: { xs: 220, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: '0 6px 32px 0 rgba(171, 71, 188, 0.10)', borderRadius: 4, color: 'white', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
              <SearchIcon sx={{ color: '#fff', fontSize: 32, mb: 1 }} />
              <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="white" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center', direction: 'rtl' }}>
                צוות מחקר ארכיוני פנימי לטיפול בתיקי אזרחות
              </Typography>
            </Box>
          </Box>
        </Container>
        <Footer />
      </Box>
    </>
  );
};

export default AboutUs; 