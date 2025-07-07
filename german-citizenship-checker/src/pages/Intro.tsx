import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Container, styled } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import LawRequirements from '../components/LawRequirements';
import { useState, useRef } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: '#1a1a1a',
  color: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.23)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 'bold',
  background: 'linear-gradient(90deg, #646cff, #535bf2)',
  color: 'white',
  marginTop: theme.spacing(3),
  '&:hover': {
    background: 'linear-gradient(90deg, #535bf2, #646cff)',
  },
}));

const lawRequirements = {
  '116': {
    title: 'שחזור זכויות לנפגעי הנאצים',
    requirements: [
      { text: 'האב הקדמון היה אזרח גרמני לפני 1933' },
      { text: 'האב הקדמון נשלל מאזרחותו בתקופת המשטר הנאצי (1933-1945)', subtext: 'כולל שלילה קולקטיבית' },
      { text: 'צאצא ישיר של האב הקדמון', subtext: 'ילד, נכד או נין' },
      { text: 'הוכחה מתועדת לרדיפה', subtext: 'רדיפה דתית, פוליטית, גזעית או אחרת' },
      { text: 'אין הגבלת זמן להגשת הבקשה', subtext: 'הזכות לשחזור אינה פוקעת' }
    ]
  },
  '15': {
    title: 'התאזרחות לצאצאים',
    requirements: [
      { text: 'האב הקדמון התגורר בגרמניה לפני 1933' },
      { text: 'האב הקדמון נרדף בתקופת המשטר הנאצי', subtext: 'אך לא היה אזרח גרמני' },
      { text: 'המרכז חיים של האב הקדמון היה בגרמניה', subtext: 'עבודה, לימודים או מגורים קבועים' },
      { text: 'קשר צאצאות ישיר', subtext: 'ילד, נכד או נין' },
    ]
  },
  '5': {
    title: 'תיקון אפליה היסטורית',
    requirements: [
      { text: 'נולדת לפני 1 בינואר 1975 לאם גרמנייה', subtext: 'ואב שאינו גרמני' },
      { text: 'נולדת בין 1949 ל-1993 לאב גרמני', subtext: 'מחוץ לנישואין' },
      { text: 'האם איבדה את אזרחותה הגרמנית עקב נישואין לפני 1953' },
      { text: 'ילד של מי שעומד בקריטריונים אלו' },
      { text: 'יש להגיש בקשה עד 19 באוגוסט 2031', subtext: 'מועד אחרון בחוק' }
    ]
  },
  '58c': {
    title: 'חוק אוסטרי לצאצאי נפגעי הנאצים',
    requirements: [
      { text: 'האב הקדמון התגורר באוסטריה לפני 15 במאי 1955' },
      { text: 'האב הקדמון נרדף על ידי המשטר הנאצי', subtext: 'כולל רדיפה יהודית' },
      { text: 'האב הקדמון ברח מאוסטריה בין 1933-1955' },
      { text: 'צאצא ישיר של האב הקדמון', subtext: 'ללא הגבלת דורות' },
      { text: 'אין דרישת שפה גרמנית' },
      { text: 'ניתן לשמור על אזרחות קיימת', subtext: 'אזרחות כפולה מותרת' }
    ]
  }
};

