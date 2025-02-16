'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  FormHelperText,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface MajorGroup {
  name: string;
  majors: string[];
}

const majorGroups: MajorGroup[] = [
  {
    name: "Engineering & Technology",
    majors: [
      "Computer Science",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Software Engineering",
      "Civil Engineering"
    ]
  },
  {
    name: "Natural Sciences",
    majors: [
      "Biology",
      "Chemistry",
      "Physics",
      "Environmental Science",
      "Mathematics"
    ]
  },
  {
    name: "Business & Economics",
    majors: [
      "Business Administration",
      "Economics",
      "Finance",
      "Marketing",
      "Accounting"
    ]
  },
  {
    name: "Arts & Humanities",
    majors: [
      "English Literature",
      "History",
      "Philosophy",
      "Fine Arts",
      "Music"
    ]
  },
  {
    name: "Social Sciences",
    majors: [
      "Psychology",
      "Sociology",
      "Political Science",
      "Anthropology",
      "Communications"
    ]
  },
  {
    name: "Health Sciences",
    majors: [
      "Nursing",
      "Public Health",
      "Pre-Medicine",
      "Nutrition",
      "Physical Therapy"
    ]
  }
];

const formSections = [
  {
    title: "Skills and Strengths",
    options: [
      "Working with numbers and data analysis",
      "Communication and writing",
      "Creative and artistic activities",
      "Problem-solving and logical thinking",
      "Working with people and building relationships",
      "Physical or hands-on activities",
      "Leadership and organizing teams",
      "Technology and digital tools",
      "Teaching and explaining concepts",
      "Research and investigation"
    ]
  },
  {
    title: "Work Environment Preferences",
    maxSelections: 3,
    options: [
      "In an office setting",
      "Outdoors or in the field",
      "From home/remotely",
      "In a laboratory or research facility",
      "In a creative studio",
      "In a hospital or healthcare setting",
      "In an educational environment",
      "In a retail or customer-facing space",
      "In an industrial or manufacturing setting",
      "In different locations (traveling)"
    ]
  },
  {
    title: "Core Values and Motivations",
    maxSelections: 3,
    options: [
      "Making a positive impact on society",
      "Financial security and growth",
      "Work-life balance",
      "Continuous learning and challenges",
      "Creative expression",
      "Leadership opportunities",
      "Job security and stability",
      "Innovation and cutting-edge work",
      "Helping others",
      "Building something of your own"
    ]
  },
  {
    title: "Industry Interests",
    maxSelections: 3,
    options: [
      "Technology and Software",
      "Healthcare and Medicine",
      "Education and Training",
      "Finance and Business",
      "Arts and Entertainment",
      "Science and Research",
      "Engineering and Manufacturing",
      "Social Services",
      "Media and Communications",
      "Environmental and Sustainability"
    ]
  },
  {
    title: "Learning Style and Growth",
    options: [
      "Through formal education (university/college)",
      "Through hands-on experience",
      "Through self-directed learning",
      "Through mentorship and guidance",
      "Through structured training programs",
      "Through trial and error",
      "Through collaborative projects",
      "Through theoretical study",
      "Through practical applications",
      "Through creative exploration"
    ]
  }
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

export default function StudentDashboard() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [selections, setSelections] = useState<{ [key: string]: string[] }>(
    formSections.reduce((acc, section) => ({ ...acc, [section.title]: [] }), {})
  );
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleMajorAdd = (major: string) => {
    if (!selectedMajors.includes(major)) {
      setSelectedMajors(prev => [...prev, major]);
    }
  };

  const handleMajorRemove = (major: string) => {
    setSelectedMajors(prev => prev.filter(m => m !== major));
  };

  const handleCheckboxChange = (section: string, option: string) => {
    setError(null);
    const currentSelections = [...selections[section]];
    const maxSelections = formSections.find(s => s.title === section)?.maxSelections;
    
    if (currentSelections.includes(option)) {
      setSelections({
        ...selections,
        [section]: currentSelections.filter(item => item !== option)
      });
    } else {
      if (maxSelections && currentSelections.length >= maxSelections) {
        setError(`Please select only ${maxSelections} options`);
        return;
      }
      setSelections({
        ...selections,
        [section]: [...currentSelections, option]
      });
    }
  };

  const handleNext = () => {
    const currentSection = formSections[activeStep];
    const currentSelections = selections[currentSection.title];
    
    if (currentSection.maxSelections && currentSelections.length !== currentSection.maxSelections) {
      setError(`Please select exactly ${currentSection.maxSelections} options`);
      return;
    }
    
    if (currentSelections.length === 0) {
      setError('Please select at least one option');
      return;
    }
    
    setActiveStep(prev => prev + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      // Validate that at least some selections are made
      if (selectedMajors.length === 0) {
        setError('Please select at least one major');
        return;
      }

      if (Object.values(selections).every(array => array.length === 0)) {
        setError('Please complete all sections before submitting');
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus('idle');
      
      const formData = {
        skills: selections["Skills and Strengths"],
        workEnvironments: selections["Work Environment Preferences"],
        coreValues: selections["Core Values and Motivations"].join(", "),
        industryInterests: selections["Industry Interests"],
        learningStyles: selections["Learning Style and Growth"],
        intrestedMajors: selectedMajors
      };

      const response = await fetch('/api/user/student-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Failed to update preferences: ${errorData?.message || response.statusText}`);
      }

      setSubmitStatus('success');
      
      setTimeout(() => {
        router.push('/dashboard/student');
      }, 1500);
    } catch (err) {
      setSubmitStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred while submitting');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
          Student Career Profile
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Interested Majors
          </Typography>
          
          {selectedMajors.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Selected Majors:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedMajors.map((major) => (
                  <Chip
                    key={major}
                    label={major}
                    onDelete={() => handleMajorRemove(major)}
                    deleteIcon={<CloseIcon />}
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3
          }}>
            {majorGroups.map((group) => (
              <Box key={group.name} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  {group.name}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {group.majors.map((major) => (
                    <Button
                      key={major}
                      variant="outlined"
                      size="small"
                      onClick={() => handleMajorAdd(major)}
                      disabled={selectedMajors.includes(major)}
                      startIcon={<AddIcon />}
                      sx={{ 
                        justifyContent: 'flex-start',
                        textTransform: 'none'
                      }}
                    >
                      {major}
                    </Button>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {formSections.map((section) => (
              <Step key={section.title}>
                <StepLabel>{section.title}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep < formSections.length ? (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {formSections[activeStep].title}
              </Typography>
              
              {formSections[activeStep].maxSelections && (
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Select your top {formSections[activeStep].maxSelections} choices
                </Typography>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormGroup>
                  {formSections[activeStep].options.map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={selections[formSections[activeStep].title].includes(option)}
                          onChange={() => handleCheckboxChange(formSections[activeStep].title, option)}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </FormControl>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                All steps completed!
              </Typography>
              
              {submitStatus === 'success' && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Profile submitted successfully!
                </Alert>
              )}
              
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <span>Submitting...</span>
                  </Box>
                ) : (
                  'Submit Profile'
                )}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}