import { Box, Button, Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton, onBack }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

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
      {/* Contact Us button on the left */}
      <Box sx={{ position: 'absolute', left: showBackButton ? 120 : 24, top: 0, height: '100%', display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<PhoneIcon />}
          onClick={handleContactClick}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 16,
            px: 2.5,
            py: 1,
            borderColor: '#0d2346',
            color: '#0d2346',
            background: 'rgba(13,35,70,0.07)',
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              background: 'rgba(6,20,42,0.15)',
              borderColor: '#06142a',
              color: '#06142a',
            },
          }}
        >
          Contact Us
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <MenuItem onClick={handleClose} component="a" href="tel:023810013">
            Jerusalem Office: 02-3810013
          </MenuItem>
          <MenuItem onClick={handleClose} component="a" href="tel:033724722">
            Tel Aviv Office: 03-3724722
          </MenuItem>
        </Menu>
      </Box>
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
      <Box
        sx={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          gap: 2,
        }}
      >
        <a href="https://www.facebook.com/DeckerPexCo" target="_blank" rel="noopener noreferrer" style={{ color: '#0d2346', display: 'flex', alignItems: 'center' }}>
          <FacebookIcon sx={{ color: '#0d2346', fontSize: 28, transition: 'color 0.2s', '&:hover': { color: '#06142a' } }} />
        </a>
        <a href="https://www.youtube.com/@DeckerPexLawoffice" target="_blank" rel="noopener noreferrer" style={{ color: '#0d2346', display: 'flex', alignItems: 'center' }}>
          <YouTubeIcon sx={{ color: '#0d2346', fontSize: 28, transition: 'color 0.2s', '&:hover': { color: '#06142a' } }} />
        </a>
        <a href="https://www.linkedin.com/company/decker-pex-co/" target="_blank" rel="noopener noreferrer" style={{ color: '#0d2346', display: 'flex', alignItems: 'center' }}>
          <LinkedInIcon sx={{ color: '#0d2346', fontSize: 28, transition: 'color 0.2s', '&:hover': { color: '#06142a' } }} />
        </a>
        <a href="https://lawoffice.org.il/en/" target="_blank" rel="noopener noreferrer" style={{ color: '#0d2346', display: 'flex', alignItems: 'center' }}>
          <PublicIcon sx={{ color: '#0d2346', fontSize: 28, transition: 'color 0.2s', '&:hover': { color: '#06142a' } }} />
        </a>
      </Box>
    </Box>
  );
};

export default Header; 