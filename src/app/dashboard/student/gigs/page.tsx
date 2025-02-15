'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  TextField,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  postedBy: string;
  status: 'Open' | 'In Progress' | 'Completed';
}

const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Social Media Marketing Campaign',
    description: 'Looking for help in designing and executing a social media campaign for a new product launch.',
    skills: ['Marketing', 'Social Media', 'Content Creation'],
    duration: '2 weeks',
    difficulty: 'Intermediate',
    postedBy: 'TechStart Inc.',
    status: 'Open'
  },
  {
    id: '2',
    title: 'Financial Analysis Report',
    description: 'Need assistance in creating a comprehensive financial analysis report for a startup.',
    skills: ['Financial Analysis', 'Excel', 'Data Visualization'],
    duration: '1 week',
    difficulty: 'Advanced',
    postedBy: 'Finance Pro LLC',
    status: 'Open'
  },
];

const difficultyColors = {
  Beginner: '#4CAF50',
  Intermediate: '#FF9800',
  Advanced: '#F44336'
};

const statusColors = {
  'Open': '#4CAF50',
  'In Progress': '#2196F3',
  'Completed': '#9E9E9E'
};

export default function StudentGigWork() {
  const theme = useTheme();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/student/gigs/${projectId}`);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = sampleProjects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Available Projects
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search projects by title, description, or skills..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
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
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Chip 
                    label={project.difficulty}
                    size="small"
                    sx={{ 
                      bgcolor: `${difficultyColors[project.difficulty]}15`,
                      color: difficultyColors[project.difficulty],
                      borderColor: difficultyColors[project.difficulty]
                    }}
                    variant="outlined"
                  />
                  <Chip 
                    label={project.status}
                    size="small"
                    sx={{ 
                      bgcolor: `${statusColors[project.status]}15`,
                      color: statusColors[project.status]
                    }}
                  />
                </Box>

                <Typography variant="h6" gutterBottom>
                  {project.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {project.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {project.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ fontSize: 'small', mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {project.postedBy}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon sx={{ fontSize: 'small', mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {project.duration}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant="contained"
                  onClick={() => handleProjectClick(project.id)}
                >
                  Apply Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}