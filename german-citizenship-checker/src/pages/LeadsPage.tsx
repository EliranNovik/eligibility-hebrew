import React from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem } from '@mui/material';
import MuiPaper from '@mui/material/Paper';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const LeadsPage = ({
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
        Leads Management
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, background: 'linear-gradient(135deg, rgba(13, 27, 62, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: '0 6px 32px 0 rgba(67, 233, 123, 0.10)', mb: 4 }}>
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
              {filteredSubmissions.map((row: any) => (
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
    </Box>
  );
};

export default LeadsPage; 