import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiKeyState {
    apiKey: string | null;
    setApiKey: (apiKey: string) => void;
    clearApiKey: () => void;
}

export const useApiKeyStore = create<ApiKeyState>()(
    persist(
        (set) => ({
            apiKey: null,
            setApiKey: (apiKey: string) => set({ apiKey }),
            clearApiKey: () => set({ apiKey: null }),
        }),
        {
            name: 'api-key-storage',
        }
    )
); 