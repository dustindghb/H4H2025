'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Chip,
  useTheme
} from '@mui/material';
import {
  Computer as TechIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const csMentor = {
  id: 'cs',
  industry: 'Computer Science',
  description: 'Discover paths in software development, data science, and IT infrastructure. Get guidance on technical skills and emerging technologies.',
  icon: <TechIcon sx={{ fontSize: 40 }} />,
  keyTopics: ['Software Development', 'Data Science', 'Cloud Computing'],
  careerPaths: ['Software Engineer', 'Data Scientist', 'DevOps Engineer'],
  color: '#1565C0'
};

export default function MentorsPage() {
  const theme = useTheme();
  const router = useRouter();

  const handleStartChat = () => {
    router.push(`/dashboard/student/mentors/cs`);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        CS Career Mentor
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Chat with our Computer Science mentor about career paths and opportunities
      </Typography>

      <Card 
        sx={{ 
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[6]
          }
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: csMentor.color,
            color: 'white'
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: 'white',
              color: csMentor.color,
              width: 56,
              height: 56,
              mr: 2
            }}
          >
            {csMentor.icon}
          </Avatar>
          <Typography variant="h6">{csMentor.industry}</Typography>
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body2" paragraph>
            {csMentor.description}
          </Typography>
          
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Key Topics:
          </Typography>
          <Box sx={{ mb: 2 }}>
            {csMentor.keyTopics.map((topic) => (
              <Chip
                key={topic}
                label={topic}
                size="small"
                sx={{ 
                  mr: 1, 
                  mb: 1,
                  bgcolor: `${csMentor.color}15`,
                  color: csMentor.color,
                  borderColor: csMentor.color
                }}
                variant="outlined"
              />
            ))}
          </Box>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Career Paths:
          </Typography>
          <Box>
            {csMentor.careerPaths.map((path) => (
              <Chip
                key={path}
                label={path}
                size="small"
                sx={{ 
                  mr: 1, 
                  mb: 1,
                  bgcolor: `${csMentor.color}08`
                }}
              />
            ))}
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button 
            fullWidth 
            variant="contained"
            onClick={handleStartChat}
            sx={{ 
              bgcolor: csMentor.color,
              '&:hover': {
                bgcolor: csMentor.color,
                filter: 'brightness(0.9)'
              }
            }}
          >
            Chat with CS Mentor
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}