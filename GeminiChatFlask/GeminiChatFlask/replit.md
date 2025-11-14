# AI Chatbot Application

## Overview
A Flask-based chatbot application powered by Google's Gemini AI, featuring a modern ChatGPT-inspired interface with white and sky blue gradient design. The application includes user authentication, chat management, and real-time AI conversations.

## Features
- **User Authentication**: Session-based login/logout system (no database required)
- **AI Chat**: Powered by Google Gemini AI for intelligent responses
- **Chat Management**: 
  - Create new chat conversations
  - Access and continue previous chats
  - Rename chat conversations
  - Delete chat conversations
- **Modern UI**: ChatGPT-inspired design with linear gradient (white to sky blue)
- **No Form Submissions**: All interactions use JavaScript fetch API for smooth, real-time experience
- **In-Memory Storage**: All user and chat data stored server-side in memory

## Project Structure
```
.
├── app.py                 # Main Flask application with all routes and API endpoints
├── templates/
│   ├── login.html        # Login page with gradient design
│   └── chat.html         # Main chat interface
├── static/
│   ├── css/
│   │   └── style.css     # All styling with gradient themes
│   └── js/
│       ├── login.js      # Login page interactions
│       └── chat.js       # Chat interface and API calls
└── replit.md             # This file
```

## Technology Stack
- **Backend**: Python Flask
- **AI**: Google Gemini API (gemini-pro model)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Authentication**: Flask sessions
- **Storage**: In-memory dictionaries (users, chats)

## Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key for AI responses
- `SESSION_SECRET`: Flask session secret (auto-generated if not provided)

## Architecture Decisions
1. **No Database**: Uses in-memory storage for simplicity and speed
2. **No Forms**: All data submission via JSON API calls to avoid traditional form submission
3. **Session-based Auth**: Simple username/password authentication using Flask sessions
4. **Auto-account Creation**: New users are automatically registered on first login attempt
5. **Auto-title Generation**: Chat titles automatically generated from first user message

## User Flow
1. User visits site → redirected to login page
2. User enters username/password → creates account or logs in
3. User redirected to chat interface
4. User can create new chats, access previous chats, rename, or delete them
5. Messages sent to Gemini AI and responses displayed in real-time
6. User can logout from sidebar

## Color Scheme
- Primary gradient: White (#ffffff) to Sky Blue (#87CEEB)
- Accent blue: #4A90E2
- Text colors: Dark (#2C3E50) and Light (#5A6C7D)
- Background gradients throughout for modern aesthetic

## Security Features
- **Password Hashing**: All passwords are hashed using Werkzeug's security functions (PBKDF2-SHA256)
- **Session Management**: Secure Flask sessions with secret key
- **Conversation Context**: Full chat history maintained and passed to Gemini AI for contextual responses

## Recent Changes
- 2025-11-04: Initial project creation with all core features implemented
- 2025-11-04: Added password hashing for secure authentication
- 2025-11-04: Implemented conversation history context for Gemini AI multi-turn conversations
