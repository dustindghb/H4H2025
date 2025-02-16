"use client";

import React, { useState } from "react";
import Image from 'next/image';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const fieldCategories = [
  {
    name: "Engineering & Technology",
    majors: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Software Engineering", "Civil Engineering"]
  },
  {
    name: "Natural Sciences",
    majors: ["Biology", "Chemistry", "Physics", "Environmental Science", "Mathematics"]
  },
  {
    name: "Business & Economics",
    majors: ["Business Administration", "Economics", "Finance", "Marketing", "Accounting"]
  },
  {
    name: "Arts & Humanities",
    majors: ["English Literature", "History", "Philosophy", "Fine Arts", "Music"]
  },
  {
    name: "Social Sciences",
    majors: ["Psychology", "Sociology", "Political Science", "Anthropology", "Communications"]
  },
  {
    name: "Health Sciences",
    majors: ["Nursing", "Public Health", "Pre-Medicine", "Nutrition", "Physical Therapy"]
  }
];

// Create flat array of majors with their categories
const majorOptions = fieldCategories.flatMap(category => 
  category.majors.map(major => ({
    major,
    category: category.name
  }))
);

// Styled components for Vira Bot
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
  const [formData, setFormData] = useState({
    major: "",
    currentRole: "",
    industrySector: "",
    companySize: "",
    yearsInRole: "",
    careerPath: "",
    careerJourney: "",
    dailyActivities: "",
    toolsUsed: "",
    technicalSkills: "",
    softSkills: "",
    industryTrends: "",
    industryAdvice: "",
    professionalDevelopment: "",
    keyFactors: "",
    careerLessons: "",
    resources: "",
  });

  const handleInputChange = (field: keyof typeof formData) => 
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
  };

  const handleMajorChange = (_event: any, newValue: { major: string, category: string } | null) => {
    setFormData({
      ...formData,
      major: newValue ? newValue.major : "",
    });
  };

  const handleSubmit = async () => {
    const payload = {
      bio: formData.careerPath || "",
      industry: formData.industrySector || "",
      currentRole: formData.currentRole || "",
      company: null,
      yearsExperience: formData.yearsInRole ? parseInt(formData.yearsInRole, 10) : 1,
      yearsInCurrentRole: formData.yearsInRole ? parseInt(formData.yearsInRole, 10) : 1,
      careerTimeline: formData.careerPath || "",
      careerJourney: formData.careerJourney || "",
      coreDailyActivities: formData.dailyActivities || "",
      toolsAndTechnology: formData.toolsUsed || "",
      technicalSkills: formData.technicalSkills || "",
      softSkills: formData.softSkills || "",
      industryTrends: formData.industryTrends || "",
      professionalDevelopmentActivities: null,
      adviceForNewcomers: formData.industryAdvice || "",
      keySuccessFactors: formData.keyFactors || "",
      resources: null,
      major: formData.major || ""
    };

    try {
      const response = await fetch("/api/user/professional-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error response:", responseData);
        alert(`Error: ${responseData.message || "Profile submission failed"}`);
        return;
      }

      alert("Profile submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please check the console for more details.");
    }
  };

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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Autocomplete
              options={majorOptions}
              getOptionLabel={(option) => option.major}
              groupBy={(option) => option.category}
              value={majorOptions.find(option => option.major === formData.major) || null}
              onChange={handleMajorChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Field of Study"
                  required
                  fullWidth
                  helperText="Select your major or field of study"
                />
              )}
            />

            <TextField
              fullWidth
              label="Current Job Title"
              value={formData.currentRole}
              onChange={handleInputChange("currentRole")}
            />

            <TextField
              fullWidth
              label="Industry Sector"
              value={formData.industrySector}
              onChange={handleInputChange("industrySector")}
            />

            <TextField
              fullWidth
              label="Company Size"
              value={formData.companySize}
              onChange={handleInputChange("companySize")}
              placeholder="e.g., Small (1-50), Medium (51-200), Large (201+)"
            />

            <TextField
              fullWidth
              label="Years in Current Role"
              value={formData.yearsInRole}
              onChange={handleInputChange("yearsInRole")}
              type="number"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Career Progression Timeline"
              value={formData.careerPath}
              onChange={handleInputChange("careerPath")}
              placeholder="Describe your career progression, including major role changes and responsibilities"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Core Daily Activities"
              value={formData.dailyActivities}
              onChange={handleInputChange("dailyActivities")}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Tools and Technologies Used"
              value={formData.toolsUsed}
              onChange={handleInputChange("toolsUsed")}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Technical Skills Required"
              value={formData.technicalSkills}
              onChange={handleInputChange("technicalSkills")}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Soft Skills Needed"
              value={formData.softSkills}
              onChange={handleInputChange("softSkills")}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Industry Trends"
              value={formData.industryTrends}
              onChange={handleInputChange("industryTrends")}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Professional Development Activities"
              value={formData.professionalDevelopment}
              onChange={handleInputChange("professionalDevelopment")}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Key Success Factors"
              value={formData.keyFactors}
              onChange={handleInputChange("keyFactors")}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Advice for Newcomers"
              value={formData.industryAdvice}
              onChange={handleInputChange("industryAdvice")}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2 }}
            >
              Submit Profile
            </Button>
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
                Hi! Thank you for joining us.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                If you have side projects that need volunteers feel free to make a post
                on the Gig board
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Please share your professional experience to help improve our AI mentors.
              </Typography>
            </SpeechBubble>
          </BotContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}