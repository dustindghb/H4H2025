'use client';

import React from 'react';
import {
  Box,
  Grid,
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
  TrendingUp as FinanceIcon,
  Campaign as MarketingIcon,
  Computer as TechIcon,
  HealthAndSafety as HealthcareIcon,
  Engineering as EngineeringIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Mentor {
  id: string;
  industry: string;
  description: string;
  icon: React.ReactNode;
  keyTopics: string[];
  careerPaths: string[];
  color: string;
}

const industryMentors: Mentor[] = [
  {
    id: 'finance',
    industry: 'Finance',
    description: 'Get insights into finance careers, from investment banking to financial planning. Learn about market analysis, risk management, and financial technologies.',
    icon: <FinanceIcon sx={{ fontSize: 40 }} />,
    keyTopics: ['Investment Banking', 'Corporate Finance', 'FinTech'],
    careerPaths: ['Financial Analyst', 'Investment Banker', 'Risk Manager'],
    color: '#2E7D32'
  },
  {
    id: 'marketing',
    industry: 'Marketing',
    description: 'Explore marketing careers spanning digital marketing, brand management, and market research. Learn about the latest marketing technologies and strategies.',
    icon: <MarketingIcon sx={{ fontSize: 40 }} />,
    keyTopics: ['Digital Marketing', 'Brand Strategy', 'Market Analytics'],
    careerPaths: ['Digital Marketing Manager', 'Brand Strategist', 'Marketing Analyst'],
    color: '#C62828'
  },
  {
    id: 'tech',
    industry: 'Computer Science',
    description: 'Discover paths in software development, data science, and IT infrastructure. Get guidance on technical skills and emerging technologies.',
    icon: <TechIcon sx={{ fontSize: 40 }} />,
    keyTopics: ['Software Development', 'Data Science', 'Cloud Computing'],
    careerPaths: ['Software Engineer', 'Data Scientist', 'DevOps Engineer'],
    color: '#1565C0'
  },
  {
    id: 'healthcare',
    industry: 'Healthcare',
    description: 'Learn about careers in healthcare administration, medical technology, and health informatics. Understand the intersection of healthcare and technology.',
    icon: <HealthcareIcon sx={{ fontSize: 40 }} />,
    keyTopics: ['Health Informatics', 'Healthcare Management', 'Medical Technology'],
    careerPaths: ['Healthcare Administrator', 'Health IT Specialist', 'Clinical Analyst'],
    color: '#0097A7'
  },
  {
    id: 'engineering',
    industry: 'Engineering',
    description: 'Explore various engineering disciplines from mechanical to software. Get insights into industry requirements and technological advances.',
    icon: <EngineeringIcon sx={{ fontSize: 40 }} />,
    keyTopics: ['Mechanical Engineering', 'Electrical Engineering', 'Software Engineering'],
    careerPaths: ['Mechanical Engineer', 'Electrical Engineer', 'Systems Engineer'],
    color: '#F57C00'
  },
  {
    id: 'business',
    industry: 'Business Management',
    description: 'Understand careers in business administration, consulting, and entrepreneurship. Learn about business strategy and organizational leadership.',
    icon: <BusinessIcon sx={{ fontSize: 40 }} />,
    keyTopics: ['Strategic Management', 'Consulting', 'Entrepreneurship'],
    careerPaths: ['Business Consultant', 'Project Manager', 'Entrepreneur'],
    color: '#283593'
  }
];

export default function MentorsPage() {
  const theme = useTheme();
  const router = useRouter();

  const handleStartChat = (mentorId: string) => {
    router.push(`/dashboard/student/mentors/${mentorId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Industry Mentors
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Choose an industry mentor to explore career paths and opportunities
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {industryMentors.map((mentor) => (
          <Grid item xs={12} sm={6} md={4} key={mentor.id}>
            <Card 
              sx={{ 
                height: '100%',
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
                  bgcolor: mentor.color,
                  color: 'white'
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: 'white',
                    color: mentor.color,
                    width: 56,
                    height: 56,
                    mr: 2
                  }}
                >
                  {mentor.icon}
                </Avatar>
                <Typography variant="h6">{mentor.industry}</Typography>
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" paragraph>
                  {mentor.description}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Key Topics:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {mentor.keyTopics.map((topic) => (
                    <Chip
                      key={topic}
                      label={topic}
                      size="small"
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        bgcolor: `${mentor.color}15`,
                        color: mentor.color,
                        borderColor: mentor.color
                      }}
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Career Paths:
                </Typography>
                <Box>
                  {mentor.careerPaths.map((path) => (
                    <Chip
                      key={path}
                      label={path}
                      size="small"
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        bgcolor: `${mentor.color}08`
                      }}
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant="contained"
                  onClick={() => handleStartChat(mentor.id)}
                  sx={{ 
                    bgcolor: mentor.color,
                    '&:hover': {
                      bgcolor: mentor.color,
                      filter: 'brightness(0.9)'
                    }
                  }}
                >
                  Chat with Industry Mentor
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}