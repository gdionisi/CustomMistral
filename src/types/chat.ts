export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  id: string;
  isKnowledge?: boolean;
  needsWebSearch?: boolean;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  conversations: Record<string, Conversation>;
  currentConversationId: string | null;
  isLoading: boolean;
  createNewConversation: () => string;
  switchConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  addMessage: (message: Message) => Message;
  flagAsKnowledge: (messageId: string) => void;
  clearCurrentConversation: () => void;
  setLoading: (loading: boolean) => void;
}

export interface ChatResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface KnowledgeItem {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  sourceConversationId: string;
  sourceMessageId: string;
}

export interface KnowledgeState {
  items: KnowledgeItem[];
  addKnowledge: (content: string, sourceConversationId: string, sourceMessageId: string) => void;
  removeKnowledge: (id: string) => void;
  updateKnowledge: (id: string, content: string) => void;
  getKnowledge: () => KnowledgeItem[];
} 