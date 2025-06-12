import { useState, useEffect } from 'react';
import { useNavigate, Outlet, Routes, Route } from 'react-router-dom';
import { Box, Container, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, IconButton, TextField, MenuItem, Grid, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, ListItemButton } from '@mui/material';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from 'recharts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import MuiPaper from '@mui/material/Paper';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as XLSX from 'xlsx';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import QuizIcon from '@mui/icons-material/Quiz';
import LinkIcon from '@mui/icons-material/Link';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminsPage from './AdminsPage';
import LeadsPage from './LeadsPage';
import QuestionFlowManagementPage from './QuestionFlowManagementPage';
import IntegrationWebhooksPage from './IntegrationWebhooksPage';
import AnalyticsReportingPage from './AnalyticsReportingPage';
import SystemSettingsPage from './SystemSettingsPage';
import AdminHomePage from './AdminHomePage';

function useEligibilityStats() {
  const [stats, setStats] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from('eligibility_results')
        .select('eligible_section');

      if (error) {
        console.error('Error fetching stats:', error);
        return;
      }

      const counts: { [key: string]: number } = {};
      data.forEach((row: { eligible_section: string }) => {
        counts[row.eligible_section] = (counts[row.eligible_section] || 0) + 1;
      });
      setStats(counts);
    }
    fetchStats();
  }, []);

  return stats;
}

function useContactSubmissionStats() {
  const [counts, setCounts] = useState({
    total: 0,
    positive: 0,
    negative: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      // Total count
      const { count: total, error: totalError } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true });
      // Positive count
      const { count: positive, error: posError } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('form_type', 'positive');
      // Negative count
      const { count: negative, error: negError } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('form_type', 'negative');
      if (!totalError && !posError && !negError) {
        setCounts({
          total: total || 0,
          positive: positive || 0,
          negative: negative || 0,
        });
      }
    }
    fetchCounts();
  }, []);

  return counts;
}

// Add new hook for Google Analytics stats
function useGoogleAnalyticsStats() {
  const [gaStats, setGaStats] = useState({
    pageViews: 0,
    users: 0,
    sessions: 0,
    bounceRate: 0,
  });

  useEffect(() => {
    async function fetchGAStats() {
      try {
        // Get the current date and 30 days ago
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        // Format dates for GA4 API
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        // Make API request to your backend endpoint that will fetch GA4 data
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const data = await response.json();
        
        setGaStats({
          pageViews: data.pageViews || 0,
          users: data.users || 0,
          sessions: data.sessions || 0,
          bounceRate: data.bounceRate || 0,
        });
      } catch (error) {
        console.error('Error fetching Google Analytics data:', error);
        // Fallback to showing 0s if there's an error
        setGaStats({
          pageViews: 0,
          users: 0,
          sessions: 0,
          bounceRate: 0,
        });
      }
    }

    fetchGAStats();
  }, []);

  return gaStats;
}

const ELIGIBILITY_COLORS = ['#646cff', '#43e97b', '#ffb300', '#ff5e62'];
const CONTACT_COLORS = ['#535bf2', '#43e97b', '#ff5e62'];

// Custom label for donut chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontWeight={700}
      fontSize={18}
      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.18)' }}
    >
      {percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
    </text>
  );
};

