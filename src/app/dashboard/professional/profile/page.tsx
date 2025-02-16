'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

// Vira Bot Styled Components
const BotContainer = styled(Box)({
  position: 'fixed',
  right: '40px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  animation: 'floatUpDown 3s ease-in-out infinite',
  zIndex: 10,
  '@keyframes floatUpDown': {
    '0%, 100%': {
      transform: 'translateY(-50%)',
    },
    '50%': {
      transform: 'translateY(-60%)',
    },
  },
});

const BotHead = styled(Box)({
  width: '120px',
  height: '120px',
  position: 'relative',
  zIndex: 2,
});

const BotBody = styled(Box)({
  width: '140px',
  height: '160px',
  backgroundColor: '#BDBDBD',
  borderRadius: '10px',
  marginTop: '-20px',
  position: 'relative',
  zIndex: 1,
});

const HoverCircle = styled(Box)({
  width: '30px',
  height: '30px',
  backgroundColor: '#E0F4E0',
  borderRadius: '50%',
  position: 'absolute',
  bottom: '-40px',
  opacity: 0.8,
  animation: 'pulse 2s ease-in-out infinite',
  '@keyframes pulse': {
    '0%, 100%': {
      transform: 'scale(1)',
      opacity: 0.8,
    },
    '50%': {
      transform: 'scale(1.1)',
      opacity: 1,
    },
  },
});

const SpeechBubble = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  padding: theme.spacing(2),
  backgroundColor: '#E0F4E0',
  maxWidth: '250px',
  borderRadius: '15px',
  right: '180px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 3,
  '&:before': {
    content: '""',
    position: 'absolute',
    right: '-20px',
    top: '50%',
    transform: 'translateY(-50%)',
    borderStyle: 'solid',
    borderWidth: '10px 20px 10px 0',
    borderColor: 'transparent #E0F4E0 transparent transparent',
  },
}));

const sections = [
  "Career Path Experience",
  "Daily Work Reality",
  "Industry Insights",
  "Career Development",
  "Real-World Advice",
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#896ED1',
      light: '#A08FDA',
      dark: '#6F4DC7',
      contrastText: '#FFFFFF',
    },
  },
});

export default function ProfessionalProfile() {
  const [activeStep, setActiveStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // ... existing form data state ...
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/user/session');
        const data = await response.json();
        setUserName(data.user.name);
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();
  }, []);

  // ... existing handlers ...

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 4,
        p: 4,
        maxWidth: '100vw',
        position: 'relative'
      }}>
        {/* Left Column - Form */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
          <Typography variant="h4" gutterBottom>
            Professional Profile
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {sections.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              {activeStep === sections.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      <span>Submitting...</span>
                    </Box>
                  ) : (
                    'Submit'
                  )}
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              )}
            </Box>
          </form>
        </Paper>

        {/* Right Column - Vira Bot */}
        <Box sx={{ position: 'relative' }}>
          <BotContainer>
            <Box sx={{ 
              position: 'relative', 
              width: '140px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center'
            }}>
              <BotHead>
                <Image 
                  src="/bot.png" 
                  alt="Vira Bot" 
                  width={120} 
                  height={120} 
                  style={{ 
                    objectFit: 'contain',
                    position: 'relative',
                    zIndex: 2
                  }}
                />
              </BotHead>
              <BotBody>
                <HoverCircle sx={{ left: '20px' }} />
                <HoverCircle sx={{ right: '20px' }} />
              </BotBody>
            </Box>
            <SpeechBubble elevation={3}>
              <Typography variant="body1">
                Hi {userName}! Thank you for joining us.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                If you have side projects and are looking for enthusiastic people to work with, make a post in the gig menu. Please share your professional experience to help improve our AI mentors.
              </Typography>
            </SpeechBubble>
          </BotContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}