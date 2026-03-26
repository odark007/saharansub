export function renderChatHistory() {
  const container = document.getElementById('view-container');
  
  // Encapsulated CSS for the Chat Component
  const styleId = 'chat-component-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Override main-content spacing when chat is active */
      .main-content:has(.chat-container),
      .main-content.chat-active {
        padding: 0 !important;
        margin-bottom: 0 !important;
        overflow: hidden;
      }
      .chat-container {
        display: flex;
        flex-direction: column;
        height: calc(100vh - var(--navbar-height, 56px) - var(--bottom-nav-height, 60px));
        height: calc(100dvh - var(--navbar-height, 56px) - var(--bottom-nav-height, 60px));
        background-color: var(--light-gray, #f0f4f8);
        position: relative;
        overflow: hidden;
      }
      .chat-header {
        padding: 12px 16px;
        background: linear-gradient(135deg, var(--primary-blue, #013369) 0%, var(--secondary-blue, #0250a3) 100%);
        color: white;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 10;
        flex-shrink: 0;
      }
      .chat-header h2 { margin: 0; font-size: 1.2rem; }
      .chat-header p { margin: 4px 0 0 0; font-size: 0.85rem; opacity: 0.9; }
      
      .chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .message {
        display: flex;
        flex-direction: column;
        max-width: 85%;
        animation: fadeIn 0.3s ease;
      }
      .message.user {
        align-self: flex-end;
        align-items: flex-end;
      }
      .message.bot {
        align-self: flex-start;
        align-items: flex-start;
      }
      
      .message-bubble {
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 0.95rem;
        line-height: 1.4;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      .message.user .message-bubble {
        background-color: var(--primary-blue, #013369);
        color: white;
        border-bottom-right-radius: 4px;
      }
      .message.bot .message-bubble {
        background-color: white;
        color: var(--dark-gray, #333);
        border-bottom-left-radius: 4px;
      }
      
      /* Bot Response Parsing Styles */
      .ref-card {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
      }
      .ref-row {
        display: flex;
        flex-direction: column;
        background: #f8fafc;
        padding: 8px;
        border-radius: 6px;
        border-left: 4px solid var(--accent-orange, #ff6b00);
      }
      .ref-label {
        font-size: 0.75rem;
        font-weight: bold;
        color: #64748b;
        text-transform: uppercase;
        margin-bottom: 2px;
      }
      .ref-value {
        font-size: 0.95rem;
        font-weight: 600;
        color: #0f172a;
      }
      .ref-row.foul { border-left-color: #ef4444; }
      .ref-row.enforcement { border-left-color: #f59e0b; }
      .ref-row.down { border-left-color: #3b82f6; }
      .ref-row.clock { border-left-color: #10b981; }

      .chat-input-area {
        padding: 10px 12px;
        padding-bottom: max(10px, env(safe-area-inset-bottom));
        background: white;
        border-top: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 10;
        flex-shrink: 0;
      }
      
      .chat-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #cbd5e1;
        border-radius: 24px;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.2s;
      }
      .chat-input:focus { border-color: var(--primary-blue, #013369); }
      
      .action-btn {
        width: 42px;
        height: 42px;
        min-width: 42px;
        border-radius: 50%;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
        transition: transform 0.2s, background-color 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        flex-shrink: 0;
      }
      .btn-send { background-color: var(--success-green, #10b981); }
      .btn-send:hover { background-color: #059669; }
      
      .btn-mic { background-color: var(--primary-blue, #013369); }
      .btn-mic.recording {
        background-color: var(--error-red, #ef4444);
        animation: pulse 1.5s infinite;
      }
      
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
        70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 4px 8px;
        align-items: center;
      }
      .dot {
        width: 6px;
        height: 6px;
        background-color: #94a3b8;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out both;
      }
      .dot:nth-child(1) { animation-delay: -0.32s; }
      .dot:nth-child(2) { animation-delay: -0.16s; }
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  container.innerHTML = `
    <div class="chat-container">
      <div class="chat-header">
        <h2>Ref-Bot Assistant</h2>
        <p>Ask a rule or report a play via voice or text</p>
      </div>
      
      <div class="chat-messages" id="chat-messages">
        <!-- Initial greeting -->
        <div class="message bot">
          <div class="message-bubble">
            Hello! I am your AI Referee Assistant. What rule can I clarify or play can I review for you?
          </div>
        </div>
      </div>
      
      <div class="chat-input-area">
        <button id="mic-btn" class="action-btn btn-mic" aria-label="Hold to Record">
          <i class="fas fa-microphone"></i>
        </button>
        <input type="text" id="chat-input" class="chat-input" placeholder="Type your query here..." />
        <button id="send-btn" class="action-btn btn-send" aria-label="Send">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  `;

  // Remove main-content padding/margin so chat fills the space
  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.classList.add('chat-active');

  // UI Elements
  const messagesContainer = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const micBtn = document.getElementById('mic-btn');

  // MediaRecorder variables
  let mediaRecorder;
  let audioChunks = [];
  let isRecording = false;

  // Add a message to the UI
  const addMessage = (text, sender, isStructured = false) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    
    let contentHtml = text;
    if (sender === 'bot' && isStructured && text.includes('FOUL:')) {
      // Parse structured output
      contentHtml = parseBotResponse(text);
    }
    
    msgDiv.innerHTML = `<div class="message-bubble">${contentHtml}</div>`;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const showTyping = () => {
    const id = 'typing-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot';
    msgDiv.id = id;
    msgDiv.innerHTML = `<div class="message-bubble">
      <div class="typing-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
    </div>`;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
  };

  const removeTyping = (id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  };

  const parseBotResponse = (text) => {
    // Expected format: FOUL: ... \n ENFORCEMENT: ... \n DOWN: ... \n CLOCK: ...
    const lines = text.split('\n');
    let html = '<div class="ref-card">';
    lines.forEach(line => {
      const match = line.match(/^(FOUL|ENFORCEMENT|DOWN|CLOCK):\s*(.*)$/i);
      if (match) {
        const key = match[1].toLowerCase();
        const val = match[2];
        html += `
          <div class="ref-row ${key}">
            <span class="ref-label">${key}</span>
            <span class="ref-value">${val}</span>
          </div>
        `;
      }
    });
    html += '</div>';
    return html !== '<div class="ref-card"></div>' ? html : text; // Fallback if parsing fails
  };

  const handleSend = async (text, audioBlob = null) => {
    if (!text && !audioBlob) return;
    
    // Optimistic UI for text
    if (text && !audioBlob) {
      addMessage(text, 'user');
      chatInput.value = '';
    } else if (audioBlob) {
      addMessage('🎙️ Audio message sent...', 'user');
    }

    const typingId = showTyping();

    try {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (audioBlob) formData.append('audio', audioBlob, 'query.webm');
      
      const baseUrl = window.APP_CONFIG?.API_BASE_URL || '';
      
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      removeTyping(typingId);

      if (data.error || (!data.success && data.message)) {
        addMessage(`⚠️ Error: ${data.error || data.message}`, 'bot');
      } else {
        if (data.transcription && audioBlob) {
          // Update the audio message placeholder with actual transcription
          addMessage(`Transcription: "${data.transcription}"`, 'user');
        }
        addMessage(data.response, 'bot', true);
      }
    } catch (err) {
      console.error(err);
      removeTyping(typingId);
      addMessage('⚠️ Network error. Could not reach Ref-Bot.', 'bot');
    }
  };

  // Event Listeners
  sendBtn.addEventListener('click', () => handleSend(chatInput.value.trim()));
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend(chatInput.value.trim());
  });

  // Audio Recording Logic
  const setupRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        audioChunks = [];
        handleSend(null, audioBlob);
        
        // Stop all tracks to release mic light
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (err) {
      console.error('Mic access denied:', err);
      alert('Microphone access is required to use voice commands.');
    }
  };

  micBtn.addEventListener('mousedown', async () => {
    if (!isRecording) {
      await setupRecording();
      if (mediaRecorder) {
        mediaRecorder.start();
        isRecording = true;
        micBtn.classList.add('recording');
        micBtn.innerHTML = '<i class="fas fa-stop"></i>';
      }
    } else {
      mediaRecorder.stop();
      isRecording = false;
      micBtn.classList.remove('recording');
      micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
  });

  // Support touch for mobile
  micBtn.addEventListener('touchstart', async (e) => {
    e.preventDefault();
    if (!isRecording) {
      await setupRecording();
      if (mediaRecorder) {
        mediaRecorder.start();
        isRecording = true;
        micBtn.classList.add('recording');
        micBtn.innerHTML = '<i class="fas fa-stop"></i>';
      }
    }
  });

  micBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      isRecording = false;
      micBtn.classList.remove('recording');
      micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
  });
}
