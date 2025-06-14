import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Pagination, Stack } from '@mui/material';
import MuiPaper from '@mui/material/Paper';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ROWS_PER_PAGE = 10;

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
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSubmissions.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentPageData = filteredSubmissions.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setExpandedRowId(null); // Close any expanded rows when changing pages
  };

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
              {currentPageData.map((row: any) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, background: 'rgba(255,255,255,0.04)', cursor: 'pointer' }}
                    onClick={() => setExpandedRowId(expandedRowId === row.id ? null : row.id)}
                  >
                    <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>
                      {row.created_at ? new Date(row.created_at).toLocaleString() : ''}
                    </TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>{row.user_data?.fullName || ''}</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>{row.user_data?.email || ''}</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>{row.user_data?.phone || ''}</TableCell>
                    <TableCell sx={{ color: row.form_type === 'positive' ? '#43e97b' : '#ff5e62', fontWeight: 700, textTransform: 'capitalize', fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>{row.form_type}</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>{getEligibilitySectionByEmail(row.user_data?.email)}</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 400, maxWidth: { xs: 120, sm: 320 }, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: { xs: 11, sm: 15 }, px: { xs: 1, sm: 2 } }}>
                      {row.user_data?.persecutedName && (
                        <div style={{ marginBottom: 2 }}>
                          <b style={{ color: '#4fc3f7' }}>Persecuted Name:</b> {row.user_data.persecutedName}
                        </div>
                      )}
                      {row.user_data?.persecutedDob && (
                        <div style={{ marginBottom: 2 }}>
                          <b style={{ color: '#4fc3f7' }}>Date of Birth:</b> {row.user_data.persecutedDob}
                        </div>
                      )}
                      {row.user_data?.persecutedPlace && (
                        <div style={{ marginBottom: 2 }}>
                          <b style={{ color: '#4fc3f7' }}>Place of Birth:</b> {row.user_data.persecutedPlace}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRowId === row.id && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ background: 'rgba(35,41,70,0.97)', color: '#fff', p: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>Full Submission Details</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {row.user_data?.answers_pretty && (
                            <div style={{ marginBottom: 2 }}>
                              <b style={{ color: '#4fc3f7' }}>Q&amp;A:</b>
                              <pre style={{ color: '#fff', background: 'none', margin: 0, padding: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>{row.user_data.answers_pretty}</pre>
                            </div>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Stack spacing={2}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#fff',
                  fontSize: '1rem',
                  '&.Mui-selected': {
                    background: 'linear-gradient(90deg, #646cff 0%, #535bf2 100%)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #535bf2 0%, #646cff 100%)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                  },
                },
              }}
            />
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default LeadsPage; 