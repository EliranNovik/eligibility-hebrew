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
    label: 'Free express eligibility assessment',
    color: 'rgba(67, 233, 123, 0.25)',
  },
  {
    icon: SearchIcon,
    label: 'Thorough online archival research at no cost',
    color: 'rgba(33, 150, 243, 0.25)',
  },
  {
    icon: ForumIcon,
    label: 'A detailed consultation to present our findings',
    color: 'rgba(255, 179, 0, 0.25)',
  },
  {
    icon: PersonPinIcon,
    label: 'Personalized guidance through the citizenship application process',
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
          <Typography variant="h3" fontWeight={700} mb={6} sx={{ color: 'white', textAlign: 'center' }}>
            Archival Research
          </Typography>
          <Typography variant="h5" fontWeight={600} mb={5} sx={{ color: 'white', textAlign: 'center' }}>
            Are you exploring the possibility of reclaiming German or Austrian citizenship?
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: 'white', textAlign: 'left' }} mb={5}>
            Our internal archival research team is designated to help you uncover the historical evidence needed to support your citizenship process.
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: 'white', textAlign: 'left' }} mb={5}>
            Whether you're just beginning your journey or have already gathered partial information, our team of German-speaking archival researchers is here to assist. With over three years of focused experience in German and Austrian citizenship law, we understand the challenges and intricacies of tracing family records through decades of history, war, migration, and persecution.
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: 'white', textAlign: 'left' }} mb={5}>
            Using advanced research tools, exclusive access to digital archives, and multilingual expertise, we are often able to determine a client's eligibility within just one business day—even with minimal starting information, such as only the name and birthdate of a persecuted ancestor.
          </Typography>
          <Typography variant="h5" fontWeight={600} mb={4} sx={{ color: 'white', textAlign: 'center' }}>
            What We Offer:
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
          <Typography variant="body1" fontSize={18} sx={{ color: 'white', textAlign: 'left' }} mb={5}>
            We take pride in our <b>80% success rate</b> in identifying eligibility quickly and accurately. Our team has helped hundreds of families reconnect with their roots and reclaim citizenship that was unjustly stripped during the Nazi era or post-war period.
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: 'white', textAlign: 'left' }} mb={5}>
            By choosing us, you're not only gaining access to expertise—you're working with a team that cares about history, justice, and restoring what was once taken away.
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#7ecbff', textAlign: 'center' }} mb={6}>
            Get started today and take the first step toward reclaiming your family's European legacy.
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
              Start Eligibility Check
            </Button>
          </Box>
        </Container>
        <Footer />
      </Box>
    </>
  );
};

export default ArchivalResearch; 