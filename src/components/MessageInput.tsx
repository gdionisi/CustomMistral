import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { mistralService } from '../services/mistralClient';
import { useChatStore } from 'store/chatStore';

export const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [needsWebSearch, setNeedsWebSearch] = useState(false);

  const {
    conversations,
    currentConversationId,
    addMessage,
    isLoading,
    setLoading,
  } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: input,
      timestamp: new Date().toISOString(),
      needsWebSearch: needsWebSearch,
    };

    addMessage(userMessage);
    setInput('');
    setNeedsWebSearch(false);
    setLoading(true);

    try {
      const currentMessages = currentConversationId
        ? conversations[currentConversationId].messages
        : [];
      const response = await mistralService.getChatCompletion([...currentMessages, userMessage]);
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'sticky',
        bottom: 0,
        width: '100%',
        zIndex: 1,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
        <FormControlLabel
          control={
            <Checkbox
              checked={needsWebSearch}
              onChange={(e) => setNeedsWebSearch(e.target.checked)}
              disabled={isLoading}
            />
          }
          label="Include web search results"
        />
      </Box>
    </Box>
  );
}; 