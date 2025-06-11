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
      <Header sx={{ position: 'relative', zIndex: 3 }} />
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
          <Typography variant="h3" fontWeight={700} mb={6} sx={{ color: 'white', textAlign: 'center' }}>
            About Us
          </Typography>
          <Divider sx={{ mb: 6, mx: 'auto', width: 80, borderColor: 'primary.main', opacity: 0.5 }} />
          <Typography variant="body1" fontSize={19} sx={{ color: 'white', mb: 5, textAlign: 'justify', maxWidth: 900, mx: 'auto' }}>
Decker, Pex, Levi Law Offices is a dynamic and respected Israeli law firm with offices in Tel Aviv and Jerusalem, serving clients both locally and internationally. We are known for our commitment to legal excellence, personalized client service, and a practical, results-driven approach. Our firm has developed a strong reputation in the fields of European citizenship, immigration law, and administrative law, helping individuals and families navigate some of the most complex legal challenges with confidence.
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 5,
            mb: 7,
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
              <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: titleColor, textAlign: 'left' }}>
                Who We Are
              </Typography>
              <Typography variant="body1" fontSize={18} mb={2} sx={{ color: 'white', textAlign: 'justify' }}>
Founded by a team of attorneys with diverse international backgrounds, Decker, Pex, Levi brings together deep local expertise and a broad global perspective. Our lawyers speak multiple languages, including German, English, Russian, and Hebrew, enabling us to serve clients from various cultural and national backgrounds with sensitivity and precision.
              </Typography>
              <Typography variant="body1" fontSize={18} mb={2} sx={{ color: 'white', textAlign: 'justify' }}>
A core focus of our practice is assisting clients in reclaiming German and Austrian citizenship, particularly descendants of Holocaust survivors and others whose families lost citizenship due to persecution, displacement, or historical injustices. Our team includes seasoned legal professionals and researchers with extensive experience in archival work and legal advocacy.
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
              <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: titleColor, textAlign: 'left' }}>
                What We Do
              </Typography>
              <Typography variant="body1" fontSize={18} mb={2} sx={{ color: 'white', textAlign: 'justify' }}>
                We believe in offering not just legal representation, but comprehensive support throughout the entire citizenship process. From archival research and eligibility assessments to document preparation and application submission, we ensure every step is handled with care and professionalism.
              </Typography>
              <Typography variant="body1" fontSize={18} mb={2} sx={{ color: 'white', textAlign: 'justify' }}>
                In addition to European citizenship services, we provide legal counsel in:
              </Typography>
              <Box sx={{ textAlign: 'left', display: 'inline-block', mx: 'auto', mb: 2 }}>
                <ul style={{ fontSize: 21, color: '#7ecbff', fontWeight: 500, margin: 0, paddingLeft: 24 }}>
                  <li>Immigration law (Aliyah, visas, naturalization)</li>
                  <li>Israeli administrative law</li>
                  <li>Family law and inheritance matters</li>
                  <li>Real estate and business law</li>
                </ul>
              </Box>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={600} mb={3} sx={{ color: titleColor, textAlign: 'center' }}>
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
              gap: 2,
              mb: 6,
              mt: 3,
              pb: { xs: 2, sm: 0 },
              pr: { xs: 10, sm: 0 },
              pl: { xs: 68, sm: 10 },
            }}
          >
            <Box sx={{ flex: 1, minWidth: { xs: 220, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: 'rgba(67, 233, 123, 0.25)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.10)', borderRadius: 4, color: 'white', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
              <GavelIcon sx={{ color: '#fff', fontSize: 32, mb: 1 }} />
              <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="white" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center' }}>
                Decades of combined legal experience
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: { xs: 220, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: 'rgba(33, 150, 243, 0.25)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: '0 6px 32px 0 rgba(33, 150, 243, 0.10)', borderRadius: 4, color: 'white', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
              <PublicIcon sx={{ color: '#fff', fontSize: 32, mb: 1 }} />
              <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="white" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center' }}>
                Multilingual team fluent in English, Hebrew, German, Russian, and French
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: { xs: 220, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: 'rgba(255, 179, 0, 0.25)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: '0 6px 32px 0 rgba(255, 179, 0, 0.10)', borderRadius: 4, color: 'white', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
              <PeopleIcon sx={{ color: '#fff', fontSize: 32, mb: 1 }} />
              <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="white" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center' }}>
                Personalized service and direct attorney access
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: { xs: 220, sm: 180 }, maxWidth: { xs: 340, sm: 260 }, background: 'rgba(171, 71, 188, 0.25)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: '0 6px 32px 0 rgba(171, 71, 188, 0.10)', borderRadius: 4, color: 'white', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 4, sm: 3 }, px: { xs: 3, sm: 2 }, textAlign: 'center', gap: 1.5, mr: { xs: 2, sm: 0 }, '&:last-of-type': { mr: 0 } }}>
              <SearchIcon sx={{ color: '#fff', fontSize: 32, mb: 1 }} />
              <Typography fontWeight={600} fontSize={{ xs: 14, sm: 17 }} color="white" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%', overflow: 'hidden', textAlign: 'center' }}>
                In-house archival research team for citizenship cases
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