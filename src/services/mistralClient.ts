import { Mistral } from '@mistralai/mistralai';
import { Message } from '../types/chat';
import { useKnowledgeStore } from '../store/knowledgeStore';

const MISTRAL_API_KEY = process.env.REACT_APP_MISTRAL_API_KEY || '';
const DEFAULT_MODEL = 'mistral-small';

class MistralService {
  private client: Mistral;
  private model: string;

  constructor() {
    this.client = new Mistral({
      apiKey: MISTRAL_API_KEY,
    });
    this.model = DEFAULT_MODEL;
  }

  async getChatCompletion(messages: Message[]): Promise<string> {
    try {
      // Get all knowledge items
      const knowledgeItems = useKnowledgeStore.getState().getKnowledge();
      
      // Create a system message that includes the knowledge
      const systemMessage = {
        role: 'system' as const,
        content: knowledgeItems.length > 0
          ? `Important knowledge to consider in your responses:\n${knowledgeItems.map(item => `- ${item.content}`).join('\n')}`
          : 'You are a helpful AI assistant.'
      };

      const response = await this.client.chat.complete({
        model: this.model,
        messages: [systemMessage, ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))]
      });

      return response.choices?.[0]?.message.content?.toString() || '';
    } catch (error) {
      console.error('Error getting chat completion:', error);
      throw new Error('Failed to get response from Mistral AI');
    }
  }
}

export const mistralService = new MistralService(); 