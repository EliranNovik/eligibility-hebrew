import React from 'react';
import { Container, Card, CardContent, Typography, Box } from '@mui/material';

const AdminsPage = () => (
  <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
    <Card sx={{ width: '100%', borderRadius: 4, boxShadow: 6, bgcolor: 'rgba(35,41,70,0.95)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#fff', mb: 1, textAlign: 'center' }}>
            Admins Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#b0b8c9', textAlign: 'center', fontSize: { xs: 16, sm: 18 } }}>
            This section is under construction. Please check back soon for admin management features.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Container>
);

export default AdminsPage; 