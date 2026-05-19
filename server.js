require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai"); 

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { contents } = req.body;
        
        if (!contents || contents.length === 0) {
            return res.status(400).json({ error: "No message contents provided" });
        }
        const currentTurn = contents[contents.length - 1];
        const messageText = currentTurn.parts[0].text;
        
        const pastHistory = contents.slice(0, -1);

        const chat = model.startChat({
            history: pastHistory
        });

        const result = await chat.sendMessage(messageText);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text }); 
    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: 'Server failed to get a response' });
    }
});

app.listen(3000, () => console.log('Gemini Server spinning up on: http://localhost:3000'));