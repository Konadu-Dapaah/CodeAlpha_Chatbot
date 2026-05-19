const messagesDiv = document.getElementById('messages');
const input       = document.getElementById('userInput');
const sendBtn     = document.getElementById('sendBtn');
let   history     = [];

input.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage('user', text);
  input.value = '';
  sendBtn.disabled = true;
  
  history.push({ role: 'user', parts: [{ text: text }] });
  showTyping();

  try {
    const res  = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: history }) 
    });
    const data = await res.json();
    removeTyping();
    
    if (data.reply) {
      addMessage('bot', data.reply);
      history.push({ role: 'model', parts: [{ text: data.reply }] }); 
    } else {
      addMessage('bot', data.error || "Something went wrong");
    }
  } catch {
    removeTyping();
    addMessage('bot', 'Sorry, connection error. Please try again.');
  }
  sendBtn.disabled = false;
}

function addMessage(role, text) {
  const d = document.createElement('div');
  d.className = `message ${role}`;
  d.innerHTML = `<div class="bubble">${text}</div>`;
  messagesDiv.appendChild(d);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
function showTyping() {
  const d = document.createElement('div');
  d.className = 'message bot typing'; d.id = 'typing';
  d.innerHTML = '<div class="bubble">Thinking...</div>';
  messagesDiv.appendChild(d);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
function removeTyping() {
  const t = document.getElementById('typing'); if (t) t.remove();
}