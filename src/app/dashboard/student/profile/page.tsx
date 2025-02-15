'use client';

import React, { useState } from 'react';
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
  FormHelperText
} from '@mui/material';

interface FormSection {
  title: string;
  maxSelections?: number;
  options: string[];
}

const formSections: FormSection[] = [
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

export default function StudentProfile() {
  const [activeStep, setActiveStep] = useState(0);
  const [selections, setSelections] = useState<{ [key: string]: string[] }>(
    formSections.reduce((acc, section) => ({ ...acc, [section.title]: [] }), {})
  );
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = () => {
    // submission logic goes here in the future
    console.log('Form submissions:', selections);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Career Profile
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {formSections.map((section, index) => (
            <Step key={section.title}>
              <StepLabel>{section.title}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep < formSections.length ? (
          <>
            <Typography variant="h6" gutterBottom>
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

            <FormControl component="fieldset" variant="standard">
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
              <FormHelperText>
                Selected: {selections[formSections[activeStep].title].length}
                {formSections[activeStep].maxSelections && 
                  ` / ${formSections[activeStep].maxSelections}`}
              </FormHelperText>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
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
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ mt: 2 }}
            >
              Submit Profile
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}