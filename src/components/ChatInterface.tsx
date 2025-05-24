import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';

export const ChatInterface: React.FC = () => {
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
}; 