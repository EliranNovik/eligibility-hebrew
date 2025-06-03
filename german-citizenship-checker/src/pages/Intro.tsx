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
          opacity: 0.4,
          zIndex: 0,
        }
      }}>
        {/* Floating WhatsApp Button */}
        <Box
          sx={{
            position: 'fixed',
            top: { xs: 'unset', sm: '50%' },
            bottom: { xs: 24, sm: 'unset' },
            right: 24,
            zIndex: 2000,
            transform: { xs: 'none', sm: 'translateY(-50%)' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* WhatsApp Button */}
          <Box
            component="a"
            href="https://wa.me/1234567890" // Replace with your WhatsApp number
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: '#25D366',
              boxShadow: '0 4px 16px 0 rgba(0,0,0,0.18)',
              transition: 'all 0.2s',
              position: 'relative',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#128C7E',
              },
              '&:hover .wa-tooltip': {
                opacity: 1,
                transform: 'translateY(-50%) scale(1)',
              },
            }}
          >
            <WhatsAppIcon sx={{ color: '#fff', fontSize: 32 }} />
            <Box
              className="wa-tooltip"
              sx={{
                position: 'absolute',
                right: 70,
                top: '50%',
                transform: 'translateY(-50%) scale(0.95)',
                bgcolor: '#232946',
                color: '#fff',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontSize: 15,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                boxShadow: 3,
                opacity: 0,
                pointerEvents: 'none',
                transition: 'all 0.18s',
              }}
            >
              Contact us on WhatsApp
            </Box>
          </Box>
          {/* Contact Us Phone Button */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: '#646cff',
              boxShadow: '0 4px 16px 0 rgba(0,0,0,0.18)',
              transition: 'all 0.2s',
              position: 'relative',
              cursor: 'pointer',
              mt: 2,
              '&:hover': {
                bgcolor: '#535bf2',
              },
            }}
            tabIndex={0}
            onClick={e => {
              e.stopPropagation();
              setShowPhonePopover((prev) => !prev);
            }}
            onBlur={e => {
              setShowPhonePopover(false);
            }}
          >
            <PhoneIcon sx={{ color: '#fff', fontSize: 32 }} />
            {showPhonePopover && (
              <Box
                sx={{
                  position: 'absolute',
                  right: 70,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.18)',
                  color: '#232946',
                  px: 2.5,
                  py: 2,
                  borderRadius: 3,
                  fontSize: 16,
                  fontWeight: 600,
                  boxShadow: 3,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  minWidth: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  zIndex: 3000,
                }}
                onClick={e => e.stopPropagation()}
              >
                <Box sx={{ fontWeight: 700, mb: 1, color: '#fff', fontSize: 17, textAlign: 'center' }}>Contact Us</Box>
                <a
                  href="tel:+97226500000"
                  onClick={() => setTimeout(() => setShowPhonePopover(false), 400)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                    color: '#232946',
                    fontWeight: 700,
                    fontSize: 17,
                    borderRadius: 8,
                    marginBottom: 8,
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                    padding: '12px 24px',
                    width: '100%',
                    textDecoration: 'none',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    transition: 'none',
                    gap: 12,
                  }}
                >
                  <PhoneIcon style={{ fontSize: 24, marginRight: 8 }} /> Jerusalem: 02-650-0000
                </a>
                <a
                  href="tel:+97237770000"
                  onClick={() => setTimeout(() => setShowPhonePopover(false), 400)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 17,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                    padding: '12px 24px',
                    width: '100%',
                    textDecoration: 'none',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    transition: 'none',
                    gap: 12,
                  }}
                >
                  <PhoneIcon style={{ fontSize: 24, marginRight: 8 }} /> Tel Aviv: 03-777-0000
                </a>
              </Box>
            )}
          </Box>
        </Box>
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
            <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ color: 'white', mb: 8, fontSize: 40 }}>
              Are you eligible for German or Austrian citizenship?
            </Typography>
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
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 4,
                  p: 4,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  scrollSnapAlign: { xs: 'center', md: 'none' },
                  minWidth: { xs: '70vw', md: 'auto' },
                  maxWidth: { xs: 340, md: 'none' },
                  mx: { xs: 1, md: 0 },
                }}>
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 3, 
                    letterSpacing: 1,
                    fontSize: 20,
                    textAlign: 'center'
                  }}>
                    About Decker Pex Levi
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255,255,255,0.92)', 
                    fontWeight: 500, 
                    fontSize: 16,
                    lineHeight: 1.8
                  }}>
                    At Decker Pex Levi Law Offices, we specialize in German and Austrian citizenship law. Our expertise covers cases based on family heritage and historical circumstances, including those where ancestors were not citizens of these countries. We assist clients whose relatives were persecuted, displaced, or affected by past regimes, as well as those with ancestral connections qualifying under current nationality laws.
                  </Typography>
                </Box>

                {/* How it works Section */}
                <Box sx={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 4,
                  p: 4,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  scrollSnapAlign: { xs: 'center', md: 'none' },
                  minWidth: { xs: '70vw', md: 'auto' },
                  maxWidth: { xs: 340, md: 'none' },
                  mx: { xs: 1, md: 0 },
                }}>
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 3, 
                    letterSpacing: 1,
                    fontSize: 20,
                    textAlign: 'center'
                  }}>
                    How it works
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255,255,255,0.92)', 
                    fontWeight: 500, 
                    fontSize: 16,
                    lineHeight: 1.8,
                    mb: 2
                  }}>
                    Our eligibility checker will guide you through a series of simple questions to determine if you may qualify for German or Austrian citizenship. Answer each question as accurately as possible, and you'll receive a personalized eligibility result in minutes.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
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
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255,255,255,0.92)', 
                    fontWeight: 500, 
                    fontSize: 16,
                    lineHeight: 1.8
                  }}>
                    We offer you a free consultation and express archival research to maximize your eligibility in the fastest and simplest way possible.
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
                      {/* Special badge for section 5, now after the button */}
                      {section === '5' && (
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.2,
                            mt: 1,
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
        <Footer />
      </Box>
    </>
  );
};

export default Intro;