import React from 'react';
import { useKnowledgeStore } from '../store/knowledgeStore';
import { KnowledgeItem } from '../types/chat';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export const KnowledgeManager: React.FC = () => {
  const { items, removeKnowledge, updateKnowledge } = useKnowledgeStore();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editContent, setEditContent] = React.useState('');

  const handleEdit = (item: KnowledgeItem) => {
    setEditingId(item.id);
    setEditContent(item.content);
  };

  const handleSave = (id: string) => {
    updateKnowledge(id, editContent);
    setEditingId(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Important Knowledge</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item) => (
          <Paper
            key={item.id}
            elevation={0}
            sx={{
              p: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            {editingId === item.id ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  multiline
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSave(item.id)}
                    size="small"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => setEditingId(null)}
                    size="small"
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">{item.content}</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Tooltip title="Edit knowledge">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(item)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete knowledge">
                    <IconButton
                      size="small"
                      onClick={() => removeKnowledge(item.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    Added: {new Date(item.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        ))}
        {items.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No important knowledge items yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}; 