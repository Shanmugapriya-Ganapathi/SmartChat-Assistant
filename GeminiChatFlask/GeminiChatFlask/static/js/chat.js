let currentChatId = null;
let isLoading = false;

document.addEventListener('DOMContentLoaded', function() {
    const newChatBtn = document.getElementById('new-chat-btn');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesContainer = document.getElementById('messages-container');
    const chatsList = document.getElementById('chats-list');
    const chatTitle = document.getElementById('chat-title');
    const renameBtn = document.getElementById('rename-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const renameModal = document.getElementById('rename-modal');
    const renameInput = document.getElementById('rename-input');
    const confirmRename = document.getElementById('confirm-rename');
    const cancelRename = document.getElementById('cancel-rename');

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Load chats on page load
    loadChats();

    // New chat button
    newChatBtn.addEventListener('click', createNewChat);

    // Send message
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Rename chat
    renameBtn.addEventListener('click', function() {
        if (!currentChatId) return;
        renameInput.value = chatTitle.textContent;
        renameModal.classList.add('show');
        renameInput.focus();
    });

    cancelRename.addEventListener('click', function() {
        renameModal.classList.remove('show');
    });

    confirmRename.addEventListener('click', async function() {
        if (!currentChatId) return;
        const newTitle = renameInput.value.trim();
        if (!newTitle) return;

        try {
            const response = await fetch(`/api/chats/${currentChatId}/rename`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle })
            });

            const data = await response.json();
            if (data.success) {
                chatTitle.textContent = newTitle;
                loadChats();
                renameModal.classList.remove('show');
            }
        } catch (error) {
            console.error('Error renaming chat:', error);
        }
    });

    // Delete chat
    deleteBtn.addEventListener('click', async function() {
        if (!currentChatId) return;
        if (!confirm('Are you sure you want to delete this chat?')) return;

        try {
            const response = await fetch(`/api/chats/${currentChatId}/delete`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (data.success) {
                currentChatId = null;
                messagesContainer.innerHTML = `
                    <div class="welcome-message">
                        <div class="welcome-icon">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                <circle cx="30" cy="30" r="28" fill="#128C7E"/>
                                <path d="M30 18 C22.27 18 16 24.27 16 32 C16 34.68 16.58 37.22 17.58 39.49 L18 42 L20.51 41.42 C22.78 42.42 25.32 43 28 43 C35.73 43 42 36.73 42 29 C42 21.27 35.73 18 30 18 Z" fill="#25D366"/>
                                <path d="M24 29 L27 32 L36 23" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <h2>How can I help you today?</h2>
                        <p>Start a conversation by typing a message below.</p>
                    </div>
                `;
                chatTitle.textContent = 'New Chat';
                loadChats();
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    });

    async function loadChats() {
        try {
            const response = await fetch('/api/chats');
            const data = await response.json();

            if (data.success) {
                chatsList.innerHTML = '';
                
                if (data.chats.length === 0) {
                    chatsList.innerHTML = '<div style="padding: 16px; text-align: center; color: #999; font-size: 13px;">No chats yet</div>';
                } else {
                    data.chats.forEach(chat => {
                        const chatItem = document.createElement('div');
                        chatItem.className = 'chat-item';
                        if (chat.id === currentChatId) {
                            chatItem.classList.add('active');
                        }
                        chatItem.textContent = chat.title;
                        chatItem.addEventListener('click', () => loadChat(chat.id));
                        chatsList.appendChild(chatItem);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading chats:', error);
        }
    }

    async function createNewChat() {
        try {
            const response = await fetch('/api/chats/create', {
                method: 'POST'
            });

            const data = await response.json();
            if (data.success) {
                currentChatId = data.chat_id;
                messagesContainer.innerHTML = `
                    <div class="welcome-message">
                        <div class="welcome-icon">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                <circle cx="30" cy="30" r="28" fill="#128C7E"/>
                                <path d="M30 18 C22.27 18 16 24.27 16 32 C16 34.68 16.58 37.22 17.58 39.49 L18 42 L20.51 41.42 C22.78 42.42 25.32 43 28 43 C35.73 43 42 36.73 42 29 C42 21.27 35.73 18 30 18 Z" fill="#25D366"/>
                                <path d="M24 29 L27 32 L36 23" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <h2>How can I help you today?</h2>
                        <p>Start a conversation by typing a message below.</p>
                    </div>
                `;
                chatTitle.textContent = 'New Chat';
                messageInput.focus();
                loadChats();
            }
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    }

    async function loadChat(chatId) {
        try {
            const response = await fetch(`/api/chats/${chatId}`);
            const data = await response.json();

            if (data.success) {
                currentChatId = chatId;
                chatTitle.textContent = data.chat.title;
                
                messagesContainer.innerHTML = '';
                
                if (data.chat.messages.length === 0) {
                    messagesContainer.innerHTML = `
                        <div class="welcome-message">
                            <div class="welcome-icon">
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <circle cx="30" cy="30" r="28" fill="#128C7E"/>
                                    <path d="M30 18 C22.27 18 16 24.27 16 32 C16 34.68 16.58 37.22 17.58 39.49 L18 42 L20.51 41.42 C22.78 42.42 25.32 43 28 43 C35.73 43 42 36.73 42 29 C42 21.27 35.73 18 30 18 Z" fill="#25D366"/>
                                    <path d="M24 29 L27 32 L36 23" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <h2>How can I help you today?</h2>
                            <p>Start a conversation by typing a message below.</p>
                        </div>
                    `;
                } else {
                    data.chat.messages.forEach(message => {
                        appendMessage(message.role, message.content);
                    });
                }
                
                loadChats();
            }
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    }

    async function sendMessage() {
        if (isLoading) return;
        
        const message = messageInput.value.trim();
        if (!message) return;

        // Create a new chat if none is selected
        if (!currentChatId) {
            await createNewChat();
        }

        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';

        // Remove welcome message if present
        const welcomeMsg = messagesContainer.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }

        // Display user message
        appendMessage('user', message);

        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message assistant-message';
        loadingDiv.id = 'loading-message';
        loadingDiv.innerHTML = `
            <div class="message-avatar">AI</div>
            <div class="message-content">
                <div class="loading-indicator">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        isLoading = true;
        sendBtn.disabled = true;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    chat_id: currentChatId
                })
            });

            const data = await response.json();

            // Remove loading indicator
            const loading = document.getElementById('loading-message');
            if (loading) {
                loading.remove();
            }

            if (data.success) {
                appendMessage('assistant', data.message);
                loadChats();
            } else {
                appendMessage('assistant', 'Sorry, I encountered an error: ' + data.message);
            }
        } catch (error) {
            const loading = document.getElementById('loading-message');
            if (loading) {
                loading.remove();
            }
            appendMessage('assistant', 'Sorry, I encountered an error. Please try again.');
            console.error('Error sending message:', error);
        } finally {
            isLoading = false;
            sendBtn.disabled = false;
            messageInput.focus();
        }
    }

    function appendMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        
        const avatar = role === 'user' ? 
            (document.querySelector('.user-avatar') ? document.querySelector('.user-avatar').textContent : 'U') : 
            'AI';
        
        // WhatsApp style - minimal avatar, no role label
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${escapeHtml(content)}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Close modal on outside click
    renameModal.addEventListener('click', function(e) {
        if (e.target === renameModal) {
            renameModal.classList.remove('show');
        }
    });

    // Enter key in rename modal
    renameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            confirmRename.click();
        }
    });
});
