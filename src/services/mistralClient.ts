import { Mistral } from '@mistralai/mistralai';
import { Message } from '../types/chat';

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
      const response = await this.client.chat.complete({
        model: this.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      return response.choices?.[0]?.message.content?.toString() || '';
    } catch (error) {
      console.error('Error getting chat completion:', error);
      throw new Error('Failed to get response from Mistral AI');
    }
  }
}

export const mistralService = new MistralService(); 