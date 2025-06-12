import React from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem } from '@mui/material';
import MuiPaper from '@mui/material/Paper';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const ELIGIBILITY_COLORS = ['#646cff', '#43e97b', '#ffb300', '#ff5e62'];

const AdminHomePage = ({
  stats,
  contactFormCounts,
  gaStats,
  filteredSubmissions,
  handleExportExcel,
  formTypeFilter,
  setFormTypeFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  search,
  setSearch,
  getEligibilitySectionByEmail
}: any) => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 4 }}>
        Admin Dashboard
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, background: 'linear-gradient(135deg, rgba(13, 27, 62, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.10)', mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>Eligibility Stats</Typography>
        <Box sx={{ width: '100%', maxWidth: 2000, height: 360, mb: 4, mx: 'auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[{ section: '§116', count: stats['§116'] || 0 }, { section: '§15', count: stats['§15'] || 0 }, { section: '§5', count: stats['§5'] || 0 }, { section: '§58c', count: stats['§58c'] || 0 }]}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <XAxis dataKey="section" stroke="#fff" fontSize={16} tickLine={false} axisLine={{ stroke: '#fff' }} />
              <YAxis stroke="#fff" fontSize={16} tickLine={false} axisLine={{ stroke: '#fff' }} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ background: '#232946', color: '#fff', borderRadius: 8, border: 'none' }} 
                labelStyle={{ color: '#fff', fontWeight: 700 }}
                itemStyle={{ color: '#fff', fontWeight: 700 }}
                cursor={{ fill: 'rgba(255,255,255,0.08)' }}
              />
              <Legend wrapperStyle={{ color: '#fff', fontSize: 16 }} />
              <Bar dataKey="count" name="Eligible Count" radius={[8, 8, 0, 0]}>
                <Cell fill="#646cff" />
                <Cell fill="#43e97b" />
                <Cell fill="#ffb300" />
                <Cell fill="#ff5e62" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>Contact Form Submissions</Typography>
        <Box sx={{ display: 'flex', gap: 4, mb: 4, maxWidth: 1600, mx: 'auto' }}>
          <Box sx={{ background: 'linear-gradient(90deg, #535bf2 0%, #43e97b 100%)', color: 'white', borderRadius: 4, p: 3, minWidth: 160, textAlign: 'center', fontWeight: 700, fontSize: 24 }}>
            <CheckCircleIcon sx={{ color: '#43e97b', fontSize: 48, mb: 1 }} />
            {contactFormCounts.positive}
            <Typography sx={{ fontSize: 18, color: '#fff' }}>Positive</Typography>
          </Box>
          <Box sx={{ background: 'linear-gradient(90deg, #535bf2 0%, #ff5e62 100%)', color: 'white', borderRadius: 4, p: 3, minWidth: 160, textAlign: 'center', fontWeight: 700, fontSize: 24 }}>
            <CancelIcon sx={{ color: '#ff5e62', fontSize: 48, mb: 1 }} />
            {contactFormCounts.negative}
            <Typography sx={{ fontSize: 18, color: '#fff' }}>Negative</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminHomePage; 