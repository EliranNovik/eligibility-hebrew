import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, IconButton, TextField, MenuItem, Grid } from '@mui/material';
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
                '& a[href*="sign-up"]': { display: 'none !important' },
                '& a[href*="signup"]': { display: 'none !important' },
                '& a[href*="sign_up"]': { display: 'none !important' },
                '& a[href*="recover"]': { display: 'none !important' },
                '& a[href*="forgot"]': { display: 'none !important' },
                '& a[href*="reset"]': { display: 'none !important' },
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
                view="sign_in"
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
        justifyContent: 'flex-start',
        position: 'relative',
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, mt: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
              Admin Dashboard
            </Typography>
            <Button
              variant="contained"
              onClick={handleSignOut}
              sx={{
                background: 'linear-gradient(90deg, #646cff, #535bf2)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(90deg, #535bf2, #646cff)',
                },
              }}
            >
              Sign Out
            </Button>
          </Box>
          
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(13, 27, 62, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.10)',
              mb: 4
            }}
          >
            <Typography variant="h6" gutterBottom>
            </Typography>
            <Box sx={{ mb: 8 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#fff', textAlign: 'center', mx: 'auto' }}>
                Eligibility Stats
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={eligibilityData} style={{ fontFamily: 'inherit' }}>
                  <XAxis dataKey="section" stroke="#fff" style={{ fontWeight: 600, fill: '#fff' }} tick={{ fill: '#fff', fontWeight: 600 }} />
                  <YAxis stroke="#fff" allowDecimals={false} tick={{ fill: '#fff', fontWeight: 600 }} />
                  <RechartsTooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {eligibilityData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={ELIGIBILITY_COLORS[idx % ELIGIBILITY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#fff', textAlign: 'center', mx: 'auto' }}>
                Contact Form Submissions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap', mb: 2, justifyContent: 'center' }}>
                {(() => {
                  const total = contactFormCounts.positive + contactFormCounts.negative;
                  const posPercent = total > 0 ? Math.round((contactFormCounts.positive / total) * 100) : 0;
                  const negPercent = total > 0 ? Math.round((contactFormCounts.negative / total) * 100) : 0;
                  return <>
                    <Box sx={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 1,
                      px: { xs: 4, sm: 7 }, py: { xs: 4, sm: 7 },
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #535bf2 0%, #43e97b 100%)',
                      color: 'white', fontWeight: 700, fontSize: 36, boxShadow: 4, minWidth: 200, minHeight: 160,
                      textAlign: 'center', position: 'relative',
                    }}>
                      <CheckCircleIcon sx={{ color: '#43e97b', fontSize: 48, mb: 1 }} />
                      {contactFormCounts.positive}
                      <Typography sx={{ fontSize: 22, fontWeight: 500, mt: 1, color: '#fff' }}>Positive</Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#4fc3f7', mt: 0.5 }}>{posPercent}%</Typography>
                    </Box>
                    <Box sx={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 1,
                      px: { xs: 4, sm: 7 }, py: { xs: 4, sm: 7 },
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #535bf2 0%, #ff5e62 100%)',
                      color: 'white', fontWeight: 700, fontSize: 36, boxShadow: 4, minWidth: 200, minHeight: 160,
                      textAlign: 'center', position: 'relative',
                    }}>
                      <CancelIcon sx={{ color: '#ff5e62', fontSize: 48, mb: 1 }} />
                      {contactFormCounts.negative}
                      <Typography sx={{ fontSize: 22, fontWeight: 500, mt: 1, color: '#fff' }}>Negative</Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#4fc3f7', mt: 0.5 }}>{negPercent}%</Typography>
                    </Box>
                  </>;
                })()}
              </Box>
            </Box>

            {/* Google Analytics Stats */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#fff', textAlign: 'center', mx: 'auto' }}>
                Google Analytics Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3, flexWrap: 'wrap', mb: 2, justifyContent: 'center' }}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)', minWidth: 200, flex: 1 }}>
                  <Typography variant="h6">Page Views</Typography>
                  <Typography variant="h4">{gaStats.pageViews.toLocaleString()}</Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)', minWidth: 200, flex: 1 }}>
                  <Typography variant="h6">Users</Typography>
                  <Typography variant="h4">{gaStats.users.toLocaleString()}</Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)', minWidth: 200, flex: 1 }}>
                  <Typography variant="h6">Sessions</Typography>
                  <Typography variant="h4">{gaStats.sessions.toLocaleString()}</Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)', minWidth: 200, flex: 1 }}>
                  <Typography variant="h6">Bounce Rate</Typography>
                  <Typography variant="h4">{gaStats.bounceRate}%</Typography>
                </Paper>
              </Box>
            </Box>
          </Paper>

          {/* Contact Submissions Table */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(13, 27, 62, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.10)',
              mb: 4,
              mt: 4
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
              Contact Form Submissions (All)
            </Typography>
            {/* Filters */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center', justifyContent: 'center' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={null}
                  value={dateFrom}
                  onChange={setDateFrom}
                  slotProps={{ textField: { size: 'small', sx: { bgcolor: '#f5f5f5', borderRadius: 2, minWidth: 90 }, placeholder: 'From', InputLabelProps: { shrink: false } } }}
                />
                <DatePicker
                  label={null}
                  value={dateTo}
                  onChange={setDateTo}
                  slotProps={{ textField: { size: 'small', sx: { bgcolor: '#f5f5f5', borderRadius: 2, minWidth: 90 }, placeholder: 'To', InputLabelProps: { shrink: false } } }}
                />
              </LocalizationProvider>
              <TextField
                select
                size="small"
                label={null}
                placeholder="Form Type"
                value={formTypeFilter}
                onChange={e => setFormTypeFilter(e.target.value)}
                sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 120 }}
                InputLabelProps={{ shrink: false }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="positive">Positive</MenuItem>
                <MenuItem value="negative">Negative</MenuItem>
              </TextField>
              <TextField
                size="small"
                label={null}
                placeholder="Search Name, Email, Phone"
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 300 }}
                InputLabelProps={{ shrink: false }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleExportExcel}
                sx={{
                  fontWeight: 700,
                  fontSize: 15,
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(100,108,255,0.10)',
                  px: 3,
                  py: 1.2,
                  ml: 1,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
                  },
                }}
              >
                Export to Excel
              </Button>
            </Box>
            <TableContainer component={MuiPaper} sx={{ background: 'rgba(35,41,70,0.85)', borderRadius: 2, boxShadow: 0, overflowX: 'auto', maxWidth: '100%' }}>
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ background: 'rgba(100,108,255,0.15)' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>Date</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 }, minWidth: 80 }}>Name</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 }, minWidth: 100 }}>Email</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 }, minWidth: 80 }}>Phone</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 }, minWidth: 70 }}>Form Type</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 }, minWidth: 90 }}>Eligibility Paragraph</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 }, minWidth: 120 }}>Other Info</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSubmissions.map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, background: 'rgba(255,255,255,0.04)' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>
                        {row.created_at ? new Date(row.created_at).toLocaleString() : ''}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>{row.user_data?.fullName || ''}</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>{row.user_data?.email || ''}</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>{row.user_data?.phone || ''}</TableCell>
                      <TableCell sx={{ color: row.form_type === 'positive' ? '#43e97b' : '#ff5e62', fontWeight: 700, textTransform: 'capitalize', fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>{row.form_type}</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>{getEligibilitySectionByEmail(row.user_data?.email)}</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 400, maxWidth: { xs: 120, sm: 320 }, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>
                        {Object.entries(row.user_data || {})
                          .filter(([k]) => !['fullName', 'email', 'phone', 'eligibleSections'].includes(k))
                          .map(([k, v]) => (
                            <div key={k} style={{ marginBottom: 2 }}>
                              <b style={{ color: '#4fc3f7' }}>{k}:</b> {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                            </div>
                          ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default AdminDashboard; 