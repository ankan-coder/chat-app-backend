const { GoogleGenAI } = require('@google/genai');

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

class GeminiService {
    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    }

    extractText(result) {
        if (typeof result?.text === 'string') {
            return result.text;
        }

        const candidates = result?.response?.candidates || [];
        const parts = candidates.flatMap(candidate => candidate?.content?.parts || []);
        const textParts = parts
            .map(part => part?.text)
            .filter(Boolean);

        return textParts.join('\n');
    }

    async getResponse(message, conversationHistory = []) {
        try {
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

            const result = await this.ai.models.generateContent({
                model: MODEL_NAME,
                contents
            });

            const text = this.extractText(result);

            if (!text) {
                throw new Error('No response text received from Gemini');
            }

            return text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error('Failed to get AI response');
        }
    }
}

module.exports = new GeminiService();

