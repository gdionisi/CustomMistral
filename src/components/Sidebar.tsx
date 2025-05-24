import React from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { ConversationsList } from './ConversationsList';
import { KnowledgeManager } from './KnowledgeManager';

interface SidebarProps {
  sidebarTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const SIDEBAR_WIDTH = 320;

export const Sidebar: React.FC<SidebarProps> = ({ sidebarTab, onTabChange }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: SIDEBAR_WIDTH,
        height: '100vh',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Tabs
        value={sidebarTab}
        onChange={onTabChange}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Chats" />
        <Tab label="Knowledge" />
      </Tabs>

      {sidebarTab === 0 ? (
        <ConversationsList />
      ) : (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <KnowledgeManager />
        </Box>
      )}
    </Paper>
  );
}; 