import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import PrintIcon from '@mui/icons-material/Print';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const Footer = () => {
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
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '80%',
          mx: 'auto',
          px: 0,
          py: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.10)',
          borderRadius: { xs: 4, sm: 6 },
        }}
      >
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
              <PhoneIcon sx={{ color: '#fff', fontSize: 20 }} /> 03-3724722
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
              <PhoneIcon sx={{ color: '#fff', fontSize: 20 }} /> 02-3810013
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, justifyContent: { xs: 'center', sm: 'flex-end' }, color: '#fff' }}>
              <LocationOnIcon sx={{ color: '#fff', fontSize: 20 }} /> Yad Harutsim St 10
            </Box>
          </Box>
        </Box>
        {/* Copyright at the bottom, centered */}
        <Box sx={{ width: '100%', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, mt: 2, mb: 1 }}>
          Decker, Pex, Levi 2025. All rights reserved.
        </Box>
      </Box>
    </footer>
  );
};

export default Footer; 