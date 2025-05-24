import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatState } from './types';
import { createChatActions } from './actions';

const initialState: Pick<ChatState, 'conversations' | 'currentConversationId' | 'isLoading'> = {
  conversations: {},
  currentConversationId: null,
  isLoading: false,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      ...initialState,
      ...createChatActions(set, get),
    }),
    {
      name: 'chat-storage',
    }
  )
); 