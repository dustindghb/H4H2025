"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Link as MuiLink,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SchoolIcon from "@mui/icons-material/School";

interface AuthError {
  message: string;
  code?: string;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const steps = ["Create Account", "Complete Profile", "Start Learning"];

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await authClient.signIn.social(
        {
          provider: "google",
        },
        { onSuccess: () => router.push("/") }
      );

      if (result.error) {
        setError(result.error.message || "Failed to sign up with Google");
        return;
      }
    } catch (err) {
      const error = err as AuthError;
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <AutoStoriesIcon
              sx={{
                fontSize: 40,
                color: "primary.main",
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                backgroundClip: "text",
                textFillColor: "transparent",
              }}
            >
              Vera AI
            </Typography>
          </Box>

          <Typography variant="h5" component="h2" gutterBottom>
            Start Your Learning Journey
          </Typography>

          <Box sx={{ width: "100%", mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box sx={{ mb: 4, textAlign: "center" }}>
            <SchoolIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Join thousands of students already learning with their
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              personal AI mentor
            </Typography>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            sx={{
              py: 1.5,
              color: "text.primary",
              borderColor: "grey.300",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "grey.50",
                borderColor: "grey.400",
              },
            }}
          >
            {isLoading ? "Creating account..." : "Sign up with Google"}
          </Button>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link href="/auth/signin" passHref>
                <MuiLink component="span" sx={{ cursor: "pointer" }}>
                  Sign in
                </MuiLink>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