const Intro = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showPhonePopover, setShowPhonePopover] = useState(false);

  const handleSectionClick = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      <Header />
      <Box sx={{ 
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        pt: 8,
        position: 'relative',
        zIndex: 1,
      }}>
        <Box sx={{ 
          mt: 0, 
          width: '100%', 
          maxWidth: 1200, 
          px: { xs: 2, md: 4 },
          position: 'relative',
          zIndex: 1
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ width: '100%' }}
          >
            <StyledButton
              fullWidth={false}
              size="large"
              sx={{
                width: { xs: '100%', md: 'auto' },
                minWidth: { md: 240 },
                maxWidth: { md: 340 },
                display: 'block',
                mx: { xs: 0, md: 'auto' },
                fontSize: 18,
                fontWeight: 700,
                borderRadius: 3,
                py: 1.5,
                px: 5,
                mt: 4,
                mb: 6,
              }}
              onClick={() => navigate('/userinfo')}
            >
              התחל בדיקת זכאות
            </StyledButton>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ color: 'white', mb: 8, fontSize: 40, direction: 'rtl', textAlign: 'center' }}>
                האם אתה זכאי לאזרחות גרמנית או אוסטרית?
              </Typography>
            </motion.div>
            <Box sx={{
              position: 'relative',
              width: '100%',
            }}>
              {/* Scroll indicators for mobile */}
              <Box
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  position: 'absolute',
                  top: '50%',
                  left: 8,
                  zIndex: 2,
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  animation: 'bounceLeft 1.2s infinite',
                }}
              >
                <ChevronLeftIcon sx={{ color: '#fff', fontSize: 32, opacity: 0.7 }} />
              </Box>
              <Box
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  position: 'absolute',
                  top: '50%',
                  right: 8,
                  zIndex: 2,
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  animation: 'bounceRight 1.2s infinite',
                }}
              >
                <ChevronRightIcon sx={{ color: '#fff', fontSize: 32, opacity: 0.7 }} />
              </Box>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 80vw)', md: '1fr 1fr' },
                gap: 4,
                mb: 15,
                mt: 10,
                maxWidth: 1200,
                mx: 'auto',
                px: { xs: 2, md: 4 },
                overflowX: { xs: 'auto', md: 'visible' },
                overflowY: 'visible',
                scrollSnapType: { xs: 'x mandatory', md: 'none' },
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': { height: 8 },
                '&::-webkit-scrollbar-thumb': { background: '#2196f3', borderRadius: 4 },
              }}>
                {/* About Section */}
                <Box sx={{
                  background: 'rgba(0, 0, 0, 0.15)',
                  borderRadius: 4,
                  p: 4,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  scrollSnapAlign: { xs: 'center', md: 'none' },
                  minWidth: { xs: '70vw', md: 'auto' },
                  maxWidth: { xs: 340, md: 600 },
                  mx: { xs: 1, md: 0 },
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3, letterSpacing: 1, fontSize: 20, textAlign: 'center', direction: 'rtl', width: '100%' }}>
                    אודות דקר פקס לוי
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.92)', fontWeight: 500, fontSize: 16, lineHeight: 1.8, maxWidth: '90%', textAlign: 'right', direction: 'rtl', hyphens: 'auto' }}>
                    במשרד עורכי הדין דקר, פקס, לוי אנו מספקים ייעוץ משפטי מקצועי בתחום אזרחות גרמנית ואוסטרית. הצוות שלנו מתמחה בסיוע ללקוחות בתביעות המבוססות על מוצא, מורשת ועוולות היסטוריות – כולל מקרים בהם בני משפחה נרדפו, הוגלו או נשללו מזכויותיהם תחת משטרים קודמים. גם אם אבותיך לא הוכרו רשמית כאזרחים, ייתכן שחוקי האזרחות הנוכחיים יאפשרו לך להשיב את האזרחות, ואנו כאן כדי להוביל אותך בתהליך.
                    <br /><br />
                    עם עשרות שנות ניסיון מצטבר וגישה רב-לשונית וממוקדת לקוח, משרדנו הפך לשם אמין בתחום ההגירה והאזרחות. לצד ההתמקדות המרכזית באזרחות גרמנית ואוסטרית, אנו מעניקים תמיכה משפטית גם בתחומים משיקים כגון הגירה לישראל, ויזות לחו"ל ואזרחות כפולה. בין אם אתה משחזר קשר אבוד לעבר המשפחתי או מתכנן עתיד חדש בחו"ל, דקר, פקס, לוי כאן בשבילך – במקצועיות, מסירות ויחס אישי.
                  </Typography>
                </Box>

                {/* How it works Section */}
                <Box sx={{
                  background: 'rgba(0, 0, 0, 0.15)',
                  borderRadius: 4,
                  p: 4,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  scrollSnapAlign: { xs: 'center', md: 'none' },
                  minWidth: { xs: '70vw', md: 'auto' },
                  maxWidth: { xs: 340, md: 600 },
                  mx: { xs: 1, md: 0 },
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3, letterSpacing: 1, fontSize: 20, textAlign: 'center', direction: 'rtl', width: '100%' }}>
                    איך זה עובד
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.92)', fontWeight: 500, fontSize: 16, lineHeight: 1.8, mb: 2, maxWidth: '90%', textAlign: 'right', direction: 'rtl', hyphens: 'auto' }}>
                    בודק הזכאות שלנו הוא כלי מהיר וידידותי למשתמש שנועד לעזור לך לבדוק האם אתה עשוי להיות זכאי לאזרחות גרמנית או אוסטרית? פשוט ענה על סדרה קצרה של שאלות פשוטות המבוססות על ההיסטוריה המשפחתית והרקע האישי שלך. תוך דקות תקבל הערכת זכאות מותאמת אישית – ללא ניירת או ידע משפטי נדרש.
                  </Typography>
                  <Box sx={{ mb: 4 }} />
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 3, 
                    mb: 2, 
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    width: '100%'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupsIcon sx={{ color: '#2196f3', fontSize: 28 }} />
                      <Typography variant="body1" sx={{ 
                        color: 'rgba(255,255,255,0.92)', 
                        fontWeight: 500, 
                        fontSize: 16,
                        lineHeight: 1.8
                      }}>
                        ייעוץ חינם
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SearchIcon sx={{ color: '#2196f3', fontSize: 28 }} />
                      <Typography variant="body1" sx={{ 
                        color: 'rgba(255,255,255,0.92)', 
                        fontWeight: 500, 
                        fontSize: 16,
                        lineHeight: 1.8
                      }}>
                        מחקר ארכיוני מהיר
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 4 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2, letterSpacing: 1, fontSize: 20, textAlign: 'center', direction: 'rtl', width: '100%' }}>
                    מה קורה בהמשך?
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.92)', fontWeight: 500, fontSize: 16, lineHeight: 1.8, maxWidth: '90%', textAlign: 'right', direction: 'rtl', hyphens: 'auto' }}>
                    לאחר שתשלים את הבדיקה, תוכל לקבוע פגישת ייעוץ חינם עם אחד ממומחי האזרחות שלנו. אם יש פוטנציאל למקרה שלך, נערוך מחקר ארכיוני מהיר כדי לאסוף ראיות תומכות ולספק לך את הדרך הברורה ביותר קדימה. המטרה שלנו היא לעזור לך לממש את זכאותך ביעילות ובדיוק מרביים – עם מינימום טרחה ומקסימום תמיכה.
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                mb: 20,
                mt: 20,
                px: { xs: 0, md: 0 },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(4, 80vw)',
                    sm: '1fr 1fr',
                    lg: 'repeat(4, 1fr)'
                  },
                  gap: 3,
                  overflowX: { xs: 'auto', sm: 'visible' },
                  overflowY: 'visible',
                  scrollSnapType: { xs: 'x mandatory', sm: 'none' },
                  WebkitOverflowScrolling: 'touch',
                  px: { xs: 2, md: 0 },
                  pb: { xs: 2, md: 0 },
                  scrollbarWidth: 'thin',
                  '&::-webkit-scrollbar': { height: 8 },
                  '&::-webkit-scrollbar-thumb': { background: '#2196f3', borderRadius: 4 },
                }}
              >
                {Object.entries(lawRequirements).map(([section, data], idx) => (
                  <Box key={section} sx={{ scrollSnapAlign: { xs: 'center', sm: 'none' }, animation: { xs: `fadeInBox 0.7s ${idx * 0.1}s both`, sm: 'none' }, position: 'relative' }}>
                    {/* Left arrow for mobile */}
                    <Box
                      sx={{
                        display: { xs: 'flex', sm: 'none' },
                        position: 'absolute',
                        left: -18,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        pointerEvents: 'none',
                        animation: 'bounceRight 1.2s infinite',
                      }}
                    >
                      <ChevronRightIcon sx={{ color: '#fff', fontSize: 28, opacity: 0.7 }} />
                    </Box>
                    {/* Right arrow for mobile */}
                    <Box
                      sx={{
                        display: { xs: 'flex', sm: 'none' },
                        position: 'absolute',
                        right: -18,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        pointerEvents: 'none',
                        animation: 'bounceRight 1.2s infinite',
                      }}
                    >
                     
                    </Box>
                    <Box
                      onClick={() => handleSectionClick(section)}
                      sx={{
                        background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                        color: '#232946',
                        borderRadius: 3,
                        p: 3,
                        boxShadow: 2,
                        textAlign: 'center',
                        transition: '0.2s',
                        cursor: 'pointer',
                        minWidth: { xs: '70vw', sm: 'auto' },
                        maxWidth: { xs: 340, sm: 'none' },
                        mx: { xs: 1, md: 0 },
                        minHeight: { xs: 260, sm: 260, md: 260 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #21cbf3 0%, #2196f3 100%)',
                          boxShadow: 6,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>§{section}</Typography>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{data.title}</Typography>
                      <Typography variant="body2" sx={{ mb: 2, textAlign: 'right', direction: 'rtl' }}>לחץ לצפייה בדרישות המפורטות</Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: '#232946',
                          color: '#fff',
                          minWidth: 48,
                          minHeight: 40,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 0,
                          mt: 4,
                          '&:hover': {
                            bgcolor: '#1a1a3a',
                          },
                        }}
                      >
                        <KeyboardArrowDownIcon
                          sx={{
                            color: '#fff',
                            fontSize: 36,
                            animation: 'bounceArrow 1.2s infinite',
                          }}
                        />
                      </Button>
                    </Box>
                    <LawRequirements
                      section={`§${section}`}
                      title={data.title}
                      requirements={data.requirements}
                      isOpen={openSection === section}
                      onClose={() => setOpenSection(null)}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
            <style>{`
              @keyframes bounceLeft {
                0%, 100% { transform: translateY(-50%) translateX(0); }
                50% { transform: translateY(-50%) translateX(-8px); }
              }
              @keyframes bounceRight {
                0%, 100% { transform: translateY(-50%) translateX(0); }
                50% { transform: translateY(-50%) translateX(8px); }
              }
              @keyframes fadeInBox {
                0% { opacity: 0; transform: scale(0.95); }
                100% { opacity: 1; transform: scale(1); }
              }
              @keyframes bounceArrow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(6px); }
              }
            `}</style>
          </motion.div>
        </Box>
       
        <Footer showContactButtons />
      </Box>
    </>
  );
};

export default Intro;