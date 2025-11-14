# GeminiChatFlask

A modern, Flask-based AI chatbot application powered by Google's Gemini AI. Features a ChatGPT-inspired interface with user authentication, multiple chat sessions, and real-time AI conversations.

## ✨ Features

- **User Authentication**: Secure session-based login/logout system with password hashing
- **AI-Powered Chat**: Intelligent conversations powered by Google Gemini AI (gemini-2.5-flash model)
- **Chat Management**: 
  - Create new chat conversations
  - Access and continue previous chats
  - Rename chat conversations
  - Delete chat conversations
- **Modern UI**: Beautiful ChatGPT-inspired design with gradient themes (white to sky blue)
- **Real-time Interactions**: All interactions use JavaScript fetch API for smooth, real-time experience
- **Conversation Context**: Full chat history maintained for contextual AI responses

## 🛠️ Technology Stack

- **Backend**: Python Flask
- **AI**: Google Gemini API (gemini-2.5-flash model)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Authentication**: Flask sessions with Werkzeug password hashing
- **Storage**: In-memory dictionaries (users and chats)

## 📋 Prerequisites

- Python 3.11 or higher
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- pip (Python package installer)

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
cd GeminiChatFlask
```

### 2. Create a Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

**Option A: Using pip with requirements.txt**
```bash
pip install -r requirements.txt
```

**Option B: Using uv (if you have it installed)**
```bash
uv pip install -r requirements.txt
```

**Option C: Manual installation**
```bash
pip install flask>=3.1.2 werkzeug google-generativeai>=0.8.5
```

### 4. Set Environment Variables

Create a `.env` file in the project root (optional but recommended), or set environment variables directly:

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your-api-key-here"
$env:SESSION_SECRET="your-secret-key-here"  # Optional, auto-generated if not set
```

**Windows (Command Prompt):**
```cmd
set GEMINI_API_KEY=your-api-key-here
set SESSION_SECRET=your-secret-key-here
```

**macOS/Linux:**
```bash
export GEMINI_API_KEY="your-api-key-here"
export SESSION_SECRET="your-secret-key-here"  # Optional
```

**Using .env file (Recommended):**
Create a `.env` file:
```
GEMINI_API_KEY=your-api-key-here
SESSION_SECRET=your-secret-key-here
```

Then install python-dotenv and load it in your app:
```bash
pip install python-dotenv
```

### 5. Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000` or `http://0.0.0.0:5000`

Open your web browser and navigate to: **http://localhost:5000**

## 📁 Project Structure

```
GeminiChatFlask/
├── app.py                 # Main Flask application with all routes and API endpoints
├── main.py                # Placeholder file (not used)
├── pyproject.toml         # Python project configuration
├── requirements.txt       # Python dependencies
├── templates/
│   ├── login.html        # Login page with gradient design
│   └── chat.html         # Main chat interface
├── static/
│   ├── css/
│   │   └── style.css     # All styling with gradient themes
│   └── js/
│       ├── login.js      # Login page interactions
│       └── chat.js       # Chat interface and API calls
└── README.md             # This file
```

## 🎯 Usage

### First Time Setup

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key

2. **Set the API Key**:
   - Set it as an environment variable (see Installation step 4)
   - Or modify `app.py` temporarily to use your key (not recommended for production)

3. **Start the Application**:
   ```bash
   python app.py
   ```

### Using the Application

1. **Login**: 
   - Navigate to `http://localhost:5000`
   - Enter a username and password
   - If the username doesn't exist, a new account will be created automatically
   - If the username exists, use the correct password to log in

2. **Create a Chat**:
   - Click the "New Chat" button in the sidebar
   - Start typing your message
   - The chat title will automatically update based on your first message

3. **Manage Chats**:
   - Click on any chat in the sidebar to load it
   - Use the rename button (pencil icon) to change the chat title
   - Use the delete button (trash icon) to delete a chat

4. **Chat with AI**:
   - Type your message in the input box at the bottom
   - Press Enter or click the send button
   - The AI will respond based on the full conversation context

5. **Logout**:
   - Click the logout button in the sidebar footer

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using Werkzeug's PBKDF2-SHA256
- **Session Management**: Secure Flask sessions with secret key
- **Conversation Context**: Full chat history maintained and passed to Gemini AI for contextual responses

## ⚠️ Important Notes

- **In-Memory Storage**: All user and chat data is stored in memory. This means:
  - Data will be lost when the server restarts
  - This is suitable for development and testing
  - For production, consider implementing a database (SQLite, PostgreSQL, etc.)

- **API Key Security**: Never commit your API key to version control. Use environment variables or a `.env` file (and add `.env` to `.gitignore`)

- **Session Secret**: The application auto-generates a session secret if not provided, but for production, set a fixed `SESSION_SECRET` environment variable

## 🐛 Troubleshooting

### "GEMINI_API_KEY not found" Error
- Make sure you've set the `GEMINI_API_KEY` environment variable
- Verify the API key is correct and active
- Restart the Flask application after setting the environment variable

### Port Already in Use
- Change the port in `app.py`: `app.run(host='0.0.0.0', port=5001, debug=True)`
- Or kill the process using port 5000

### Module Not Found Errors
- Make sure you've activated your virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

### Chat History Not Persisting
- This is expected behavior - the application uses in-memory storage
- Data is lost when the server restarts
- Consider implementing database storage for production use

## 🔧 Configuration

### Changing the Port

Edit `app.py` at the bottom:
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)  # Change port here
```

### Changing the Gemini Model

Edit `app.py` line 13:
```python
model = genai.GenerativeModel('gemini-pro')  # Change model here
```

Available models:
- `gemini-2.5-flash` (default, faster)
- `gemini-pro` (more capable)
- `gemini-pro-vision` (for image understanding)

## 📝 API Endpoints

- `GET /` - Redirects to login or chat
- `GET /login` - Login page
- `POST /api/login` - Login/register endpoint
- `GET /chat` - Chat interface
- `GET /logout` - Logout endpoint
- `GET /api/chats` - Get all user chats
- `POST /api/chats/create` - Create a new chat
- `GET /api/chats/<chat_id>` - Get a specific chat
- `POST /api/chats/<chat_id>/rename` - Rename a chat
- `DELETE /api/chats/<chat_id>/delete` - Delete a chat
- `POST /api/chat` - Send a message to the AI

## 🚀 Production Deployment

For production deployment, consider:

1. **Use a Production Server**:
   - Gunicorn: `pip install gunicorn && gunicorn -w 4 -b 0.0.0.0:5000 app:app`
   - Waitress: `pip install waitress && waitress-serve --host=0.0.0.0 --port=5000 app:app`

2. **Implement Database Storage**:
   - Replace in-memory storage with SQLite, PostgreSQL, or MongoDB
   - Persist user accounts and chat history

3. **Environment Variables**:
   - Use proper secret management (AWS Secrets Manager, etc.)
   - Set `SESSION_SECRET` to a fixed, strong secret
   - Never expose API keys in code

4. **Security**:
   - Enable HTTPS
   - Add rate limiting
   - Implement CSRF protection
   - Add input validation and sanitization

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Google Gemini AI for the AI capabilities
- Flask framework for the web backend
- All contributors and users

## 📧 Support

For issues, questions, or contributions, please open an issue on the project repository.

---

**Happy Chatting! 🤖💬**

