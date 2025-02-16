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
import ComputerIcon from '@mui/icons-material/Computer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function CSMentorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to API
      const response = await fetch('/api/chat-cs', {
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
      
      // Save threadId for future messages
      if (data.threadId) {
        setThreadId(data.threadId);
      }

      // Add assistant's response to chat
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Optionally add error message to chat
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
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
            bgcolor: '#1565C0',
            width: 56,
            height: 56
          }}
        >
          <ComputerIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Box>
          <Typography variant="h5" gutterBottom>
            Computer Science Mentor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ask questions about CS careers, technologies, and development paths
          </Typography>
        </Box>
      </Box>

      {/* Chat Container */}
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
        {/* Messages Area */}
        <Box sx={{ 
          p: 2, 
          flexGrow: 1, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Start chatting with your CS career mentor
          </Typography>

          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                backgroundColor: message.role === 'user' ? '#1565C0' : '#f5f5f5',
                color: message.role === 'user' ? 'white' : 'black',
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography>{message.content}</Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about CS careers, skills, or technologies..."
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#1565C0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1565C0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1565C0',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                bgcolor: '#1565C0',
                '&:hover': {
                  bgcolor: '#1976D2',
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