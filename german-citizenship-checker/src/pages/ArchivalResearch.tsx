import React from 'react';
import { Box, Typography, Container, Button, useTheme, useMediaQuery } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import ForumIcon from '@mui/icons-material/Forum';
import PersonPinIcon from '@mui/icons-material/PersonPin';

const offers = [
  {
    icon: CheckCircleIcon,
    label: 'בדיקת זכאות מהירה וללא עלות',
    color: 'rgba(67, 233, 123, 0.25)',
  },
  {
    icon: SearchIcon,
    label: 'מחקר ארכיוני מקוון יסודי – ללא תשלום',
    color: 'rgba(33, 150, 243, 0.25)',
  },
  {
    icon: ForumIcon,
    label: 'פגישת ייעוץ להצגת הממצאים',
    color: 'rgba(255, 179, 0, 0.25)',
  },
  {
    icon: PersonPinIcon,
    label: 'ליווי אישי לאורך כל תהליך בקשת האזרחות',
    color: 'rgba(171, 71, 188, 0.25)',
  },
];

const ArchivalResearch = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          bgcolor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          pt: 8,
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(13, 27, 62, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.15,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ py: 8, flex: 1, position: 'relative', zIndex: 2 }}>
          <Typography variant="h3" fontWeight={700} mb={6} sx={{ color: 'white', textAlign: 'center', direction: 'rtl' }}>
            מחקר ארכיוני
          </Typography>
          <Typography variant="h5" fontWeight={600} mb={5} sx={{ color: 'white', textAlign: 'center', direction: 'rtl' }}>
            מתעניינים בהשבת אזרחות גרמנית או אוסטרית?
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: 'white', textAlign: 'right', direction: 'rtl' }} mb={5}>
            צוות המחקר הארכיוני הפנימי שלנו הוקם במיוחד כדי לעזור לכם לחשוף את הראיות ההיסטוריות הנחוצות לתהליך קבלת האזרחות.
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: 'white', textAlign: 'right', direction: 'rtl' }} mb={5}>
            בין אם אתם רק בתחילת הדרך או שכבר הצלחתם לאסוף מידע חלקי – צוות החוקרים דוברי הגרמנית שלנו עומד לרשותכם. עם ניסיון של למעלה משלוש שנים בתחום דיני האזרחות הגרמנית והאוסטרית, אנו מכירים מקרוב את האתגרים שבאיתור מסמכים משפחתיים מתקופות של מלחמות, הגירה, ורדיפה.
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: 'white', textAlign: 'right', direction: 'rtl' }} mb={5}>
            באמצעות כלים מתקדמים, גישה בלעדית לארכיונים דיגיטליים, וידע רב-לשוני, אנו מצליחים ברוב המקרים לקבוע זכאות לאזרחות בתוך יום עבודה אחד בלבד – גם כאשר המידע ההתחלתי מצומצם, כמו שם ותאריך לידה בלבד של קרוב משפחה שנרדף.
          </Typography>
          <Typography variant="h5" fontWeight={600} mb={4} sx={{ color: 'white', textAlign: 'right', direction: 'rtl' }}>
            מה אנחנו מציעים:
          </Typography>
          <Box
            sx={{
              overflowX: { xs: 'auto', sm: 'visible' },
              whiteSpace: { xs: 'nowrap', sm: 'normal' },
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: 0,
              mb: 6,
              mt: 3,
              pb: { xs: 2, sm: 0 },
              pr: { xs: 2, sm: 0 },
              width: { xs: '100vw', sm: '100%' },
              position: { xs: 'relative', sm: 'static' },
              left: { xs: '50%', sm: 'auto' },
              right: { xs: '50%', sm: 'auto' },
              marginLeft: { xs: '-50vw', sm: 0 },
              marginRight: { xs: '-50vw', sm: 0 },
            }}
          >
            {offers.map((offer, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: 1,
                  minWidth: { xs: 140, sm: 200 },
                  maxWidth: { xs: 340, sm: 320 },
                  background: offer.color,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  color: 'white',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: { xs: 2, sm: 3 },
                  px: { xs: 2, sm: 2 },
                  textAlign: 'center',
                  gap: 1,
                  transition: 'transform 0.18s',
                  ml: idx === 0 ? { xs: 2, sm: 0 } : 0,
                  mr: { xs: 1, sm: 0 },
                  borderRadius: 4,
                  boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.10)',
                  '&:last-of-type': { mr: 0 },
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.04)',
                    boxShadow: '0 6px 24px 0 rgba(67,233,123,0.13)',
                  },
                }}
              >
                <Box sx={{ mb: 1 }}>
                  {React.createElement(offer.icon, { sx: { color: '#fff', fontSize: 32 } })}
                </Box>
                <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="#fff" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center' }}>
                  {offer.label}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography variant="body1" fontSize={18} sx={{ color: 'white', textAlign: 'right', direction: 'rtl' }} mb={5}>
            אנו גאים באחוז הצלחה של 80% בזיהוי זכאות בצורה מהירה ומדויקת. צוות המחקר שלנו סייע למאות משפחות להתחבר מחדש לשורשיהן ולהחזיר אזרחות שנשללה בעוול בתקופת הנאצים או לאחריה.
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: 'white', textAlign: 'right', direction: 'rtl' }} mb={5}>
            כאשר אתם בוחרים בנו, אתם לא רק מקבלים גישה למומחיות – אתם פועלים עם צוות שמאמין בצדק היסטורי ובהשבת זכויות שנשללו.
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#7ecbff', textAlign: 'center', direction: 'rtl' }} mb={6}>
            התחילו כבר היום – וצעדו לעבר השבת המורשת האירופית של משפחתכם.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                fontWeight: 700,
                fontSize: 20,
                borderRadius: 3,
                px: 5,
                py: 1.5,
                boxShadow: 2,
                background: 'linear-gradient(90deg, #646cff, #535bf2)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(90deg, #535bf2, #646cff)',
                },
              }}
              onClick={() => navigate('/userinfo')}
            >
              התחילו בדיקת זכאות
            </Button>
          </Box>
        </Container>
        <Footer />
      </Box>
    </>
  );
};

export default ArchivalResearch; 