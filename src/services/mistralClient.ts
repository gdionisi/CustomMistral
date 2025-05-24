import { Mistral } from '@mistralai/mistralai';
import { Message } from '../types/chat';
import { useKnowledgeStore } from '../store/knowledgeStore';
import { searchService, SearchResult } from './searchService';

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
      
      // Check if the last message needs web search
      const lastMessage = messages[messages.length - 1];
      let searchResults = '';
      
      if (lastMessage.role === 'user' && lastMessage.needsWebSearch) {
        try {
          const results = await searchService.search(lastMessage.content);
          searchResults = this.formatSearchResults(results);
        } catch (error) {
          console.error('Error getting search results:', error);
        }
      }

      // Create a system message that includes the knowledge and search results
      const systemMessage = {
        role: 'system' as const,
        content: [
          knowledgeItems.length > 0
            ? `Important knowledge to consider in your responses:\n${knowledgeItems.map(item => `- ${item.content}`).join('\n')}`
            : 'You are a helpful AI assistant.',
          searchResults ? `\nRelevant web search results:\n${searchResults}` : '',
        ].filter(Boolean).join('\n\n')
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

  private formatSearchResults(results: SearchResult[]): string {
    return results.map((result, index) => 
      `${index + 1}. ${result.title}\n   ${result.snippet}\n   Source: ${result.link}`
    ).join('\n\n');
  }
}

export const mistralService = new MistralService(); 