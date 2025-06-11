import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import PrintIcon from '@mui/icons-material/Print';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, useTheme, useMediaQuery } from '@mui/material';

interface FooterProps {
  showContactButtons?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showContactButtons }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <footer
      style={{
        width: '100%',
        color: '#fff',
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        display: 'flex',
        justifyContent: 'center',
        background: 'none',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          borderRadius: 0,
        }}
      >
        {showContactButtons && (
          <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            mb: 4,
            mt: 2,
            flexWrap: 'wrap',
          }}>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(90deg, #25D366 0%, #128C7E 100%)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #128C7E 0%, #25D366 100%)',
                  },
                  mb: { xs: 2, sm: 0 },
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 32 }} />
              </Box>
            </a>
            <a
              href="tel:+972503489649"
              style={{ textDecoration: 'none' }}
            >
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
                  },
                  mb: { xs: 2, sm: 0 },
                }}
              >
                <PhoneIcon sx={{ fontSize: 32 }} />
              </Box>
            </a>
          </Box>
        )}
        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: { xs: 3, sm: 6 },
            mb: 2,
          }}
        >
          {/* Tel Aviv Section */}
          <Box sx={{ mb: { xs: 2, sm: 0 }, textAlign: { xs: 'center', sm: 'left' }, color: '#fff' }}>
            <h3 style={{ marginBottom: 8, color: '#fff' }}>Tel Aviv Office</h3>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, color: '#fff' }}>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, justifyContent: { xs: 'center', sm: 'flex-start' }, color: '#fff' }}>
              <LocationOnIcon sx={{ color: '#fff', fontSize: 20 }} /> Derech Menachem Begin 150
            </Box>
          </Box>

          {/* Logo and Social Icons - Middle */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
            <Box sx={{ mb: 1 }}>
              <img src="/DPLOGO1.png" alt="DP | DECKER PEX LEVI Logo" style={{ height: 80, maxWidth: '100%'}} />
            </Box>
            {/* BDI and DUNS Images */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
            </Box>
          </Box>

          {/* Jerusalem Section */}
          <Box sx={{ mb: { xs: 2, sm: 0 }, textAlign: { xs: 'center', sm: 'right' }, color: '#fff' }}>
            <h3 style={{ marginBottom: 8, color: '#fff' }}>Jerusalem Office</h3>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-end' }, color: '#fff' }}>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, justifyContent: { xs: 'center', sm: 'flex-end' }, color: '#fff' }}>
              <LocationOnIcon sx={{ color: '#fff', fontSize: 20 }} /> Yad Harutsim St 10
            </Box>
          </Box>
        </Box>
        {/* Copyright at the bottom, centered */}
        <Box sx={{ width: '100%', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, mt: 2, mb: 1 }}>
      © Decker, Pex, Levi 2025. All rights reserved.
        </Box>
      </Box>
    </footer>
  );
};

export default Footer; 