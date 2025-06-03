import React from 'react';
import { Box, Typography, Container, Button, Divider, useTheme, useMediaQuery } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import ForumIcon from '@mui/icons-material/Forum';
import PersonPinIcon from '@mui/icons-material/PersonPin';

const offers = [
  {
    icon: <CheckCircleIcon sx={{ color: '#43e97b', fontSize: 32 }} />, 
    label: 'Free express eligibility assessment',
    color: '#e8f5e9',
  },
  {
    icon: <SearchIcon sx={{ color: '#2196f3', fontSize: 32 }} />, 
    label: 'Thorough online archival research at no cost',
    color: '#e3f2fd',
  },
  {
    icon: <ForumIcon sx={{ color: '#ffb300', fontSize: 32 }} />, 
    label: 'A detailed consultation to present our findings',
    color: '#fffde7',
  },
  {
    icon: <PersonPinIcon sx={{ color: '#ab47bc', fontSize: 32 }} />, 
    label: 'Personalized guidance through the citizenship application process',
    color: '#f3e5f5',
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
          bgcolor: 'rgba(35, 41, 70, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          pt: 8,
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
            opacity: 0.18,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ py: 8, flex: 1, position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" fontWeight={700} mb={6} sx={{ color: '#fff', textAlign: 'center' }}>
            Archival Research
          </Typography>
          <Divider sx={{ mb: 6, mx: 'auto', width: 80, borderColor: 'primary.main', opacity: 0.5 }} />
          <Typography variant="h5" fontWeight={600} mb={5} sx={{ color: '#fff', textAlign: 'center' }}>
            Are you exploring the possibility of reclaiming German or Austrian citizenship through your family heritage?
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: 'rgba(255,255,255,0.97)', textAlign: 'center' }} mb={5}>
            Our specialized online archival research service is designed to help you uncover the historical evidence needed to support your citizenship claim under:
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: '#7ecbff', fontWeight: 600, textAlign: 'center' }} mb={4}>
            §116, §15, and §5 of the German Nationality Act<br />
            §58c of the Austrian Citizenship Act
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: 'rgba(255,255,255,0.97)', textAlign: 'center' }} mb={5}>
            Whether you're just beginning your journey or have already gathered partial information, our team of German-speaking archival researchers is here to assist. With over three years of focused experience in German and Austrian citizenship law, we understand the challenges and intricacies of tracing family records through decades of history, war, migration, and persecution.
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: 'rgba(255,255,255,0.97)', textAlign: 'center' }} mb={5}>
            Using advanced research tools, exclusive access to digital archives, and multilingual expertise, we are often able to determine a client's eligibility within just one business day—even with minimal starting information, such as only the name and birthdate of a persecuted ancestor.
          </Typography>
          <Divider sx={{ my: 6, mx: 'auto', width: 60, borderColor: 'primary.light', opacity: 0.5 }} />
          <Typography variant="h5" fontWeight={600} mb={4} sx={{ color: '#fff', textAlign: 'center' }}>
            What We Offer:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: 5,
              mb: 6,
              mt: 3,
            }}
          >
            {offers.map((offer, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: 1,
                  minWidth: 220,
                  maxWidth: 320,
                  background: offer.color,
                  borderRadius: 5,
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 3,
                  px: 2,
                  textAlign: 'center',
                  gap: 1.5,
                  transition: 'transform 0.18s',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.04)',
                    boxShadow: '0 6px 24px 0 rgba(67,233,123,0.13)',
                  },
                }}
              >
                <Box sx={{ mb: 1 }}>{offer.icon}</Box>
                <Typography fontWeight={600} fontSize={17} color="#232946">
                  {offer.label}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography variant="body1" fontSize={18} sx={{ color: 'rgba(255,255,255,0.97)', textAlign: 'center' }} mb={5}>
            We take pride in our <b>80% success rate</b> in identifying eligibility quickly and accurately. Our team has helped hundreds of families reconnect with their roots and reclaim citizenship that was unjustly stripped during the Nazi era or post-war period.
          </Typography>
          <Typography variant="body1" fontSize={18} sx={{ color: 'rgba(255,255,255,0.97)', textAlign: 'center' }} mb={5}>
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