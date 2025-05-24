import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
} from '@mui/material';
import { useApiKeyStore } from '../store/apiKeyStore';

export const ApiKeyInput: React.FC = () => {
    const [input, setInput] = useState('');
    const { setApiKey } = useApiKeyStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setApiKey(input.trim());
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    maxWidth: 400,
                    width: '100%',
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    Enter Your Mistral API Key
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Your API key will be stored securely in your browser's local storage.
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="API Key"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type="password"
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={!input.trim()}
                    >
                        Save API Key
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}; 