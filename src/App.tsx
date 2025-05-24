import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';

function App() {
  const [sidebarTab, setSidebarTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSidebarTab(newValue);
  };

  const handleSwitchToKnowledge = () => {
    setSidebarTab(1); // Switch to Knowledge tab
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar sidebarTab={sidebarTab} onTabChange={handleTabChange} />
      <ChatArea onSwitchToKnowledge={handleSwitchToKnowledge} />
    </Box>
  );
}

export default App; 