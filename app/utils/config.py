import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Mistral API configuration
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    raise ValueError("MISTRAL_API_KEY environment variable is not set")

# Chat configuration
DEFAULT_MODEL = "mistral-medium"
MAX_HISTORY_LENGTH = 10  # Number of messages to keep in immediate context

# Memory configuration
MEMORY_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "memory")
os.makedirs(MEMORY_DIR, exist_ok=True) 