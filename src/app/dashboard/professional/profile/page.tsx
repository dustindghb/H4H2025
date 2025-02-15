'use client';

import React, { useState } from 'react';
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
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  Autocomplete,
  TextareaAutosize
} from '@mui/material';

const sections = [
  'Career Path Experience',
  'Daily Work Reality',
  'Industry Insights',
  'Career Development',
  'Real-World Advice'
];

export default function ProfessionalProfile() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Career Path Experience
    currentRole: '',
    industrySector: '',
    yearsInRole: '',
    companySize: '',
    firstRole: '',
    education: '',
    previousIndustries: '',
    careerPath: '',
    
    // Daily Work Reality
    dailyActivities: '',
    timeAllocation: '',
    challenges: '',
    toolsUsed: '',
    teamInteraction: '',
    technicalSkills: '',
    softSkills: '',
    certifications: '',
    
    // Industry Insights
    industryTrends: '',
    marketChanges: '',
    newSkillRequirements: '',
    industryAdvice: '',
    entryBarriers: '',
    
    // Career Development
    learningResources: '',
    professionalDevelopment: '',
    industryNetworks: '',
    keyFactors: '',
    careerInvestments: '',
    
    // Real-World Advice
    successfulProjects: '',
    challengingSituations: '',
    careerLessons: '',
    workLifeBalance: '',
    earlyCareerAdvice: ''
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const renderCareerPathExperience = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Current Job Title"
          value={formData.currentRole}
          onChange={handleInputChange('currentRole')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Industry Sector"
          value={formData.industrySector}
          onChange={handleInputChange('industrySector')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Years in Current Role"
          value={formData.yearsInRole}
          onChange={handleInputChange('yearsInRole')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Career Progression Timeline"
          value={formData.careerPath}
          onChange={handleInputChange('careerPath')}
          placeholder="Describe your career progression, including major role changes and responsibilities"
        />
      </Grid>
    </Grid>
  );

  const renderDailyWorkReality = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Core Daily Activities"
          value={formData.dailyActivities}
          onChange={handleInputChange('dailyActivities')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Tools and Technologies Used"
          value={formData.toolsUsed}
          onChange={handleInputChange('toolsUsed')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Technical Skills Required"
          value={formData.technicalSkills}
          onChange={handleInputChange('technicalSkills')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Soft Skills Needed"
          value={formData.softSkills}
          onChange={handleInputChange('softSkills')}
        />
      </Grid>
    </Grid>
  );

  const renderIndustryInsights = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Industry Trends"
          value={formData.industryTrends}
          onChange={handleInputChange('industryTrends')}
          placeholder="What trends are shaping your industry?"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Advice for Newcomers"
          value={formData.industryAdvice}
          onChange={handleInputChange('industryAdvice')}
          placeholder="What would you tell someone entering your field today?"
        />
      </Grid>
    </Grid>
  );

  const renderCareerDevelopment = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Professional Development Activities"
          value={formData.professionalDevelopment}
          onChange={handleInputChange('professionalDevelopment')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Key Success Factors"
          value={formData.keyFactors}
          onChange={handleInputChange('keyFactors')}
        />
      </Grid>
    </Grid>
  );

  const renderRealWorldAdvice = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Successful Projects"
          value={formData.successfulProjects}
          onChange={handleInputChange('successfulProjects')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Career Lessons"
          value={formData.careerLessons}
          onChange={handleInputChange('careerLessons')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Early Career Advice"
          value={formData.earlyCareerAdvice}
          onChange={handleInputChange('earlyCareerAdvice')}
        />
      </Grid>
    </Grid>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderCareerPathExperience();
      case 1:
        return renderDailyWorkReality();
      case 2:
        return renderIndustryInsights();
      case 3:
        return renderCareerDevelopment();
      case 4:
        return renderRealWorldAdvice();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
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
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === sections.length - 1 ? () => console.log(formData) : handleNext}
            >
              {activeStep === sections.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}