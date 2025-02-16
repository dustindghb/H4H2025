"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";
const { useSession } = createAuthClient();

interface UserSessionResponse {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    type: string | null;
  };
  session: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    type: string | null;
  };
}

export default function LandingPage() {
  const { data: session, isPending, error } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const checkUserType = async () => {
      if (!session) {
        console.log('No session found');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching user session...');
        const response = await fetch('/api/user/session');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user session');
        }

        const data: UserSessionResponse = await response.json();
        console.log('User response:', data);
        console.log('User type:', data.user.type);
        
        if (data.user.type === 'student' || data.user.type === 'professional') {
          console.log(`User type found: ${data.user.type}, redirecting...`);
          await router.push(`/dashboard/${data.user.type}`);
          return;
        } else {
          console.log('No valid user type found');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error checking user type:', error);
        setIsLoading(false);
      }
    };

    if (!isPending) {
      if (session) {
        checkUserType();
      } else {
        router.push("/auth/signin");
      }
    }
  }, [session, isPending, router]);

  const handleSelection = async (type: "student" | "professional") => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/user/type', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user type');
      }

      router.push(`/dashboard/${type}`);
    } catch (error) {
      console.error('Error updating user type:', error);
      setIsLoading(false);
    }
  };

  if (isLoading || isPending) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#9575CD" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F5F5F5",
        gap: 3,
        p: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
          width: "100%",
          bgcolor: "white",
          borderRadius: 2,
          p: 4,
          boxShadow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {/* Bot Avatar */}
        <Box
          sx={{
            width: 100,
            height: 100,
            position: "relative",
            bgcolor: "#E8E3F7",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="60" height="60" rx="12" fill="#E8E3F7" />
            <rect x="12" y="20" width="36" height="20" rx="10" fill="#4A4458" />
            <circle cx="24" cy="30" r="4" fill="white" />
            <circle cx="36" cy="30" r="4" fill="white" />
            <path
              d="M20 36C20 36 24 40 30 40C36 40 40 36 40 36"
              stroke="#40F877"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </Box>

        {/* Welcome Text */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Hi, I am Vira.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Are you a professional looking to share your experience or a student
            looking for advice?
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: 300,
          }}
        >
          <Button
            variant="contained"
            onClick={() => handleSelection("student")}
            sx={{
              bgcolor: "#9575CD",
              "&:hover": {
                bgcolor: "#7E57C2",
              },
              py: 1.5,
              borderRadius: "full",
            }}
          >
            Student
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSelection("professional")}
            sx={{
              bgcolor: "#9575CD",
              "&:hover": {
                bgcolor: "#7E57C2",
              },
              py: 1.5,
              borderRadius: "full",
            }}
          >
            Professional
          </Button>
        </Box>
      </Box>
    </Box>
  );
}