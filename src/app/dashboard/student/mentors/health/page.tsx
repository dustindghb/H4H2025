'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography,
  CircularProgress,
  Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const LoadingMessage = ({ color }: { color: string }) => (
  <Box
    sx={{
      alignSelf: 'flex-start',
      p: 2,
      bgcolor: '#f5f5f5',
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 2
    }}
  >
    <CircularProgress size={20} sx={{ color }} />
    <Typography color="text.secondary">
      Generating response...
    </Typography>
  </Box>
);

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const MENTOR_COLOR = '#0097A7';
const MENTOR_TITLE = 'Healthcare Career Mentor';
const MENTOR_DESCRIPTION = 'Ask questions about healthcare careers, medical fields, or industry trends...';
const API_ENDPOINT = '/api/chat-health';

export default function HealthMentorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          threadId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      if (data.threadId) {
        setThreadId(data.threadId);
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 3,
        p: 2,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Avatar 
          sx={{ 
            bgcolor: MENTOR_COLOR,
            width: 56,
            height: 56
          }}
        >
          <HealthAndSafetyIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Box>
          <Typography variant="h5" gutterBottom>
            {MENTOR_TITLE}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {MENTOR_DESCRIPTION}
          </Typography>
        </Box>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          height: 'calc(100vh - 250px)',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'white',
          borderRadius: 2,
        }}
      >
        <Box sx={{ 
          p: 2, 
          flexGrow: 1, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Start chatting with your healthcare mentor
          </Typography>

          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                backgroundColor: message.role === 'user' ? MENTOR_COLOR : '#f5f5f5',
                color: message.role === 'user' ? 'white' : 'black',
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography>{message.content}</Typography>
            </Box>
          ))}
          
          {isLoading && <LoadingMessage color={MENTOR_COLOR} />}
          
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={MENTOR_DESCRIPTION}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: MENTOR_COLOR,
                  },
                  '&:hover fieldset': {
                    borderColor: MENTOR_COLOR,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: MENTOR_COLOR,
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                bgcolor: MENTOR_COLOR,
                '&:hover': {
                  bgcolor: MENTOR_COLOR,
                  filter: 'brightness(0.9)',
                },
                minWidth: 100
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                <SendIcon />
              )}
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}