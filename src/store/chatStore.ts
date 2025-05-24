import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatState, Message } from '../types/chat';
import { useKnowledgeStore } from './knowledgeStore';

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: {},
      currentConversationId: null,
      currentMessages: [],
      isLoading: false,

      createNewConversation: () => {
        const conversationId = crypto.randomUUID();
        set((state) => ({
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
          currentMessages: [],
        }));
        return conversationId;
      },

      switchConversation: (conversationId: string) => {
        set((state) => ({
          currentConversationId: conversationId,
          currentMessages: state.conversations[conversationId].messages,
        }));
      },

      deleteConversation: (conversationId: string) => {
        set((state) => {
          const { [conversationId]: _, ...remainingConversations } = state.conversations;
          return {
            conversations: remainingConversations,
            currentConversationId: state.currentConversationId === conversationId ? null : state.currentConversationId,
          };
        });
      },

      addMessage: (message: Message) => {
        const messageWithId = {
          ...message,
          id: crypto.randomUUID(),
        };

        set((state) => {
          if (!state.currentConversationId) {
            const conversationId = get().createNewConversation();
            return {
              conversations: {
                ...state.conversations,
                [conversationId]: {
                  id: conversationId,
                  messages: [messageWithId],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              },
              currentMessages: [...state.currentMessages,  messageWithId],
            };
          }

          return {
            conversations: {
              ...state.conversations,
              [state.currentConversationId]: {
                ...state.conversations[state.currentConversationId],
                messages: [...state.conversations[state.currentConversationId].messages, messageWithId],
                updatedAt: new Date().toISOString(),
              },
            },
            currentMessages: [...state.currentMessages,  messageWithId],
          };
        });

        return messageWithId;
      },

      flagAsKnowledge: (messageId: string) => {
        const state = get();
        if (!state.currentConversationId) return;

        const conversation = state.conversations[state.currentConversationId];
        const message = conversation.messages.find((m) => m.id === messageId);
        
        if (message) {
          // Add to knowledge store
          useKnowledgeStore.getState().addKnowledge(
            message.content,
            state.currentConversationId,
            messageId
          );
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'chat-storage',
    }
  )
); 