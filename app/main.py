import streamlit as st
from chat.chat_manager import ChatManager
import time

# Set page config
st.set_page_config(
    page_title="Custom Mistral Chat",
    page_icon="🤖",
    layout="wide"
)

# Initialize session state
if "chat_manager" not in st.session_state:
    st.session_state.chat_manager = ChatManager()

# Custom CSS for chat interface
st.markdown("""
<style>
    /* Main background */
    .stApp {
        background-color: #1a1a1a;
    }
    
    /* Text input styling */
    .stTextInput>div>div>input {
        background-color: #2d2d2d !important;
        color: white !important;
        border: 1px solid #404040;
    }
    
    /* Chat message styling */
    .chat-message {
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
    }
    
    /* User message styling */
    .chat-message.user {
        background-color: #2b313e;
        color: white;
    }
    
    /* Assistant message styling */
    .chat-message.assistant {
        background-color: #2d2d2d;
        color: #e0e0e0;
        border: 1px solid #404040;
    }
    
    .chat-message .content {
        display: flex;
        flex-direction: column;
        margin-top: 0.5rem;
    }
    
    /* Title color */
    h1 {
        color: white !important;
    }
    
    /* Sidebar styling */
    .css-1d391kg {
        background-color: #1a1a1a;
    }
    
    /* Button styling */
    .stButton>button {
        background-color: #2d2d2d;
        color: white;
        border: 1px solid #404040;
    }
    
    .stButton>button:hover {
        background-color: #404040;
        border: 1px solid #505050;
    }
</style>
""", unsafe_allow_html=True)

# Title
st.title("🤖 Custom Mistral Chat")

# Sidebar
with st.sidebar:
    st.header("Settings")
    if st.button("Clear Conversation"):
        st.session_state.chat_manager.clear_history()
        st.rerun()

# Display chat messages
for message in st.session_state.chat_manager.conversation_history:
    with st.container():
        if message["role"] == "user":
            st.markdown(f"""
            <div class="chat-message user">
                <div><strong>You:</strong></div>
                <div class="content">{message["content"]}</div>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="chat-message assistant">
                <div><strong>Assistant:</strong></div>
                <div class="content">{message["content"]}</div>
            </div>
            """, unsafe_allow_html=True)

# Chat input
user_input = st.text_input("Type your message here...", key="user_input")

if user_input:
    # Display user message
    st.markdown(f"""
    <div class="chat-message user">
        <div><strong>You:</strong></div>
        <div class="content">{user_input}</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Get and display assistant response
    with st.spinner("Thinking..."):
        response = st.session_state.chat_manager.get_response(user_input)
        st.markdown(f"""
        <div class="chat-message assistant">
            <div><strong>Assistant:</strong></div>
            <div class="content">{response}</div>
        </div>
        """, unsafe_allow_html=True)
    
    # Clear input
    st.session_state.user_input = "" 