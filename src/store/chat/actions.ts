import { StateCreator } from 'zustand';
import { ChatState, Message } from './types';

export const createChatActions = (set: any, get: () => ChatState): Omit<ChatState, 'conversations' | 'currentConversationId' | 'isLoading'> => ({
  createNewConversation: () => {
    const conversationId = crypto.randomUUID();
    set((state: ChatState) => ({
      conversations: {
        ...state.conversations,
        [conversationId]: {
          id: conversationId,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      currentConversationId: conversationId,
    }));
    return conversationId;
  },

  switchConversation: (conversationId: string) => {
    set({ currentConversationId: conversationId });
  },

  deleteConversation: (conversationId: string) => {
    set((state: ChatState) => {
      const { [conversationId]: _, ...remainingConversations } = state.conversations;
      return {
        conversations: remainingConversations,
        currentConversationId: state.currentConversationId === conversationId ? null : state.currentConversationId,
      };
    });
  },

  addMessage: (message: Message) => {
    set((state: ChatState) => {
      if (!state.currentConversationId) {
        const conversationId = get().createNewConversation();
        return {
          conversations: {
            ...state.conversations,
            [conversationId]: {
              id: conversationId,
              messages: [message],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        };
      }

      return {
        conversations: {
          ...state.conversations,
          [state.currentConversationId]: {
            ...state.conversations[state.currentConversationId],
            messages: [...state.conversations[state.currentConversationId].messages, message],
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  },

  clearCurrentConversation: () => {
    set((state: ChatState) => {
      if (!state.currentConversationId) return state;
      return {
        conversations: {
          ...state.conversations,
          [state.currentConversationId]: {
            ...state.conversations[state.currentConversationId],
            messages: [],
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}); 