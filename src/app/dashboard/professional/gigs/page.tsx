"use client";

import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  WorkOutline as WorkIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  postedBy: string;
  status: "Open" | "In Progress" | "Completed";
}

const sampleProjects: Project[] = [
  {
    id: "1",
    title: "Social Media Marketing Campaign",
    description:
      "Looking for help in designing and executing a social media campaign for a new product launch.",
    skills: ["Marketing", "Social Media", "Content Creation"],
    duration: "2 weeks",
    difficulty: "Intermediate",
    postedBy: "TechStart Inc.",
    status: "Open",
  },
  {
    id: "2",
    title: "Financial Analysis Report",
    description:
      "Need assistance in creating a comprehensive financial analysis report for a startup.",
    skills: ["Financial Analysis", "Excel", "Data Visualization"],
    duration: "1 week",
    difficulty: "Advanced",
    postedBy: "Finance Pro LLC",
    status: "Open",
  },
  {
    id: "3",
    title: "Web Development Project",
    description:
      "Looking for collaborators to build a responsive website for a local business.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    duration: "3 weeks",
    difficulty: "Intermediate",
    postedBy: "WebDev Solutions",
    status: "In Progress",
  },
  {
    id: "4",
    title: "Market Research Study",
    description:
      "Conducting a market research study for a new app. Need help with data collection and analysis.",
    skills: ["Market Research", "Data Analysis", "Survey Design"],
    duration: "4 weeks",
    difficulty: "Beginner",
    postedBy: "Research Team",
    status: "Open",
  },
];

const difficultyColors = {
  Beginner: "#4CAF50",
  Intermediate: "#FF9800",
  Advanced: "#F44336",
};

const statusColors = {
  Open: "#4CAF50",
  "In Progress": "#2196F3",
  Completed: "#9E9E9E",
};

export default function GigWorkBoard() {
  const theme = useTheme();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/student/gigs/${projectId}`);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = sampleProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Project Board</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Post Project
        </Button>
      </Box>

      {/* Search Section */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search projects by title, description, or skills..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
            ),
          }}
        />
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Chip
                    label={project.difficulty}
                    size="small"
                    sx={{
                      bgcolor: `${difficultyColors[project.difficulty]}15`,
                      color: difficultyColors[project.difficulty],
                      borderColor: difficultyColors[project.difficulty],
                    }}
                    variant="outlined"
                  />
                  <Chip
                    label={project.status}
                    size="small"
                    sx={{
                      bgcolor: `${statusColors[project.status]}15`,
                      color: statusColors[project.status],
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

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonIcon
                      sx={{
                        fontSize: "small",
                        mr: 0.5,
                        color: "text.secondary",
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {project.postedBy}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ScheduleIcon
                      sx={{
                        fontSize: "small",
                        mr: 0.5,
                        color: "text.secondary",
                      }}
                    />
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
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Post a New Project</DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            Project creation form will be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Post Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
