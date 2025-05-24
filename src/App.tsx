import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useChatStore } from 'store/chatStore';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';

function App() {
  const [sidebarTab, setSidebarTab] = useState(0);
  const { currentConversationId, createNewConversation } = useChatStore();

  // Create initial conversation if none exists
  useEffect(() => {
    if (!currentConversationId) {
      createNewConversation();
    }
  }, [currentConversationId, createNewConversation]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSidebarTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar sidebarTab={sidebarTab} onTabChange={handleTabChange} />
      <ChatArea />
    </Box>
  );
}

export default App; 