export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
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
  addMessage: (message: Message) => void;
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