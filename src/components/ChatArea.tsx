import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useChatStore } from 'store/chatStore';
import { MessageInput } from './MessageInput';
import { MessageCard } from './MessageCard';
import { SIDEBAR_WIDTH } from './Sidebar';

interface ChatAreaProps {
  onSwitchToKnowledge: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ onSwitchToKnowledge }) => {
  const {
    currentMessages,
    flagAsKnowledge,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]); // Scroll when messages change

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
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
            onSave={onSwitchToKnowledge}
          />
        ))}
        <div ref={messagesEndRef} /> {/* Invisible element at the bottom */}
      </Box>
      <MessageInput />
    </Box>
  );
}; 