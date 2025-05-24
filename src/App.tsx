import React, { useState } from 'react';
import { useChatStore } from './store/chatStore';
import { mistralService } from './services/mistralClient';
import { Message } from './types/chat';

function App() {
  const [input, setInput] = useState('');
  const { messages, addMessage, clearMessages, isLoading, setLoading } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const response = await mistralService.getChatCompletion([...messages, userMessage]);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🤖 Custom Mistral Chat</h1>
          <button
            onClick={clearMessages}
            className="px-4 py-2 bg-surface text-text-primary border border-border rounded hover:bg-opacity-80"
          >
            Clear Conversation
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg ${
                message.role === 'user'
                  ? 'bg-surface ml-4'
                  : 'bg-surface border border-border mr-4'
              }`}
            >
              <div className="font-bold mb-2">
                {message.role === 'user' ? 'You:' : 'Assistant:'}
              </div>
              <div className="text-text-secondary">{message.content}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="sticky bottom-0">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 p-4 bg-surface text-text-primary border border-border rounded focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-4 bg-surface text-text-primary border border-border rounded hover:bg-opacity-80 disabled:opacity-50"
            >
              {isLoading ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App; 