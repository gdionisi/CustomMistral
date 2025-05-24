import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useChatStore } from 'store/chatStore';
import { MessageInput } from './MessageInput';
import { MessageCard } from './MessageCard';

export const ChatArea: React.FC = () => {
  const {
    conversations,
    currentConversationId,
    flagAsKnowledge,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = currentConversationId
    ? conversations[currentConversationId].messages
    : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]); // Scroll when messages change

  return (
    <Box 
      sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        ml: '320px', // Match sidebar width
        height: '100vh',
      }}
    >
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
        }}
      >
        {currentMessages.map((message, index) => (
          <MessageCard
            key={index}
            message={message}
            onFlagAsKnowledge={flagAsKnowledge}
          />
        ))}
        <div ref={messagesEndRef} /> {/* Invisible element at the bottom */}
      </Box>
      <MessageInput />
    </Box>
  );
}; 