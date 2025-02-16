'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Checkbox,
  FormControlLabel,
  createTheme, 
  ThemeProvider 
} from '@mui/material';

interface MajorGroup {
  name: string;
  majors: string[];
  color: string;
}

const majorGroups: MajorGroup[] = [
  {
    name: "Engineering & Technology",
    color: "#896ED1",
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
    color: "#6F4DC7",
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
    color: "#A08FDA",
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
    color: "#7B5ECD",
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
    color: "#9882D8",
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
    color: "#8470C7",
    majors: [
      "Nursing",
      "Public Health",
      "Pre-Medicine",
      "Nutrition",
      "Physical Therapy"
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

const MajorSelection = () => {
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);

  const handleMajorToggle = (major: string) => {
    setSelectedMajors(prev => 
      prev.includes(major) 
        ? prev.filter(m => m !== major)
        : [...prev, major]
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        p: 3,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: 3,
        position: 'relative'
      }}>
        {majorGroups.map((group, groupIndex) => (
          <Paper
            key={group.name}
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              position: 'relative',
              backgroundColor: group.color,
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
              // Create interconnecting effect with pseudo-elements
              '&::before': {
                content: '""',
                position: 'absolute',
                width: '20px',
                height: '20px',
                backgroundColor: 'inherit',
                right: '-10px',
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 1,
                display: {
                  xs: 'none',
                  md: groupIndex % 2 === 0 ? 'block' : 'none'
                }
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '20px',
                height: '20px',
                backgroundColor: 'inherit',
                left: '-10px',
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 1,
                display: {
                  xs: 'none',
                  md: groupIndex % 2 === 1 ? 'block' : 'none'
                }
              }
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {group.name}
            </Typography>
            <Box sx={{ mt: 2 }}>
              {group.majors.map(major => (
                <FormControlLabel
                  key={major}
                  control={
                    <Checkbox
                      checked={selectedMajors.includes(major)}
                      onChange={() => handleMajorToggle(major)}
                      sx={{
                        color: 'white',
                        '&.Mui-checked': {
                          color: 'white',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: 'white' }}>
                      {major}
                    </Typography>
                  }
                  sx={{ display: 'block', mb: 1 }}
                />
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
    </ThemeProvider>
  );
};

export default MajorSelection;