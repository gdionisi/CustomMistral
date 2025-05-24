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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

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
      {message.role === 'assistant' ? (
        <Box sx={{ 
          '& pre': { 
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            padding: 2,
            borderRadius: 1,
            overflowX: 'auto',
          },
          '& code': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            padding: '0.2em 0.4em',
            borderRadius: 1,
            fontSize: '0.9em',
          },
          '& pre code': {
            backgroundColor: 'transparent',
            padding: 0,
          },
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: 1,
          },
          '& th, & td': {
            border: '1px solid rgba(0, 0, 0, 0.1)',
            padding: '0.5em',
          },
          '& th': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
        }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const {children, className, node, ...rest} = props
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  //@ts-ignore
                  <SyntaxHighlighter
                    {...rest}
                    PreTag="div"
                    children={String(children).replace(/\n$/, '')}
                    language={match[1]}
                    style={atomDark}
                  />
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                )
              }
            }}
            >
            {message.content}
          </ReactMarkdown>
        </Box>
      ) : (
        <Typography variant="body1">{message.content}</Typography>
      )}
    </Paper>
  );
}; 