const AdminDashboard = () => {
  const stats = useEligibilityStats();
  const contactFormCounts = useContactSubmissionStats();
  const gaStats = useGoogleAnalyticsStats();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [eligibilityResults, setEligibilityResults] = useState<any[]>([]);
  const [formTypeFilter, setFormTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = useNavigate();
  const navItems = [
    { label: 'Dashboard', icon: <HomeIcon />, path: '/admin' },
    { label: 'Admins', icon: <GroupIcon />, path: '/admin/admins' },
    { label: 'Leads', icon: <AssignmentIndIcon />, path: '/admin/leads' },
    { label: 'Question & Flow Management', icon: <QuizIcon />, path: '/admin/questions' },
    { label: 'Integration & Webhooks', icon: <LinkIcon />, path: '/admin/integrations' },
    { label: 'Analytics & Reporting', icon: <BarChartIcon />, path: '/admin/analytics' },
    { label: 'System Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchSubmissions() {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setSubmissions(data);
    }
    fetchSubmissions();
    async function fetchEligibilityResults() {
      const { data, error } = await supabase
        .from('eligibility_results')
        .select('*');
      if (!error && data) setEligibilityResults(data);
    }
    fetchEligibilityResults();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Header />
        <Box sx={{ 
          minHeight: '100vh', 
          width: '100vw', 
          bgcolor: 'transparent',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
        }}>
          <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, mt: 8 }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(13, 27, 62, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%)',
                backdropFilter: 'blur(10px)',
                '& input': { color: '#fff !important' },
                '& label': { color: '#fff !important' },
                '& .MuiInputLabel-root': { color: '#fff !important' },
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3) !important' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5) !important' },
                  '&.Mui-focused fieldset': { borderColor: '#646cff !important' }
                },
                '& .MuiInputBase-input': { color: '#fff !important' },
                '& .MuiFormLabel-root': { color: '#fff !important' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#646cff !important' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3) !important' },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5) !important' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#646cff !important' },
                '& .MuiButton-contained': {
                  background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
                  }
                }
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#fff', 
                  textAlign: 'center', 
                  mb: 3, 
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                Admin Access Only
              </Typography>
              <Auth
                supabaseClient={supabase}
                appearance={{ 
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#646cff',
                        brandAccent: '#535bf2',
                      },
                    },
                  },
                }}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'Email',
                      password_label: 'Password',
                    },
                  },
                }}
                providers={[]}
                redirectTo={window.location.origin + '/admin'}
              />
            </Paper>
          </Container>
        </Box>
      </>
    );
  }

  // Prepare data for charts
  const eligibilityData = [
    { section: '§116', count: stats['§116'] || 0 },
    { section: '§15', count: stats['§15'] || 0 },
    { section: '§5', count: stats['§5'] || 0 },
    { section: '§58c', count: stats['§58c'] || 0 },
  ];
  const contactData = [
    { name: 'Positive', value: contactFormCounts.positive },
    { name: 'Negative', value: contactFormCounts.negative },
  ];

  // Filtered submissions
  const filteredSubmissions = submissions.filter(row => {
    // Filter by form type
    if (formTypeFilter !== 'all' && row.form_type !== formTypeFilter) return false;
    // Filter by date
    if (dateFrom && new Date(row.created_at) < dateFrom) return false;
    if (dateTo && new Date(row.created_at) > dateTo) return false;
    // Filter by search
    const searchLower = search.toLowerCase();
    if (searchLower) {
      const name = row.user_data?.fullName?.toLowerCase() || '';
      const email = row.user_data?.email?.toLowerCase() || '';
      const phone = row.user_data?.phone?.toLowerCase() || '';
      if (!name.includes(searchLower) && !email.includes(searchLower) && !phone.includes(searchLower)) return false;
    }
    return true;
  });

  // Helper: get eligibility section(s) for a submission by email
  const getEligibilitySectionByEmail = (email: string) => {
    if (!email) return '';
    // Find the most recent eligibility result for this email
    const matches = eligibilityResults
      .filter((r: any) => r.user_data && r.user_data.email && r.user_data.email.toLowerCase() === email.toLowerCase());
    if (!matches.length) return '';
    // Sort by created_at descending
    matches.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    // Return eligible_section (could be array or string)
    const section = matches[0].eligible_section;
    if (Array.isArray(section)) return section.join(', ');
    return section || '';
  };

  // Export to Excel handler
  const handleExportExcel = () => {
    // Prepare data for export
    const exportData = filteredSubmissions.map(row => ({
      Date: row.created_at ? new Date(row.created_at).toLocaleString() : '',
      Name: row.user_data?.fullName || '',
      Email: row.user_data?.email || '',
      Phone: row.user_data?.phone || '',
      'Form Type': row.form_type,
      'Eligibility Paragraph': getEligibilitySectionByEmail(row.user_data?.email),
      ...Object.fromEntries(
        Object.entries(row.user_data || {})
          .filter(([k]) => !['fullName', 'email', 'phone', 'eligibleSections'].includes(k))
      )
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contact Submissions');
    XLSX.writeFile(workbook, 'contact_submissions.xlsx');
  };

  // Side navbar
  const drawerWidth = sidebarOpen ? 280 : 72;
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
    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
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

  const headerBar = (
    <Box sx={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      px: 4,
      height: 56,
      background: '#181b2c',
      position: 'relative',
      zIndex: 1100,
      boxShadow: '0 2px 8px rgba(20,24,40,0.10)'
    }}>
      <Button
        variant="contained"
        onClick={handleSignOut}
        sx={{
          background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 16,
          borderRadius: 3,
          px: 3,
          py: 1.2,
          boxShadow: '0 2px 8px rgba(100,108,255,0.10)',
          '&:hover': {
            background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
            color: '#fff',
          },
        }}
      >
        Sign Out
      </Button>
    </Box>
  );

  // Main layout
  return (
    <>
      <Header />
      {headerBar}
      <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#181b2c', display: 'flex', flexDirection: 'column' }}>
        {/* Sidebar under header */}
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <Box
            sx={{
              ...sidebarStyle,
              position: 'relative',
              top: 0,
              left: 0,
              height: '100%',
              zIndex: 1200,
            }}
            onMouseEnter={() => setSidebarOpen(true)}
            onMouseLeave={() => setSidebarOpen(false)}
          >
            <List sx={{ width: '100%', pt: 0 }}>
              {navItems.map((item, idx) => (
                <Tooltip key={item.label} title={sidebarOpen ? '' : item.label} placement="right" arrow>
                  <ListItem disablePadding sx={{ width: '100%' }}>
                    <ListItemButton
                      onClick={() => nav(item.path)}
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        mb: 1,
                        color: '#fff',
                        background: 'none',
                        '&:hover': {
                          background: 'rgba(100,108,255,0.08)',
                        },
                        transition: 'background 0.2s',
                      }}
                    >
                      <ListItemIcon sx={{ color: '#646cff', minWidth: 0, mr: sidebarOpen ? 2 : 'auto', justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                      {sidebarOpen && <ListItemText primary={item.label} sx={{ color: '#fff', fontWeight: 600, fontSize: 18 }} />}
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              ))}
            </List>
          </Box>
          {/* Main content area */}
          <Box sx={{ flex: 1, p: { xs: 1, md: 4 }, minHeight: '100vh', background: '#181b2c', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 1200, mt: 4, mb: 2, p: 0 }}>
              <Routes>
                <Route path="" element={<AdminHomePage 
                  stats={stats}
                  contactFormCounts={contactFormCounts}
                  gaStats={gaStats}
                  filteredSubmissions={filteredSubmissions}
                  handleExportExcel={handleExportExcel}
                  formTypeFilter={formTypeFilter}
                  setFormTypeFilter={setFormTypeFilter}
                  dateFrom={dateFrom}
                  setDateFrom={setDateFrom}
                  dateTo={dateTo}
                  setDateTo={setDateTo}
                  search={search}
                  setSearch={setSearch}
                  getEligibilitySectionByEmail={getEligibilitySectionByEmail}
                />} />
                <Route path="admins" element={<AdminsPage />} />
                <Route path="leads" element={<LeadsPage 
                  filteredSubmissions={filteredSubmissions}
                  handleExportExcel={handleExportExcel}
                  formTypeFilter={formTypeFilter}
                  setFormTypeFilter={setFormTypeFilter}
                  dateFrom={dateFrom}
                  setDateFrom={setDateFrom}
                  dateTo={dateTo}
                  setDateTo={setDateTo}
                  search={search}
                  setSearch={setSearch}
                  getEligibilitySectionByEmail={getEligibilitySectionByEmail}
                />} />
                <Route path="questions" element={<QuestionFlowManagementPage />} />
                <Route path="integrations" element={<IntegrationWebhooksPage />} />
                <Route path="analytics" element={<AnalyticsReportingPage />} />
                <Route path="settings" element={<SystemSettingsPage />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard; 