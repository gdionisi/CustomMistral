import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { ChatInterface } from './components/ChatInterface';
import { ApiKeyInput } from './components/ApiKeyInput';
import { useApiKeyStore } from './store/apiKeyStore';
import { mistralService } from './services/mistralClient';

function App() {
    const apiKey = useApiKeyStore((state) => state.apiKey);

    useEffect(() => {
        if (apiKey) {
            console.log("🚀 ~ App ~ apiKey:", apiKey)
            mistralService.initializeClient(apiKey);
        }
    }, [apiKey]);

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {!apiKey ? <ApiKeyInput /> : <ChatInterface />}
        </Box>
    );
}

export default App; 