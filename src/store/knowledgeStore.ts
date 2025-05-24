import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KnowledgeState, KnowledgeItem } from '../types/chat';

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    (set, get) => ({
      items: [],

      addKnowledge: (content: string, sourceConversationId: string, sourceMessageId: string) => {
        const newItem: KnowledgeItem = {
          id: crypto.randomUUID(),
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sourceConversationId,
          sourceMessageId,
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      removeKnowledge: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateKnowledge: (id: string, content: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, content, updatedAt: new Date().toISOString() }
              : item
          ),
        }));
      },

      getKnowledge: () => {
        return get().items;
      },
    }),
    {
      name: 'knowledge-storage',
    }
  )
); 