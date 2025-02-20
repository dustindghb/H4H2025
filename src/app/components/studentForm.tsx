"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
  FormHelperText,
  CircularProgress,
} from "@mui/material";

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
      "Research and investigation",
    ],
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
      "In different locations (traveling)",
    ],
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
      "Building something of your own",
    ],
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
      "Environmental and Sustainability",
    ],
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
      "Through creative exploration",
    ],
  },
];

const theme = createTheme({
  palette: {
    primary: {
      main: "#896ED1",
      light: "#A08FDA",
      dark: "#6F4DC7",
      contrastText: "#FFFFFF",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#7B5ECD",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#896ED1",
          "&.Mui-checked": {
            color: "#896ED1",
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          "&.Mui-active": {
            color: "#896ED1",
          },
          "&.Mui-completed": {
            color: "#896ED1",
          },
        },
      },
    },
  },
});

export const StudentForm = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [selections, setSelections] = useState<{ [key: string]: string[] }>(
    formSections.reduce((acc, section) => ({ ...acc, [section.title]: [] }), {})
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleCheckboxChange = (section: string, option: string) => {
    setError(null);
    const currentSelections = [...selections[section]];
    const maxSelections = formSections.find(
      (s) => s.title === section
    )?.maxSelections;

    if (currentSelections.includes(option)) {
      setSelections({
        ...selections,
        [section]: currentSelections.filter((item) => item !== option),
      });
    } else {
      if (maxSelections && currentSelections.length >= maxSelections) {
        setError(`Please select only ${maxSelections} options`);
        return;
      }
      setSelections({
        ...selections,
        [section]: [...currentSelections, option],
      });
    }
  };

  const handleNext = () => {
    const currentSection = formSections[activeStep];
    const currentSelections = selections[currentSection.title];

    if (
      currentSection.maxSelections &&
      currentSelections.length !== currentSection.maxSelections
    ) {
      setError(`Please select exactly ${currentSection.maxSelections} options`);
      return;
    }

    if (currentSelections.length === 0) {
      setError("Please select at least one option");
      return;
    }

    setActiveStep((prev) => prev + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitStatus("idle");

      const formData = {
        type: "student",
        data: {
          skills:
            selections["Skills and Strengths"].length > 0
              ? selections["Skills and Strengths"]
              : [""],
          workEnvironments:
            selections["Work Environment Preferences"].length > 0
              ? selections["Work Environment Preferences"]
              : [""],
          coreValues:
            selections["Core Values and Motivations"].length > 0
              ? selections["Core Values and Motivations"].join(", ")
              : "",
          industryInterests:
            selections["Industry Interests"].length > 0
              ? selections["Industry Interests"]
              : [""],
          learningStyles:
            selections["Learning Style and Growth"].length > 0
              ? selections["Learning Style and Growth"]
              : [""],
          updatedAt: new Date().toISOString(),
        },
      };

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSubmitStatus("success");

      // Wait a moment to show success message before redirecting
      setTimeout(() => {
        router.push("/dashboard/student");
      }, 1500);
    } catch (err) {
      setSubmitStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            background: theme.palette.background.paper,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Career Profile
          </Typography>

          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              "& .MuiStepLabel-root .Mui-completed": {
                color: theme.palette.primary.main,
              },
              "& .MuiStepLabel-root .Mui-active": {
                color: theme.palette.primary.main,
              },
            }}
          >
            {formSections.map((section) => (
              <Step key={section.title}>
                <StepLabel>{section.title}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep < formSections.length ? (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {formSections[activeStep].title}
              </Typography>

              {formSections[activeStep].maxSelections && (
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mb: 2 }}
                >
                  Select your top {formSections[activeStep].maxSelections}{" "}
                  choices
                </Typography>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {submitStatus === "success" && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Profile submitted successfully!
                </Alert>
              )}

              <FormControl
                component="fieldset"
                variant="standard"
                sx={{ width: "100%" }}
              >
                <FormGroup>
                  {formSections[activeStep].options.map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={selections[
                            formSections[activeStep].title
                          ].includes(option)}
                          onChange={() =>
                            handleCheckboxChange(
                              formSections[activeStep].title,
                              option
                            )
                          }
                          sx={{
                            "&.Mui-checked": {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: "1rem" }}>
                          {option}
                        </Typography>
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </FormGroup>
                <FormHelperText sx={{ mt: 1 }}>
                  Selected: {selections[formSections[activeStep].title].length}
                  {formSections[activeStep].maxSelections &&
                    ` / ${formSections[activeStep].maxSelections}`}
                </FormHelperText>
              </FormControl>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{
                    borderRadius: 1,
                    textTransform: "none",
                    px: 4,
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    borderRadius: 1,
                    textTransform: "none",
                    px: 4,
                  }}
                >
                  Next
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                All steps completed!
              </Typography>

              {submitStatus === "success" && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Profile submitted successfully!
                </Alert>
              )}

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  mt: 2,
                  borderRadius: 1,
                  textTransform: "none",
                  px: 4,
                  minWidth: 200,
                }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <span>Submitting...</span>
                  </Box>
                ) : (
                  "Submit Profile"
                )}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default StudentForm;
