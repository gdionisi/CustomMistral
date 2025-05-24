import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import { Message } from 'types/chat';

interface MessageCardProps {
  message: Message;
  onFlagAsKnowledge: (id: string) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message, onFlagAsKnowledge }) => {
  return (
    <Paper
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
              onClick={() => onFlagAsKnowledge(message.id)}
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
  );
}; 