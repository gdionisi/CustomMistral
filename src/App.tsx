import React, { useState, useEffect } from 'react';
import { useChatStore } from './store/chatStore';
import { mistralService } from './services/mistralClient';
import { Message } from './types/chat';

function App() {
  const [input, setInput] = useState('');
  const {
    conversations,
    currentConversationId,
    createNewConversation,
    switchConversation,
    deleteConversation,
    addMessage,
    clearCurrentConversation,
    isLoading,
    setLoading,
  } = useChatStore();

  // Create initial conversation if none exists
  useEffect(() => {
    if (!currentConversationId) {
      createNewConversation();
    }
  }, [currentConversationId, createNewConversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const currentMessages = currentConversationId
        ? conversations[currentConversationId].messages
        : [];
      const response = await mistralService.getChatCompletion([...currentMessages, userMessage]);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-border p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Conversations</h2>
          <button
            onClick={() => createNewConversation()}
            className="px-3 py-1 bg-surface text-text-primary border border-border rounded hover:bg-opacity-80"
          >
            New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {Object.values(conversations)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer ${
                  conversation.id === currentConversationId
                    ? 'bg-surface border border-border'
                    : 'hover:bg-surface/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-text-secondary">
                    {formatDate(conversation.createdAt)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    🗑️
                  </button>
                </div>
                <div
                  onClick={() => switchConversation(conversation.id)}
                  className="text-sm"
                >
                  {conversation.messages[0]?.content.slice(0, 50) || 'New conversation'}
                  {conversation.messages[0]?.content.length > 50 ? '...' : ''}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  {conversation.messages.length} messages
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentConversationId &&
            conversations[currentConversationId].messages.map((message, index) => (
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

        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
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