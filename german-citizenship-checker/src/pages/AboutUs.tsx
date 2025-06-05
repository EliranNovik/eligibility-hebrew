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
          <Box sx={{ mx: 'auto', maxWidth: 900, textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" fontWeight={700} mb={6} sx={{ color: '#fff' }}>
              About Us
            </Typography>
            <Divider sx={{ mb: 6, mx: 'auto', width: 80, borderColor: 'primary.main', opacity: 0.5 }} />
            <Typography variant="body1" fontSize={19} sx={{ color: 'rgba(255,255,255,0.97)', mb: 5 }}>
              Decker, Pex, Levi Law Offices is a dynamic Israeli law firm with offices in Tel Aviv and Jerusalem, providing legal services to individuals and families in Israel and around the world. Our firm is known for its dedication to excellence, personal client service, and deep understanding of complex legal systems—especially in matters involving European citizenship, immigration, and administrative law.
            </Typography>
            <Typography variant="h5" fontWeight={600} mb={3} sx={{ color: '#7ecbff', textAlign: 'center' }}>
              Who We Are
            </Typography>
            <Typography variant="body1" fontSize={18} sx={{ color: 'rgba(255,255,255,0.97)', mb: 4 }}>
              Founded by a diverse team of attorneys with international backgrounds, Decker, Pex, Levi combines local expertise with a global perspective. We specialize in handling German and Austrian citizenship applications, assisting descendants of Holocaust survivors and others whose families lost citizenship under persecution or emigration.
            </Typography>
            <Typography variant="body1" fontSize={18} sx={{ color: 'rgba(255,255,255,0.97)', mb: 4 }}>
              Our team includes German-speaking legal professionals and researchers with years of experience in tracing historical records, navigating bureaucratic systems, and securing citizenship for clients under laws such as:
            </Typography>
            <Typography variant="body1" fontSize={18} sx={{ color: '#7ecbff', fontWeight: 600, mb: 4 }}>
              §116, §15, and §5 of the German Nationality Act<br />
              §58c of the Austrian Citizenship Act
            </Typography>
            <Typography variant="h5" fontWeight={600} mb={3} sx={{ color: '#7ecbff', textAlign: 'center' }}>
              What We Do
            </Typography>
            <Typography variant="body1" fontSize={18} sx={{ color: 'rgba(255,255,255,0.97)', mb: 4 }}>
              We believe in offering not just legal representation, but comprehensive support throughout the entire citizenship process. From archival research and eligibility assessments to document preparation and application submission, we ensure every step is handled with care and professionalism.
            </Typography>
            <Typography variant="body1" fontSize={18} sx={{ color: 'rgba(255,255,255,0.97)', mb: 4 }}>
              In addition to European citizenship services, we provide legal counsel in:
            </Typography>
            <Box sx={{ textAlign: 'left', display: 'inline-block', mx: 'auto', mb: 5 }}>
              <ul style={{ fontSize: 18, color: '#b3e5fc', fontWeight: 500, margin: 0, paddingLeft: 24 }}>
                <li>Immigration law (Aliyah, visas, naturalization)</li>
                <li>Israeli administrative law</li>
                <li>Family law and inheritance matters</li>
                <li>Real estate and business law</li>
              </ul>
            </Box>
            <Typography variant="h5" fontWeight={600} mb={3} sx={{ color: '#7ecbff', textAlign: 'center' }}>
              Why Choose Us
            </Typography>
            <Box
              sx={{
                overflowX: { xs: 'auto', sm: 'visible' },
                whiteSpace: { xs: 'nowrap', sm: 'normal' },
                display: 'flex',
                flexDirection: { xs: 'row', sm: 'row' },
                justifyContent: 'center',
                alignItems: 'stretch',
                gap: 4,
                mb: 6,
                mt: 3,
                pb: { xs: 2, sm: 0 },
                pr: { xs: 2, sm: 0 },
                pl: { xs: 59, sm: 0 },
              }}
            >
              <Box sx={{ flex: 1, minWidth: { xs: 280, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: '#e8f5e9', borderRadius: 5, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
                <GavelIcon sx={{ color: '#43e97b', fontSize: 32, mb: 1 }} />
                <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="#232946" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center' }}>
                  Decades of combined legal experience
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: { xs: 280, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: '#e3f2fd', borderRadius: 5, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
                <PublicIcon sx={{ color: '#2196f3', fontSize: 32, mb: 1 }} />
                <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="#232946" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center' }}>
                  Multilingual team fluent in English, Hebrew, German, Russian, and French
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: { xs: 280, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: '#fffde7', borderRadius: 5, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
                <PeopleIcon sx={{ color: '#ffb300', fontSize: 32, mb: 1 }} />
                <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="#232946" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center' }}>
                  Personalized service and direct attorney access
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: { xs: 280, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: '#f3e5f5', borderRadius: 5, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
                <SearchIcon sx={{ color: '#ab47bc', fontSize: 32, mb: 1 }} />
                <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="#232946" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center' }}>
                  In-house archival research team for citizenship cases
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: { xs: 280, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: '#e1f5fe', borderRadius: 5, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
                <LocationOnIcon sx={{ color: '#0288d1', fontSize: 32, mb: 1 }} />
                <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="#232946" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center' }}>
                  Convenient offices in both Tel Aviv and Jerusalem
                </Typography>
              </Box>
            </Box>
            
            
          </Box>
        </Container>
        <Footer />
      </Box>
    </>
  );
};

export default AboutUs; 