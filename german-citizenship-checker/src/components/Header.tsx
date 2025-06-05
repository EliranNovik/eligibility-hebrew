import { Box, Button, Menu, MenuItem, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton, onBack }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isIntro = location.pathname === '/intro';

  const handleContactClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Hamburger menu handlers
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
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
      {/* Logo: always centered on Intro, left on mobile homepage, centered otherwise */}
      <Box
        sx={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
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
      {/* Hamburger menu for mobile */}
      <Box
        sx={{
          position: 'absolute',
          right: 16,
          top: 0,
          height: '100%',
          display: { xs: 'flex', sm: 'none' },
          alignItems: 'center',
        }}
      >
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleMobileMenuOpen}
          sx={{ color: '#232946' }}
        >
          <MenuIcon sx={{ fontSize: 32 }} />
        </IconButton>
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/about'); }}>About Us</MenuItem>
          <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/archival-research'); }}>Archival Research</MenuItem>
        </Menu>
      </Box>
      {/* Social icons and nav on right (hidden on mobile except homepage) */}
      <Box
        sx={{
          position: 'absolute',
          right: 24,
          top: 0,
          height: '100%',
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
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