'use client';

import { Box, Typography } from '@mui/material';

export default function StudentDashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hello Student
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Welcome to your dashboard
      </Typography>
    </Box>
  );
}