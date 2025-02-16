'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

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

// Define keyframes as a CSS string
const floatAnimation = `
  @keyframes floatInOut {
    0%, 100% {
      transform: translateX(0) rotate(-45deg);
    }
    50% {
      transform: translateX(-20px) rotate(-45deg);
    }
  }
`;

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
  backgroundColor: '#BDBDBD', // Darker gray
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
  maxWidth: '200px',
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

// Updated JSX structure
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
        Hi student, I am Vira! Fill in your profile and select majors to get started.
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
        Clicking majors will generate clones of me capable ofreferencing industry professional experiences to provide mentorship and guidance.
      </Typography>
    </SpeechBubble>
  </BotContainer>
</Box>

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
  const [selections, setSelections] = useState<{ [key: string]: string[] }>(
    formSections.reduce((acc, section) => ({ ...acc, [section.title]: [] }), {})
  );
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [userName, setUserName] = useState('');

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

  const handleSubmit = async () => {
    try {
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
        coreValues: selections["Core Values and Motivations"],
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
        throw new Error('Failed to update preferences');
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
      <style>{floatAnimation}</style>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 4,
        p: 4,
        maxWidth: '100vw',
        position: 'relative'
      }}>
        {/* Left Column - Form */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
            Student Career Profile
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {formSections.map((section) => (
            <Box key={section.title} sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                {section.title}
              </Typography>
              
              {section.maxSelections && (
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Select your top {section.maxSelections} choices
                </Typography>
              )}

              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormGroup>
                  {section.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={selections[section.title].includes(option)}
                          onChange={() => handleCheckboxChange(section.title, option)}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Box>
          ))}

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            fullWidth
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

          {submitStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Profile submitted successfully!
            </Alert>
          )}
        </Paper>

        {/* Middle Column - Majors */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {majorGroups.map((group) => (
              <Box key={group.name}>
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
                      sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                    >
                      {major}
                    </Button>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
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
                Hello {userName}! Fill in your profile and select majors to get started.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Clicking majors will generate clones of me specialized in providing mentoring and guidance by referencing industry professional experiences.
              </Typography>
            </SpeechBubble>
          </BotContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

