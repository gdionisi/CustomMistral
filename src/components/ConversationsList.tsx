import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useChatStore } from 'store/chatStore';

export const ConversationsList: React.FC = () => {
  const {
    conversations,
    currentConversationId,
    createNewConversation,
    switchConversation,
    deleteConversation,
  } = useChatStore();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
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
  );
}; 