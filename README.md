# Custom Mistral Chat

A Streamlit-based chat interface for Mistral AI's language models with conversation memory capabilities.

## Features

- Real-time chat interface using Mistral AI's API
- Conversation history persistence
- Clean and modern UI
- Easy to use and extend

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the root directory and add your Mistral API key:
   ```
   MISTRAL_API_KEY=your_api_key_here
   ```
4. Run the application:
   ```bash
   streamlit run app/main.py
   ```

## Usage

1. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:8501)
2. Start chatting with the AI assistant
3. Use the sidebar to clear conversation history if needed

## Project Structure

```
CustomMistral/
├── app/
│   ├── main.py           # Streamlit app entry point
│   ├── chat/
│   │   └── chat_manager.py # Chat logic and Mistral integration
│   └── utils/
│       └── config.py     # Configuration and environment variables
├── requirements.txt
└── README.md
```

## Requirements

- Python 3.8+
- Mistral AI API key
- Dependencies listed in requirements.txt
