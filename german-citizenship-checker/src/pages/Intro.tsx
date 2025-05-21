import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Container, styled } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import LawRequirements from '../components/LawRequirements';
import { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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

  const handleSectionClick = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      <Header />
      <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#232946', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', pt: 8 }}>
        <Box sx={{ mt: 0, width: '100%', maxWidth: 1200, px: { xs: 2, md: 4 } }}>
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
            <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ color: 'white', mb: 8, fontSize: 40 }}>
              Are you eligible for German or Austrian citizenship?
            </Typography>
            <Paper elevation={0} sx={{
              background: 'rgba(255,255,255,0.04)',
              border: '2px solid',
              borderImage: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%) 1',
              borderRadius: 4,
              px: { xs: 2, md: 6 },
              py: { xs: 3, md: 4 },
              mb: 6,
              maxWidth: 700,
              mx: 'auto',
              boxShadow: 3,
              textAlign: 'center',
            }}>
              <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 700, mb: 1, letterSpacing: 1 }}>
                How does it work?
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.92)', fontWeight: 500, mb: 2, fontSize: 18 }}>
                Our eligibility checker will guide you <span style={{ color: '#21cbf3', fontWeight: 700 }}>step-by-step</span> through a series of questions to determine if you may qualify for German or Austrian citizenship under the relevant legal sections. Simply answer each question as accurately as possible, and you'll receive a <span style={{ color: '#21cbf3', fontWeight: 700 }}>personalized eligibility result</span> in minutes.
              </Typography>
              <Typography variant="body1" sx={{ color: '#21cbf3', fontWeight: 600, mb: 2, fontSize: 17 }}>
                All questions are simple <span style={{ color: '#43e97b', fontWeight: 700 }}>Yes</span> or <span style={{ color: '#43e97b', fontWeight: 700 }}>No</span> choices—no complicated forms!
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.87)', fontWeight: 400, fontSize: 17 }}>
                <span style={{ color: '#43e97b', fontWeight: 700 }}>Decker Pex Levi</span> offers you a <span style={{ color: '#43e97b', fontWeight: 700 }}>free consultation</span> and <span style={{ color: '#43e97b', fontWeight: 700 }}>express archival research</span> to maximize your eligibility in the <span style={{ color: '#21cbf3', fontWeight: 700 }}>fastest</span> and <span style={{ color: '#21cbf3', fontWeight: 700 }}>simplest</span> way possible.
              </Typography>
            </Paper>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                mb: 8,
                px: { xs: 0, md: 0 },
              }}
            >
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
                <ChevronLeftIcon sx={{ color: '#2196f3', fontSize: 32, opacity: 0.7 }} />
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
                <ChevronRightIcon sx={{ color: '#2196f3', fontSize: 32, opacity: 0.7 }} />
              </Box>
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
                  <Box key={section} sx={{ scrollSnapAlign: { xs: 'center', sm: 'none' }, animation: { xs: `fadeInBox 0.7s ${idx * 0.1}s both`, sm: 'none' } }}>
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
                        mx: { xs: 1, sm: 0 },
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
                      {/* Special badge for section 5, now inside the box */}
                      {section === '5' && (
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.2,
                            mb: 1,
                            bgcolor: 'rgba(33,203,243,0.92)',
                            color: '#232946',
                            fontWeight: 700,
                            fontSize: 10,
                            borderRadius: 1.5,
                            boxShadow: 1,
                            letterSpacing: 0.5,
                            textTransform: 'uppercase',
                            border: '1px solid #43e97b',
                            pointerEvents: 'none',
                          }}
                        >
                          Valid until Aug 2031
                        </Box>
                      )}
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>§{section}</Typography>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{data.title}</Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>Click to see detailed requirements</Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: 'rgba(35,41,70,0.3)',
                          color: '#fff',
                          '&:hover': {
                            bgcolor: 'rgba(35,41,70,0.5)',
                          },
                        }}
                      >
                        See More
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
            `}</style>
          </motion.div>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Intro; 