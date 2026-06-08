/* ===================================================================
   CLAIR DE LOI — AI Chatbot Widget
   Powered by Google Gemini 2.5 Flash
   =================================================================== */

const GEMINI_API_KEY = 'AIzaSyAQ-Ab8RN6K75zzte1l2kc9XW13aipFMU5e_9z04x1gc5IzVJYAtZg';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_INSTRUCTION = `You are the Clair De Loi AI Assistant — a friendly, knowledgeable chatbot for a youth law society called "Clair De Loi" (meaning "clarity of law" in French).

About Clair De Loi:
- A youth-led law society based in Singapore
- Dedicated to making legal discourse accessible and engaging
- Publishes editorial articles on topics like contract law, digital privacy, legal literacy
- Instagram: @clairdeloi.singapore (Singapore chapter) and @clairdeloi (main)
- Email: clairdeloisingapore@gmail.com
- Core values: Clarity, Integrity, Impact
- Motto: "Ubi societas ibi ius" (Where there is society, there is law)

Your role:
- Answer general questions about law and legal concepts in simple, accessible language
- Help visitors navigate the website (direct them to Articles, Mission, Contact pages)
- Share information about Clair De Loi's mission and activities
- Be warm, professional, and encouraging
- If asked about specific legal advice, clarify that you provide general information only and recommend consulting a qualified lawyer
- Keep responses concise but informative (2-4 paragraphs max)
- Use formatting like **bold** for key terms when helpful`;

let chatHistory = [];
let chatOpen = false;

function renderChatWidget() {
  return `
    <button class="chat-toggle" id="chat-toggle" aria-label="Open AI Assistant">
      <div class="chat-toggle-pulse"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
    </button>
    <div class="chat-window" id="chat-window">
      <div class="chat-header">
        <div class="chat-header-avatar">CL</div>
        <div class="chat-header-info">
          <div class="chat-header-name">Clair De Loi AI</div>
          <div class="chat-header-status">
            <div class="chat-status-dot"></div>
            <span>Online • Powered by Gemini</span>
          </div>
        </div>
        <button class="chat-close" id="chat-close" aria-label="Close chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="chat-message bot">
          👋 Welcome to <strong>Clair De Loi</strong>! I'm your AI assistant. Ask me anything about law, our mission, or how to navigate the site.
        </div>
      </div>
      <div class="chat-suggestions" id="chat-suggestions">
        <button class="chat-suggestion" data-q="What is contract law?">What is contract law?</button>
        <button class="chat-suggestion" data-q="Tell me about Clair De Loi">About Clair De Loi</button>
        <button class="chat-suggestion" data-q="What are my rights as a tenant in Singapore?">Tenant rights</button>
        <button class="chat-suggestion" data-q="How can I contribute to Clair De Loi?">How to contribute</button>
      </div>
      <div class="chat-footer">
        <input type="text" class="chat-input" id="chat-input" placeholder="Ask me anything about law..." autocomplete="off">
        <button class="chat-send" id="chat-send" aria-label="Send message">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  `;
}

function addMessage(container, text, role) {
  const msg = document.createElement('div');
  msg.className = `chat-message ${role}`;
  if (role === 'bot') {
    msg.innerHTML = formatBotMessage(text);
  } else {
    msg.textContent = text;
  }
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function showTyping(container) {
  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.id = 'chat-typing';
  typing.innerHTML = '<div class="chat-typing-dot"></div><div class="chat-typing-dot"></div><div class="chat-typing-dot"></div>';
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
  return typing;
}

function formatBotMessage(text) {
  // Simple markdown-ish formatting
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n- /g, '</p><ul><li>')
    .replace(/\n(\d+)\. /g, '</p><ol><li>')
    .replace(/<\/li>\n- /g, '</li><li>')
    .replace(/<\/li>\n(\d+)\. /g, '</li><li>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/<p><\/p>/g, '');
}

async function sendToGemini(userMessage) {
  chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    contents: chatHistory
  };

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini API proxy error:', err);
      throw new Error('API request failed');
    }

    const data = await res.json();
    const reply = data.reply || 'I apologize, I couldn\'t generate a response. Please try again.';
    
    chatHistory.push({ role: 'model', parts: [{ text: reply }] });
    return reply;
  } catch (error) {
    console.error('Chat error:', error);
    return 'I\'m sorry, I encountered an error processing your request. Please check your connection and try again.';
  }
}

export function initChatbot() {
  // Inject widget HTML
  const wrapper = document.createElement('div');
  wrapper.id = 'chatbot-widget';
  wrapper.innerHTML = renderChatWidget();
  document.body.appendChild(wrapper);

  const toggle = document.getElementById('chat-toggle');
  const window_ = document.getElementById('chat-window');
  const close = document.getElementById('chat-close');
  const input = document.getElementById('chat-input');
  const send = document.getElementById('chat-send');
  const messages = document.getElementById('chat-messages');
  const suggestions = document.getElementById('chat-suggestions');

  // Toggle chat
  toggle.addEventListener('click', () => {
    chatOpen = !chatOpen;
    window_.classList.toggle('active', chatOpen);
    if (chatOpen) input.focus();
  });

  close.addEventListener('click', () => {
    chatOpen = false;
    window_.classList.remove('active');
  });

  // Send message
  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    suggestions.style.display = 'none';

    addMessage(messages, text, 'user');
    const typing = showTyping(messages);

    const reply = await sendToGemini(text);
    typing.remove();
    addMessage(messages, reply, 'bot');
  }

  send.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Suggestion clicks
  suggestions.addEventListener('click', (e) => {
    const btn = e.target.closest('.chat-suggestion');
    if (btn) {
      input.value = btn.dataset.q;
      handleSend();
    }
  });
}
