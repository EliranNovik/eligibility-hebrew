import { Box, Button, Menu, MenuItem, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';

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
  const { goBack } = useNavigation();

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
        background: 'rgba(255,255,255,0.25)',
        border: '1px solid rgba(255,255,255,0.18)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        margin: 0,
        padding: 0,
      }}
    >
      {showBackButton && (
        <Button
          onClick={onBack ? onBack : goBack}
          sx={{
            position: 'absolute',
            left: 16,
            color: 'white',
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
          src="/DPLOGO1.png"
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
          sx={{ color: '#fff' }}
        >
          {Boolean(mobileMenuAnchor) ? (
            <CloseIcon sx={{ fontSize: 32 }} />
          ) : (
            <MenuIcon sx={{ fontSize: 32 }} />
          )}
        </IconButton>
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              background: 'linear-gradient(90deg, #646cff, #535bf2)',
              color: 'white',
              mt: 1,
              minWidth: 200,
              '& .MuiMenuItem-root': {
                color: 'white',
                fontSize: '1.1rem',
                padding: '12px 24px',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              },
            },
          }}
        >
          <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/about'); }}>About Us</MenuItem>
          <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/archival-research'); }}>Archival Research</MenuItem>
          <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/admin'); }}>Admin</MenuItem>
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
            background: 'linear-gradient(90deg, #646cff, #535bf2)',
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: 14, sm: 16 },
            textTransform: 'none',
            borderRadius: 3,
            px: { xs: 2, sm: 3 },
            py: 1,
            boxShadow: '0 2px 8px 0 rgba(100,108,255,0.10)',
            transition: 'all 0.2s',
            '&:hover': {
              background: 'linear-gradient(90deg, #535bf2, #646cff)',
              color: 'white',
            },
          }}
        >
          About Us
        </Button>
        <Button
          onClick={() => navigate('/archival-research')}
          sx={{
            background: 'linear-gradient(90deg, #646cff, #535bf2)',
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: 14, sm: 16 },
            textTransform: 'none',
            borderRadius: 3,
            px: { xs: 2, sm: 3 },
            py: 1,
            boxShadow: '0 2px 8px 0 rgba(100,108,255,0.10)',
            transition: 'all 0.2s',
            '&:hover': {
              background: 'linear-gradient(90deg, #535bf2, #646cff)',
              color: 'white',
            },
          }}
        >
          Archival Research
        </Button>
        <Button
          onClick={() => navigate('/admin')}
          sx={{
            background: 'linear-gradient(90deg, #646cff, #535bf2)',
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: 14, sm: 16 },
            textTransform: 'none',
            borderRadius: 3,
            px: { xs: 2, sm: 3 },
            py: 1,
            boxShadow: '0 2px 8px 0 rgba(100,108,255,0.10)',
            transition: 'all 0.2s',
            '&:hover': {
              background: 'linear-gradient(90deg, #535bf2, #646cff)',
              color: 'white',
            },
          }}
        >
          Admin
        </Button>
      </Box>
    </Box>
  );
};

export default Header; 