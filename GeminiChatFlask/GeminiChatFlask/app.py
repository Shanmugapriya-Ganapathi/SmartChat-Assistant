from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import google.generativeai as genai
import os
from datetime import datetime
import secrets

app = Flask(__name__)
app.secret_key = os.environ.get('SESSION_SECRET', secrets.token_hex(32))

# Configure Gemini AI
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY environment variable is not set!")
    print("Please set it using:")
    print("  Windows (PowerShell): $env:GEMINI_API_KEY='your-api-key'")
    print("  Windows (CMD): set GEMINI_API_KEY=your-api-key")
    print("  macOS/Linux: export GEMINI_API_KEY='your-api-key'")
    print("\nThe app will start, but AI features will not work until the API key is set.")
    model = None
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash')
        print("✓ Gemini AI configured successfully")
    except Exception as e:
        print(f"ERROR: Failed to configure Gemini AI: {e}")
        model = None

# In-memory storage for users and chats
users = {}
chats_storage = {}

@app.route('/')
def index():
    if 'username' in session:
        return redirect(url_for('chat'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET'])
def login():
    if 'username' in session:
        return redirect(url_for('chat'))
    return render_template('login.html')

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password are required'}), 400
    
    # Check if user exists
    if username in users:
        if check_password_hash(users[username], password):
            session['username'] = username
            return jsonify({'success': True, 'message': 'Login successful'})
        else:
            return jsonify({'success': False, 'message': 'Invalid password'}), 401
    else:
        # Create new user with hashed password
        users[username] = generate_password_hash(password)
        chats_storage[username] = {}
        session['username'] = username
        return jsonify({'success': True, 'message': 'Account created and logged in'})

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/chat')
def chat():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('chat.html', username=session['username'])

@app.route('/api/chats', methods=['GET'])
def get_chats():
    if 'username' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    
    username = session['username']
    if username not in chats_storage:
        chats_storage[username] = {}
    
    chats = []
    for chat_id, chat_data in chats_storage[username].items():
        chats.append({
            'id': chat_id,
            'title': chat_data['title'],
            'created_at': chat_data['created_at']
        })
    
    # Sort by creation time (newest first)
    chats.sort(key=lambda x: x['created_at'], reverse=True)
    return jsonify({'success': True, 'chats': chats})

@app.route('/api/chats/create', methods=['POST'])
def create_chat():
    if 'username' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    
    username = session['username']
    chat_id = datetime.now().strftime('%Y%m%d%H%M%S%f')
    
    chats_storage[username][chat_id] = {
        'title': 'New Chat',
        'created_at': datetime.now().isoformat(),
        'messages': []
    }
    
    return jsonify({'success': True, 'chat_id': chat_id})

@app.route('/api/chats/<chat_id>', methods=['GET'])
def get_chat(chat_id):
    if 'username' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    
    username = session['username']
    if chat_id not in chats_storage.get(username, {}):
        return jsonify({'success': False, 'message': 'Chat not found'}), 404
    
    chat = chats_storage[username][chat_id]
    return jsonify({
        'success': True,
        'chat': {
            'id': chat_id,
            'title': chat['title'],
            'messages': chat['messages']
        }
    })

@app.route('/api/chats/<chat_id>/rename', methods=['POST'])
def rename_chat(chat_id):
    if 'username' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    
    username = session['username']
    if chat_id not in chats_storage.get(username, {}):
        return jsonify({'success': False, 'message': 'Chat not found'}), 404
    
    data = request.json
    new_title = data.get('title', '').strip()
    
    if not new_title:
        return jsonify({'success': False, 'message': 'Title cannot be empty'}), 400
    
    chats_storage[username][chat_id]['title'] = new_title
    return jsonify({'success': True, 'message': 'Chat renamed successfully'})

@app.route('/api/chats/<chat_id>/delete', methods=['DELETE'])
def delete_chat(chat_id):
    if 'username' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    
    username = session['username']
    if chat_id not in chats_storage.get(username, {}):
        return jsonify({'success': False, 'message': 'Chat not found'}), 404
    
    del chats_storage[username][chat_id]
    return jsonify({'success': True, 'message': 'Chat deleted successfully'})

@app.route('/api/chat', methods=['POST'])
def send_message():
    if 'username' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    
    data = request.json
    user_message = data.get('message', '').strip()
    chat_id = data.get('chat_id')
    
    if not user_message:
        return jsonify({'success': False, 'message': 'Message cannot be empty'}), 400
    
    username = session['username']
    
    # Ensure chat exists
    if chat_id not in chats_storage.get(username, {}):
        return jsonify({'success': False, 'message': 'Chat not found'}), 404
    
    # Store user message
    chats_storage[username][chat_id]['messages'].append({
        'role': 'user',
        'content': user_message,
        'timestamp': datetime.now().isoformat()
    })
    
    # Auto-update chat title with first message
    if chats_storage[username][chat_id]['title'] == 'New Chat' and len(chats_storage[username][chat_id]['messages']) == 1:
        title = user_message[:50] + ('...' if len(user_message) > 50 else '')
        chats_storage[username][chat_id]['title'] = title
    
    # Check if model is configured
    if model is None:
        return jsonify({
            'success': False,
            'message': 'AI service is not configured. Please set GEMINI_API_KEY environment variable.'
        }), 503
    
    try:
        # Build chat history for Gemini from stored messages
        # Convert our message format to Gemini's expected format
        history = []
        messages = chats_storage[username][chat_id]['messages']
        
        # Process all messages except the last one (which is the current user message)
        for i in range(len(messages) - 1):
            msg = messages[i]
            if msg['role'] == 'user':
                history.append({
                    'role': 'user',
                    'parts': [msg['content']]
                })
            elif msg['role'] == 'assistant':
                history.append({
                    'role': 'model',
                    'parts': [msg['content']]
                })
        
        # Get AI response with full conversation history
        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(user_message)
        ai_message = response.text
        
        # Store AI response
        chats_storage[username][chat_id]['messages'].append({
            'role': 'assistant',
            'content': ai_message,
            'timestamp': datetime.now().isoformat()
        })
        
        return jsonify({
            'success': True,
            'message': ai_message
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error getting AI response: {str(e)}'
        }), 500

if __name__ == '__main__':
    try:
        print("\n" + "="*50)
        print("Starting Flask Application...")
        print("="*50)
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        print("\n\nShutting down server...")
    except Exception as e:
        print(f"\n\nERROR: Failed to start server: {e}")
        import sys
        sys.exit(1)
