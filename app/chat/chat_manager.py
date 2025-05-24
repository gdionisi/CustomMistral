from mistralai import Mistral
from mistralai.models import Messages, UserMessage, AssistantMessage
from utils.config import MISTRAL_API_KEY, DEFAULT_MODEL, MAX_HISTORY_LENGTH
import json
import os
from datetime import datetime

class ChatManager:
    def __init__(self):
        self.client = Mistral(api_key=MISTRAL_API_KEY)
        self.model = DEFAULT_MODEL
        self.conversation_history = []
        self.memory_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "memory", "conversations.json")
        self._load_memory()

    def _load_memory(self):
        """Load conversation history from memory file"""
        if os.path.exists(self.memory_file):
            with open(self.memory_file, 'r') as f:
                self.conversation_history = json.load(f)

    def _save_memory(self):
        """Save conversation history to memory file"""
        with open(self.memory_file, 'w') as f:
            json.dump(self.conversation_history, f)

    def add_message(self, role: str, content: str):
        """Add a message to the conversation history"""
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        }
        self.conversation_history.append(message)
        self._save_memory()

    def get_chat_messages(self) -> list[Messages]:
        """Convert conversation history to Mistral chat messages format"""
        return [
            UserMessage(content=msg["content"]) if msg["role"] == "user" else AssistantMessage(content=msg["content"])
            for msg in self.conversation_history[-MAX_HISTORY_LENGTH:]
        ]

    def get_response(self, user_message: str) -> str:
        """Get response from Mistral API"""
        # Add user message to history
        self.add_message("user", user_message)

        # Get chat completion from Mistral
        chat_response = self.client.chat.complete(
            model=self.model,
            messages=self.get_chat_messages()
        )

        if not chat_response.choices or not chat_response.choices[0].message.content:
            return "I'm sorry, I'm having trouble processing your request. Please try again."
        
        # Extract and store assistant's response
        assistant_message = str(chat_response.choices[0].message.content)
        self.add_message("assistant", assistant_message)

        return assistant_message

    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = []
        self._save_memory() 