import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import PrintIcon from '@mui/icons-material/Print';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => (
  <footer
    style={{
      width: '100%',
      background: '#232946',
      color: '#fff',
      paddingTop: 32,
    }}
  >
    <div style={{ width: '100%', height: 4, background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)', borderRadius: 2, marginBottom: 24 }} />
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        maxWidth: 1200,
        margin: '0 auto',
        gap: 40,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <h3 style={{ marginBottom: 8 }}>Tel Aviv</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PhoneIcon sx={{ color: '#fff', fontSize: 20 }} /> 03-3724722
          <PrintIcon sx={{ color: '#fff', fontSize: 20, ml: 2 }} /> 0774702790
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <LocationOnIcon sx={{ color: '#fff', fontSize: 20 }} /> Derech Menachem Begin 150
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: 8 }}>Jerusalem</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PhoneIcon sx={{ color: '#fff', fontSize: 20 }} /> 02-3810013
          <PrintIcon sx={{ color: '#fff', fontSize: 20, ml: 2 }} /> 02-6447602
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <LocationOnIcon sx={{ color: '#fff', fontSize: 20 }} /> Yad Harutsim St 10
        </div>
      </div>
    </div>
    <div
      style={{
        marginTop: 32,
        textAlign: 'center',
        borderTop: 'none',
        paddingTop: 24,
        paddingBottom: 16,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <img src="/DPLOGO1.png" alt="DP | DECKER PEX LEVI Logo" style={{ height: 48, display: 'block', margin: '0 auto' }} />
      </div>
      <div style={{ fontSize: 24, display: 'flex', justifyContent: 'center', gap: 24 }}>
        <a href="https://www.facebook.com/DeckerPexCo" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
          <FacebookIcon sx={{ color: '#fff', fontSize: 32 }} />
        </a>
        <a href="https://www.youtube.com/@DeckerPexLawoffice" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
          <YouTubeIcon sx={{ color: '#fff', fontSize: 32 }} />
        </a>
        <a href="https://www.linkedin.com/company/decker-pex-co/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
          <LinkedInIcon sx={{ color: '#fff', fontSize: 32 }} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer; 