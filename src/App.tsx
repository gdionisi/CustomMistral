import React, { useState, useEffect } from 'react';
import { useChatStore } from './store/chat/store';
import { mistralService } from './services/mistralClient';
import { Message } from './store/chat/types';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

function App() {
  const [input, setInput] = useState('');
  const theme = useTheme();
  const {
    conversations,
    currentConversationId,
    createNewConversation,
    switchConversation,
    deleteConversation,
    addMessage,
    clearCurrentConversation,
    isLoading,
    setLoading,
  } = useChatStore();

  // Create initial conversation if none exists
  useEffect(() => {
    if (!currentConversationId) {
      createNewConversation();
    }
  }, [currentConversationId, createNewConversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const currentMessages = currentConversationId
        ? conversations[currentConversationId].messages
        : [];
      const response = await mistralService.getChatCompletion([...currentMessages, userMessage]);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 320,
          borderRight: 1,
          borderColor: 'divider',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Conversations</Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => createNewConversation()}
          >
            New
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Object.values(conversations)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map((conversation) => (
              <Paper
                key={conversation.id}
                elevation={0}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  bgcolor: conversation.id === currentConversationId ? 'action.selected' : 'transparent',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(conversation.createdAt)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box
                  onClick={() => switchConversation(conversation.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant="body2" noWrap>
                    {conversation.messages[0]?.content.slice(0, 50) || 'New conversation'}
                    {conversation.messages[0]?.content.length > 50 ? '...' : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {conversation.messages.length} messages
                  </Typography>
                </Box>
              </Paper>
            ))}
        </Box>
      </Paper>

      {/* Main chat area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {currentConversationId &&
            conversations[currentConversationId].messages.map((message, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                  color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {message.role === 'user' ? 'You:' : 'Assistant:'}
                </Typography>
                <Typography variant="body1">{message.content}</Typography>
              </Paper>
            ))}
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <LoadingButton
              type="submit"
              loading={isLoading}
              variant="contained"
              endIcon={<SendIcon />}
              disabled={!input.trim()}
            >
              Send
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App; 