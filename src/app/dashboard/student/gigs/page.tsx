'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  Button,
  useTheme,
  Modal,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
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
  budget: string;
  status: 'Open' | 'In Progress' | 'Completed';
  category: string;
  details: string;
}

const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Social Media Marketing Campaign for Eco-Friendly Product Launch',
    description: 'We are launching a new line of eco-friendly home products and need a skilled marketer to design and execute a high-impact social media campaign.',
    skills: ['Marketing', 'Social Media', 'Content Creation', 'SEO', 'Google Ads', 'Influencer Marketing'],
    duration: '2 weeks',
    difficulty: 'Intermediate',
    postedBy: 'GreenLife Innovations',
    budget: '$2,000 - $3,500',
    status: 'Open',
    category: 'Marketing & Advertising',
    details: `
      - Develop a comprehensive social media strategy targeting eco-conscious consumers.
      - Create engaging content (posts, stories, reels) for Instagram, Facebook, and TikTok.
      - Optimize paid ad campaigns on Google Ads and Meta Ads Manager.
      - Collaborate with micro-influencers to promote the product line.
      - Track campaign performance using analytics tools and provide a detailed report with insights and recommendations.
      - Deliverables: 15 social media posts, 3 ad campaigns, and a final performance report.
    `
  },
  {
    id: '2',
    title: 'Financial Analysis Report for Startup’s First-Year Performance',
    description: 'Seeking a finance professional to generate a comprehensive financial analysis report for our startup’s first-year performance.',
    skills: ['Financial Analysis', 'Excel', 'Data Visualization', 'Financial Modeling', 'Forecasting'],
    duration: '1 week',
    difficulty: 'Advanced',
    postedBy: 'Finance Pro LLC',
    budget: '$1,500 - $2,500',
    status: 'Open',
    category: 'Finance & Accounting',
    details: `
      - Gather and analyze financial data from the startup’s first year of operations.
      - Create detailed financial models to forecast future performance.
      - Develop clear and visually appealing data visualizations (charts, graphs, etc.).
      - Provide actionable insights and recommendations for improving profitability and reducing costs.
      - Deliverables: A 10-page report with financial analysis, visualizations, and recommendations.
    `
  },
  {
    id: '3',
    title: 'Graphic Design for Branding Overhaul',
    description: 'Looking for a creative designer to revamp our brand identity and create a cohesive visual language.',
    skills: ['Graphic Design', 'Adobe Photoshop', 'Illustrator', 'Branding', 'Typography'],
    duration: '3 weeks',
    difficulty: 'Intermediate',
    postedBy: 'DesignPro Studio',
    budget: '$1,500 - $3,000',
    status: 'Open',
    category: 'Design & Creative',
    details: `
      - Design a new logo that reflects our brand’s values and mission.
      - Develop a modern color palette and typography system.
      - Create brand guidelines document for consistent use across all platforms.
      - Design templates for social media, email newsletters, and marketing materials.
      - Deliverables: Logo, brand guidelines, and 5 template designs.
    `
  },
  {
    id: '4',
    title: 'AI-Powered Chatbot Development for Customer Support',
    description: 'Seeking an AI developer to create an advanced chatbot for customer support automation.',
    skills: ['AI', 'Machine Learning', 'Python', 'NLP', 'TensorFlow', 'Chatbot Development'],
    duration: '6 weeks',
    difficulty: 'Advanced',
    postedBy: 'AI Solutions Inc.',
    budget: '$5,000 - $8,000',
    status: 'Open',
    category: 'Technology & AI',
    details: `
      - Develop a chatbot capable of handling FAQs, processing orders, and resolving customer queries.
      - Integrate the chatbot with existing CRM and support systems.
      - Train the chatbot using machine learning to improve responses over time.
      - Ensure the chatbot is multilingual and can handle at least 3 languages.
      - Deliverables: Fully functional chatbot, integration with CRM, and a training module.
    `
  },
  {
    id: '5',
    title: 'Content Writing for Tech Blog',
    description: 'Seeking a writer to produce high-quality blog articles on trending tech topics.',
    skills: ['Writing', 'SEO', 'Research', 'Content Strategy', 'Tech Knowledge'],
    duration: '2 weeks',
    difficulty: 'Beginner',
    postedBy: 'Web Solutions Ltd.',
    budget: '$500 - $1,500',
    status: 'Open',
    category: 'Content & Writing',
    details: `
      - Write 10 blog articles (800-1,000 words each) on topics like AI, blockchain, and cybersecurity.
      - Conduct thorough research to ensure accuracy and relevance.
      - Optimize content for SEO to improve search engine rankings.
      - Include visuals (charts, infographics) where necessary.
      - Deliverables: 10 blog posts with SEO optimization and research references.
    `
  },
  {
    id: '6',
    title: 'Cybersecurity Audit for Financial Institution',
    description: 'Seeking a cybersecurity expert to conduct a comprehensive audit of our financial institution’s security systems.',
    skills: ['Cybersecurity', 'Networking', 'Penetration Testing', 'Ethical Hacking', 'Risk Assessment'],
    duration: '4 weeks',
    difficulty: 'Advanced',
    postedBy: 'SecureTech Inc.',
    budget: '$7,000 - $10,000',
    status: 'Open',
    category: 'Cybersecurity & IT',
    details: `
      - Conduct a full security audit, including vulnerability assessments and penetration testing.
      - Identify potential risks and provide mitigation strategies.
      - Review and update existing security policies and protocols.
      - Train staff on best practices for cybersecurity.
      - Deliverables: Audit report, risk assessment, and updated security policies.
    `
  },
  {
    id: '7',
    title: 'Event Planning for Corporate Meetup',
    description: 'Looking for an experienced event planner to coordinate a corporate event for 200+ attendees.',
    skills: ['Event Planning', 'Budgeting', 'Vendor Coordination', 'Logistics', 'Project Management'],
    duration: '6 weeks',
    difficulty: 'Intermediate',
    postedBy: 'Business Connect Co.',
    budget: '$3,000 - $6,000',
    status: 'Open',
    category: 'Events & Hospitality',
    details: `
      - Plan and execute a corporate meetup, including venue selection, catering, and entertainment.
      - Coordinate with vendors for AV equipment, decorations, and transportation.
      - Manage event logistics, including attendee registration and scheduling.
      - Ensure the event stays within budget and meets all client expectations.
      - Deliverables: A seamless event experience with post-event feedback and reports.
    `
  },
  {
    id: '8',
    title: 'E-learning Platform Development',
    description: 'Develop an interactive e-learning platform for students and professionals.',
    skills: ['Web Development', 'UX/UI Design', 'LMS', 'React', 'Node.js'],
    duration: '10 weeks',
    difficulty: 'Advanced',
    postedBy: 'EdTech Solutions',
    budget: '$10,000 - $15,000',
    status: 'Open',
    category: 'Education & E-learning',
    details: `
      - Build a responsive e-learning platform with video integration, quizzes, and progress tracking.
      - Design an intuitive user interface for both students and instructors.
      - Implement a learning management system (LMS) to manage courses and user data.
      - Ensure the platform is scalable and can handle up to 10,000 users.
      - Deliverables: Fully functional e-learning platform with LMS integration.
    `
  },
  {
    id: '9',
    title: 'Mobile App Development for Fitness Tracking',
    description: 'Seeking a mobile app developer to create a fitness tracking app for iOS and Android.',
    skills: ['Mobile Development', 'Flutter', 'Firebase', 'UI/UX Design', 'API Integration'],
    duration: '8 weeks',
    difficulty: 'Advanced',
    postedBy: 'FitTech Solutions',
    budget: '$12,000 - $18,000',
    status: 'Open',
    category: 'Health & Fitness',
    details: `
      - Develop a cross-platform fitness tracking app with features like step counting, calorie tracking, and workout plans.
      - Integrate with wearable devices and third-party APIs for data synchronization.
      - Design a user-friendly interface with personalized dashboards.
      - Ensure the app is secure and complies with data privacy regulations.
      - Deliverables: Fully functional fitness app for iOS and Android.
    `
  },
  {
    id: '10',
    title: 'Market Research for New Product Launch',
    description: 'Conduct market research to identify opportunities for a new product in the health and wellness industry.',
    skills: ['Market Research', 'Data Analysis', 'Survey Design', 'Competitive Analysis', 'Consumer Insights'],
    duration: '3 weeks',
    difficulty: 'Intermediate',
    postedBy: 'HealthWave Inc.',
    budget: '$2,500 - $4,000',
    status: 'Open',
    category: 'Market Research & Analysis',
    details: `
      - Design and conduct surveys to gather consumer insights.
      - Analyze competitors and identify market trends.
      - Provide recommendations for product positioning and pricing.
      - Deliver a detailed report with actionable insights.
      - Deliverables: Market research report with survey results and recommendations.
    `
  },
  {
    id: '11',
    title: 'Video Production for Corporate Training',
    description: 'Seeking a video production team to create a series of training videos for our corporate onboarding program.',
    skills: ['Video Production', 'Scriptwriting', 'Editing', 'Motion Graphics', 'Storyboarding'],
    duration: '4 weeks',
    difficulty: 'Intermediate',
    postedBy: 'Corporate Training Solutions',
    budget: '$5,000 - $8,000',
    status: 'Open',
    category: 'Media & Production',
    details: `
      - Develop a script and storyboard for 5 training videos (10-15 minutes each).
      - Shoot and edit high-quality videos with professional lighting and sound.
      - Add motion graphics and animations to enhance engagement.
      - Deliver videos in multiple formats for web and mobile platforms.
      - Deliverables: 5 training videos with all source files.
    `
  },
  {
    id: '12',
    title: 'Supply Chain Optimization Analysis',
    description: 'Looking for a supply chain expert to analyze and optimize our logistics and distribution processes.',
    skills: ['Supply Chain Management', 'Data Analysis', 'Logistics', 'Process Optimization', 'ERP Systems'],
    duration: '5 weeks',
    difficulty: 'Advanced',
    postedBy: 'Global Logistics Inc.',
    budget: '$6,000 - $9,000',
    status: 'Open',
    category: 'Logistics & Supply Chain',
    details: `
      - Analyze current supply chain processes and identify inefficiencies.
      - Develop optimization strategies to reduce costs and improve delivery times.
      - Implement tracking systems for better inventory management.
      - Provide a detailed report with actionable recommendations.
      - Deliverables: Supply chain optimization report and implementation plan.
    `
  },
  {
    id: '13',
    title: 'E-commerce Website Redesign',
    description: 'Redesign and optimize an existing e-commerce website to improve user experience and increase conversions.',
    skills: ['Web Design', 'UX/UI', 'HTML/CSS', 'JavaScript', 'SEO'],
    duration: '4 weeks',
    difficulty: 'Intermediate',
    postedBy: 'FashionTrends Co.',
    budget: '$4,000 - $6,000',
    status: 'Open',
    category: 'E-commerce & Retail',
    details: `
      - Redesign the website layout to make it more user-friendly and visually appealing.
      - Optimize the site for mobile devices and improve page load speed.
      - Implement SEO best practices to increase organic traffic.
      - Integrate a new payment gateway for smoother transactions.
      - Deliverables: Fully redesigned e-commerce website with improved UX/UI.
    `
  },
  {
    id: '14',
    title: 'Sustainability Consulting for Manufacturing Firm',
    description: 'Provide expert advice on implementing sustainable practices in a manufacturing facility.',
    skills: ['Sustainability', 'Environmental Science', 'Data Analysis', 'Project Management'],
    duration: '6 weeks',
    difficulty: 'Advanced',
    postedBy: 'EcoManufacture Inc.',
    budget: '$8,000 - $12,000',
    status: 'Open',
    category: 'Sustainability & Environment',
    details: `
      - Conduct an audit of current manufacturing processes to identify areas for improvement.
      - Develop a sustainability roadmap with actionable steps to reduce carbon footprint.
      - Recommend renewable energy solutions and waste reduction strategies.
      - Train staff on sustainable practices and compliance with environmental regulations.
      - Deliverables: Sustainability report and implementation plan.
    `
  },
  {
    id: '15',
    title: 'Podcast Production for Tech Startup',
    description: 'Produce a high-quality podcast series to showcase thought leadership in the tech industry.',
    skills: ['Audio Editing', 'Scriptwriting', 'Podcasting', 'Content Strategy', 'Interviewing'],
    duration: '8 weeks',
    difficulty: 'Intermediate',
    postedBy: 'TechTalks Media',
    budget: '$3,000 - $5,000',
    status: 'Open',
    category: 'Media & Entertainment',
    details: `
      - Develop a content strategy and script for 10 podcast episodes.
      - Record and edit high-quality audio with professional equipment.
      - Conduct interviews with industry experts and thought leaders.
      - Distribute the podcast on major platforms (Spotify, Apple Podcasts, etc.).
      - Deliverables: 10 podcast episodes with promotional materials.
    `
  },
  {
    id: '16',
    title: 'AI-Powered Recruitment Tool Development',
    description: 'Develop an AI-driven tool to streamline the recruitment process for HR teams.',
    skills: ['AI', 'Machine Learning', 'Python', 'NLP', 'Web Development'],
    duration: '12 weeks',
    difficulty: 'Advanced',
    postedBy: 'HR Tech Solutions',
    budget: '$15,000 - $25,000',
    status: 'Open',
    category: 'Human Resources & Recruitment',
    details: `
      - Build an AI tool to screen resumes and rank candidates based on job requirements.
      - Integrate natural language processing (NLP) to analyze candidate responses.
      - Develop a dashboard for HR teams to manage recruitment workflows.
      - Ensure compliance with data privacy regulations.
      - Deliverables: Fully functional AI recruitment tool with user documentation.
    `
  },
  {
    id: '17',
    title: 'Interior Design for Co-Working Space',
    description: 'Design a modern and functional interior for a new co-working space.',
    skills: ['Interior Design', 'Space Planning', '3D Rendering', 'Project Management'],
    duration: '5 weeks',
    difficulty: 'Intermediate',
    postedBy: 'WorkHub Spaces',
    budget: '$7,000 - $10,000',
    status: 'Open',
    category: 'Architecture & Interior Design',
    details: `
      - Create a design concept that balances aesthetics and functionality.
      - Develop 3D renderings and floor plans for the co-working space.
      - Select furniture, lighting, and decor that align with the brand’s identity.
      - Oversee the implementation of the design during construction.
      - Deliverables: Design concept, 3D renderings, and final implementation.
    `
  },
  {
    id: '18',
    title: 'Data Analytics Dashboard for Healthcare Provider',
    description: 'Develop a data analytics dashboard to track patient outcomes and operational efficiency.',
    skills: ['Data Analytics', 'Tableau', 'SQL', 'Healthcare Data', 'Data Visualization'],
    duration: '6 weeks',
    difficulty: 'Advanced',
    postedBy: 'HealthMetrics Inc.',
    budget: '$10,000 - $15,000',
    status: 'Open',
    category: 'Healthcare & Medical',
    details: `
      - Collect and analyze healthcare data to identify trends and insights.
      - Design an interactive dashboard using Tableau or Power BI.
      - Include metrics for patient outcomes, staff performance, and resource utilization.
      - Ensure compliance with HIPAA and other healthcare regulations.
      - Deliverables: Fully functional data analytics dashboard with user training.
    `
  },
  {
    id: '19',
    title: 'Crowdfunding Campaign for Social Impact Startup',
    description: 'Plan and execute a crowdfunding campaign to raise funds for a social impact project.',
    skills: ['Crowdfunding', 'Marketing', 'Social Media', 'Content Creation', 'Fundraising'],
    duration: '4 weeks',
    difficulty: 'Intermediate',
    postedBy: 'ImpactForGood',
    budget: '$2,000 - $4,000',
    status: 'Open',
    category: 'Nonprofit & Social Impact',
    details: `
      - Develop a compelling campaign story and messaging.
      - Create engaging content (videos, graphics, and written materials) for the campaign.
      - Promote the campaign on social media and crowdfunding platforms (Kickstarter, Indiegogo, etc.).
      - Monitor campaign performance and provide regular updates to backers.
      - Deliverables: Successful crowdfunding campaign with detailed performance report.
    `
  },
  {
    id: '20',
    title: 'AR-Based Shopping App Development',
    description: 'Develop an augmented reality (AR) app to enhance the online shopping experience.',
    skills: ['AR Development', 'Unity', '3D Modeling', 'Mobile Development', 'UX/UI Design'],
    duration: '10 weeks',
    difficulty: 'Advanced',
    postedBy: 'ShopAR Solutions',
    budget: '$20,000 - $30,000',
    status: 'Open',
    category: 'Technology & Innovation',
    details: `
      - Build an AR app that allows users to visualize products in their environment before purchasing.
      - Integrate 3D models of products into the app.
      - Ensure seamless performance on both iOS and Android devices.
      - Collaborate with the design team to create an intuitive user interface.
      - Deliverables: Fully functional AR shopping app with user documentation.
    `
  },
  {
    id: '21',
    title: 'Crisis Management Plan for Financial Institution',
    description: 'Develop a comprehensive crisis management plan for a financial institution.',
    skills: ['Risk Management', 'Crisis Communication', 'Business Continuity Planning', 'Financial Regulations'],
    duration: '6 weeks',
    difficulty: 'Advanced',
    postedBy: 'SecureFinance Corp.',
    budget: '$12,000 - $18,000',
    status: 'Open',
    category: 'Finance & Risk Management',
    details: `
      - Identify potential risks and vulnerabilities for the institution.
      - Develop a crisis communication plan for internal and external stakeholders.
      - Create a business continuity plan to ensure operations during disruptions.
      - Train staff on crisis response protocols.
      - Deliverables: Crisis management plan and training materials.
    `
  },
  {
    id: '22',
    title: 'Gamified Learning App for Kids',
    description: 'Develop a gamified learning app to help kids aged 6-10 learn math and science concepts.',
    skills: ['Game Development', 'Educational Technology', 'UX/UI Design', 'Mobile Development', 'Animation'],
    duration: '12 weeks',
    difficulty: 'Advanced',
    postedBy: 'EduPlay Innovations',
    budget: '$18,000 - $25,000',
    status: 'Open',
    category: 'Education & EdTech',
    details: `
      - Design and develop an interactive app with gamified learning modules.
      - Include animations and rewards to keep kids engaged.
      - Ensure the app is safe and complies with child privacy regulations (COPPA).
      - Test the app with a group of kids and gather feedback for improvements.
      - Deliverables: Fully functional gamified learning app for iOS and Android.
    `
  }
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  const handleApply = (projectId: string) => {
    alert(`Applied to project ID: ${projectId}`);
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
                transition: 'transform 0.3s ease-in-out',
                boxShadow: theme.shadows[1],
                cursor: 'pointer',
                '&:hover': { boxShadow: theme.shadows[3] }
              }}
              onClick={() => handleOpenProject(project)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip
                    label={project.difficulty}
                    size="small"
                    sx={{ bgcolor: `${difficultyColors[project.difficulty]}15`, color: difficultyColors[project.difficulty] }}
                  />
                  <Chip
                    label={project.status}
                    size="small"
                    sx={{ bgcolor: `${statusColors[project.status]}15`, color: statusColors[project.status] }}
                  />
                </Box>
                
                <Chip
                  label={project.category}
                  size="small"
                  sx={{ bgcolor: '#E0E0E0', color: '#333', mb: 1 }}
                />

                <Typography variant="h6" gutterBottom>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for expanded project details */}
      <Modal
        open={Boolean(selectedProject)}
        onClose={handleCloseProject}
        aria-labelledby="project-details-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Box
          sx={{
            width: '90%',
            maxWidth: 500,
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2,
            boxShadow: theme.shadows[10],
            position: 'relative'
          }}
        >
          {selectedProject && (
            <>
              <IconButton
                sx={{ position: 'absolute', top: 10, right: 10 }}
                onClick={handleCloseProject}
              >
                <CloseIcon />
              </IconButton>
              
              <Typography id="project-details-title" variant="h5" gutterBottom>
                {selectedProject.title}
              </Typography>
              
              <Chip
                label={selectedProject.category}
                size="small"
                sx={{ bgcolor: '#E0E0E0', color: '#333', mb: 1 }}
              />

              <Typography variant="body2" color="text.secondary">
                {selectedProject.details}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <BusinessIcon sx={{ fontSize: 16, mr: 0.5 }} /> {selectedProject.postedBy}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5 }} /> {selectedProject.budget}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} /> {selectedProject.duration}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => handleApply(selectedProject.id)}
              >
                Apply
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
