import React, { useState, useEffect } from 'react';
import { mistralService } from './services/mistralClient';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Divider,
  useTheme,
  Tooltip,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import FlagIcon from '@mui/icons-material/Flag';
import LoadingButton from '@mui/lab/LoadingButton';
import { Message } from 'types/chat';
import { useChatStore } from 'store/chatStore';
import { KnowledgeManager } from './components/KnowledgeManager';
import SearchIcon from '@mui/icons-material/Search';

function App() {
  const [input, setInput] = useState('');
  const [sidebarTab, setSidebarTab] = useState(0);
  const [needsWebSearch, setNeedsWebSearch] = useState(false);
  const theme = useTheme();

  const {
    conversations,
    currentConversationId,
    createNewConversation,
    switchConversation,
    deleteConversation,
    addMessage,
    isLoading,
    setLoading,
    flagAsKnowledge,
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
      id: crypto.randomUUID(),
      role: 'user',
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
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSidebarTab(newValue);
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
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
        }}
      >
        <Tabs
          value={sidebarTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Chats" />
          <Tab label="Knowledge" />
        </Tabs>

        {sidebarTab === 0 ? (
          // Conversations Tab
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
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
          </Box>
        ) : (
          // Knowledge Tab
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <KnowledgeManager />
          </Box>
        )}
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
                  position: 'relative',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="subtitle2">
                    {message.role === 'user' ? 'You:' : 'Assistant:'}
                  </Typography>
                  {message.role === 'assistant' && (
                    <Tooltip title={message.isKnowledge ? "This is important knowledge" : "Flag as important knowledge"}>
                      <IconButton
                        size="small"
                        onClick={() => flagAsKnowledge(message.id)}
                        sx={{
                          color: message.isKnowledge ? 'warning.main' : 'inherit',
                          '&:hover': {
                            color: 'warning.main',
                          },
                        }}
                      >
                        <FlagIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
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
                  icon={<SearchIcon />}
                  checkedIcon={<SearchIcon />}
                  disabled={isLoading}
                />
              }
              label="Include web search results"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App; 