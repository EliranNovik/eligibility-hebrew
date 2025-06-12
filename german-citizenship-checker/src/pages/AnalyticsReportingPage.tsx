import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import QuizIcon from '@mui/icons-material/Quiz';
import LinkIcon from '@mui/icons-material/Link';
import SettingsIcon from '@mui/icons-material/Settings';
import { supabase } from '../lib/supabase';

// Google Analytics stats hook (copied from AdminDashboard)
function useGoogleAnalyticsStats() {
  const [gaStats, setGaStats] = React.useState({
    pageViews: 0,
    users: 0,
    sessions: 0,
    bounceRate: 0,
  });

  React.useEffect(() => {
    async function fetchGAStats() {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startDate: formattedStartDate, endDate: formattedEndDate }),
        });
        if (!response.ok) throw new Error('Failed to fetch analytics data');
        const data = await response.json();
        setGaStats({
          pageViews: data.pageViews || 0,
          users: data.users || 0,
          sessions: data.sessions || 0,
          bounceRate: data.bounceRate || 0,
        });
      } catch (error) {
        setGaStats({ pageViews: 0, users: 0, sessions: 0, bounceRate: 0 });
      }
    }
    fetchGAStats();
  }, []);
  return gaStats;
}

const navItems = [
  { label: 'Admins', icon: <GroupIcon />, path: '/admin/admins' },
  { label: 'Leads', icon: <AssignmentIndIcon />, path: '/admin/leads' },
  { label: 'Question & Flow Management', icon: <QuizIcon />, path: '/admin/questions' },
  { label: 'Integration & Webhooks', icon: <LinkIcon />, path: '/admin/integrations' },
  { label: 'Analytics & Reporting', icon: <BarChartIcon />, path: '/admin/analytics' },
  { label: 'System Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

const drawerWidth = 72;
const sidebarBg = 'rgba(20, 24, 40, 0.95)';
const sidebarStyle = {
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  background: sidebarBg,
  borderRight: '1.5px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  transition: 'width 0.2s',
  overflowX: 'hidden',
  zIndex: 1200,
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  pt: 2,
};

const AnalyticsReportingPage = () => {
  const gaStats = useGoogleAnalyticsStats();
  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', mt: 2, p: { xs: 2, md: 4 }, borderRadius: 4, background: 'rgba(255,255,255,0.08)', boxShadow: '0 4px 24px 0 rgba(100,108,255,0.10)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
      <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 4 }}>
        Analytics & Reporting
      </Typography>
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)', color: '#fff', textAlign: 'center', boxShadow: '0 2px 12px 0 rgba(100,108,255,0.10)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Page Views</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{gaStats.pageViews}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', color: '#232946', textAlign: 'center', boxShadow: '0 2px 12px 0 rgba(67,233,123,0.10)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Users</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{gaStats.users}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(90deg, #ffb300 0%, #ff5e62 100%)', color: '#232946', textAlign: 'center', boxShadow: '0 2px 12px 0 rgba(255,94,98,0.10)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Sessions</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{gaStats.sessions}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(90deg, #232946 0%, #535bf2 100%)', color: '#fff', textAlign: 'center', boxShadow: '0 2px 12px 0 rgba(35,41,70,0.10)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Bounce Rate</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{gaStats.bounceRate}%</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsReportingPage; 