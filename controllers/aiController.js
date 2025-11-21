const { GoogleGenAI } = require('@google/genai');

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const extractText = (result) => {
    if (typeof result?.text === 'string') {
        return result.text;
    }

    const candidates = result?.response?.candidates || [];
    const parts = candidates.flatMap(candidate => candidate?.content?.parts || []);
    const textParts = parts
        .map(part => part?.text)
        .filter(Boolean);

    return textParts.join('\n');
};

const chatWithAI = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const contents = [
            ...conversationHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            {
                role: 'user',
                parts: [{ text: message }]
            }
        ];

        const result = await genAI.models.generateContent({
            model: MODEL_NAME,
            contents
        });

        const text = extractText(result);

        if (!text) {
            throw new Error('No response text received from Gemini');
        }

        res.json({ response: text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
};

module.exports = { chatWithAI };

