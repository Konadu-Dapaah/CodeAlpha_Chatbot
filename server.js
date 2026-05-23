require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

app.post('/chat', async (req, res) => {
    try {
        const { contents } = req.body;
        
        if (!contents || contents.length === 0) {
            return res.status(400).json({ error: "No message contents provided" });
        }

        // Convert Gemini format (role/parts) to OpenAI format (role/content)
        const messages = contents.map(msg => ({
            role: msg.role === 'model' ? 'assistant' : msg.role,
            content: msg.parts[0].text
        }));

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Groq Error:", data.error);
            return res.status(500).json({ error: data.error.message || 'API error' });
        }

        const text = data.choices[0].message.content;
        res.json({ reply: text }); 
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: 'Server failed to get a response' });
    }
});

app.listen(3000, () => console.log('Chatbot Server running on: http://localhost:3000'));