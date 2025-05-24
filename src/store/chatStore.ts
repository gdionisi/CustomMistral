import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatState, Message } from '../types/chat';

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      addMessage: (message: Message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      clearMessages: () => set({ messages: [] }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'chat-storage',
    }
  )
); 