const messagesDiv = document.getElementById('messages');
const input = document.getElementById('userInput');

input.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  addMessage('user', text);
  input.value = '';
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMessage('bot', 'Test reply — real AI connected on Day 2!');
  }, 1500);
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
  const t = document.getElementById('typing');
  if (t) t.remove();
}