export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

class SearchService {
  async search(query: string): Promise<SearchResult[]> {
    try {
      // DuckDuckGo Instant Answer API
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
      );
      
      const data = await response.json();
      
      // Combine the abstract (if available) with related topics
      const results: SearchResult[] = [];
      
      if (data.Abstract) {
        results.push({
          title: data.Heading || 'Summary',
          link: data.AbstractSource || '',
          snippet: data.Abstract
        });
      }
      
      // Add related topics
      if (data.RelatedTopics) {
        data.RelatedTopics.forEach((topic: any) => {
          if (topic.Text) {
            results.push({
              title: topic.Text.split(' - ')[0] || 'Related Topic',
              link: topic.FirstURL || '',
              snippet: topic.Text
            });
          }
        });
      }
      
      return results.slice(0, 5); // Limit to 5 results
    } catch (error) {
      console.error('Error performing web search:', error);
      throw new Error('Failed to perform web search');
    }
  }
}

export const searchService = new SearchService(); 