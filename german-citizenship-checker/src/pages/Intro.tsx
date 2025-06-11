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
    title: 'Restoration for Nazi Persecution Victims',
    requirements: [
      { text: 'Ancestor held German citizenship before 1933' },
      { text: 'Ancestor was deprived of citizenship during Nazi regime (1933-1945)', subtext: 'Including through collective denaturalization decrees' },
      { text: 'Direct descendant of qualifying ancestor', subtext: 'Child, grandchild, or great-grandchild' },
      { text: 'Documented evidence of persecution', subtext: 'Religious, political, racial or other Nazi persecution' },
      { text: 'No time limit for application', subtext: 'This right to restoration has no expiration date' }
    ]
  },
  '15': {
    title: 'Naturalization for Descendants',
    requirements: [
      { text: 'Ancestor lived in Germany before 1933' },
      { text: 'Ancestor was persecuted during Nazi regime', subtext: 'But was not a German citizen' },
      { text: 'Ancestor had their center of life in Germany', subtext: 'Work, education, or permanent residence' },
      { text: 'Direct descendant relationship', subtext: 'Child, grandchild, or great-grandchild' },
    ]
  },
  '5': {
    title: 'Correction of Historical Discrimination',
    requirements: [
      { text: 'Born before January 1, 1975 to a German mother', subtext: 'And non-German father' },
      { text: 'Born between 1949 and 1993 to a German father', subtext: 'Outside of marriage' },
      { text: 'Mother lost German citizenship through marriage before 1953' },
      { text: 'Child of someone qualifying under these categories' },
      { text: 'Must apply before August 19, 2031', subtext: 'Deadline set by law' }
    ]
  },
  '58c': {
    title: 'Austrian Law for Nazi Victims\' Descendants',
    requirements: [
      { text: 'Ancestor lived in Austria before May 15, 1955' },
      { text: 'Ancestor was persecuted by the Nazi regime', subtext: 'Including Jewish persecution' },
      { text: 'Ancestor fled Austria between 1933-1955' },
      { text: 'Direct descendant of qualifying ancestor', subtext: 'No generational limit' },
      { text: 'No German language requirement' },
      { text: 'Can maintain current citizenship', subtext: 'Dual citizenship allowed' }
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
              START ELIGIBILITY CHECK
            </StyledButton>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ color: 'white', mb: 8, fontSize: 40 }}>
                Are you eligible for German or Austrian citizenship?
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
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 3, 
                    letterSpacing: 1,
                    fontSize: 20,
                    textAlign: 'center',
                    width: '100%'
                  }}>
                    About Decker Pex Levi
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255,255,255,0.92)', 
                    fontWeight: 500, 
                    fontSize: 16,
                    lineHeight: 1.8,
                    maxWidth: '90%',
                    textAlign: 'justify',
                    hyphens: 'auto'
                  }}>
At Decker, Pex, Levi Law Offices, we provide expert legal guidance in the field of German and Austrian citizenship law. Our team specializes in assisting clients with claims based on ancestry, heritage, and historical injustices—including cases where family members were persecuted, displaced, or stripped of their rights under former regimes. Even if your ancestors were not officially recognized as citizens, current nationality laws may still offer a pathway to reclaim citizenship, and we are here to navigate that process with you. <br /><br />
With decades of combined experience and a multilingual, client-centered approach, our firm has become a trusted name in immigration and nationality law. While our leading focus is on German and Austrian citizenship, we also provide legal support in related areas such as Israeli immigration, foreign visas, and dual nationality matters. Whether you're restoring a lost connection to your family's past or planning for a new future abroad, Decker, Pex, Levi is here to help—with professionalism, dedication, and personal care.
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
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 3, 
                    letterSpacing: 1,
                    fontSize: 20,
                    textAlign: 'center',
                    width: '100%'
                  }}>
                    How it works
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255,255,255,0.92)', 
                    fontWeight: 500, 
                    fontSize: 16,
                    lineHeight: 1.8,
                    mb: 2,
                    maxWidth: '90%',
                    textAlign: 'justify',
                    hyphens: 'auto'
                  }}>
Our eligibility checker is a quick and user-friendly tool designed to help you find out if you may qualify for German or Austrian citizenship. Simply answer a short series of straightforward questions based on your family history and personal background. Within minutes, you'll receive a personalized eligibility assessment—no paperwork or legal knowledge required.
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
                        Free Consultation
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
                        Express Archival Research
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 4 }} />
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 2, 
                    letterSpacing: 1,
                    fontSize: 20,
                    textAlign: 'center',
                    width: '100%'
                  }}>
                    What Happens Next?
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255,255,255,0.92)', 
                    fontWeight: 500, 
                    fontSize: 16,
                    lineHeight: 1.8,
                    maxWidth: '90%',
                    textAlign: 'justify',
                    hyphens: 'auto'
                  }}>
Once you complete the checker, you'll have the opportunity to schedule a free consultation with one of our citizenship experts. If your case shows potential, we'll conduct express archival research to gather supporting evidence and give you the clearest path forward. Our goal is to help you unlock your eligibility as efficiently and accurately as possible—with minimal hassle and maximum support.                  </Typography>
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
                      <Typography variant="body2" sx={{ mb: 2 }}>Click to see detailed requirements</Typography>
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