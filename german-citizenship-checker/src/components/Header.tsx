import { Box, Button, Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton, onBack }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleContactClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 64,
        bgcolor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px 0 rgb(255, 255, 255)',
        position: 'relative',
        zIndex: 10,
        margin: 0,
        padding: 0,
        border: 0,
      }}
    >
      
      {showBackButton && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            position: 'absolute',
            left: 16,
            color: '#232946',
            background: 'rgba(35,41,70,0.07)',
            borderRadius: 2,
            px: 2,
            py: 1,
            fontWeight: 600,
            minWidth: 0,
          }}
        >
          Back
        </Button>
      )}
      {/* Logo: left on mobile homepage, centered otherwise */}
      <Box
        sx={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: {
            xs: isHome ? 'flex-start' : 'center',
            sm: 'center',
          },
          position: 'absolute',
          left: { xs: isHome ? 16 : '50%', sm: '50%' },
          transform: {
            xs: isHome ? 'none' : 'translateX(-50%)',
            sm: 'translateX(-50%)',
          },
          width: { xs: isHome ? 'auto' : '100%', sm: '100%' },
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8,
          },
        }}
        onClick={() => navigate('/')}
      >
        <img
          src="/DPL-LOGO.png"
          alt="DPL Logo"
          style={{
            height: 60,
            width: 'auto',
            display: 'block',
            margin: 0,
            padding: 0,
            background: 'transparent',
          }}
        />
      </Box>
      {/* Social icons on the right */}
      <Box
        sx={{
          position: 'absolute',
          right: 24,
          top: 0,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
          // Hide nav items on mobile except on homepage
          ...(isHome
            ? {}
            : { display: { xs: 'none', sm: 'flex' } }),
        }}
      >
        <Button
          onClick={() => navigate('/about')}
          sx={{
            color: '#232946',
            fontWeight: 600,
            fontSize: { xs: 14, sm: 16 },
            textTransform: 'none',
            borderRadius: 2,
            px: { xs: 1.5, sm: 2.5 },
            py: 1,
            background: 'rgba(35,41,70,0.07)',
            '&:hover': {
              background: 'rgba(35,41,70,0.15)',
              color: '#535bf2',
            },
          }}
        >
          About Us
        </Button>
        <Button
          onClick={() => navigate('/archival-research')}
          sx={{
            color: '#232946',
            fontWeight: 600,
            fontSize: { xs: 14, sm: 16 },
            textTransform: 'none',
            borderRadius: 2,
            px: { xs: 1.5, sm: 2.5 },
            py: 1,
            background: 'rgba(35,41,70,0.07)',
            '&:hover': {
              background: 'rgba(35,41,70,0.15)',
              color: '#535bf2',
            },
          }}
        >
          Archival Research
        </Button>
      </Box>
    </Box>
  );
};

export default Header; 