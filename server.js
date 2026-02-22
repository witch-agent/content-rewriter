require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration - API key should be set in .env file (never commit this file!)
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';
const MINIMAX_BASE_URL = 'https://api.minimax.chat';

// Style prompts
const stylePrompts = {
    professional: 'Rewrite the following text in a professional, business-appropriate manner. Maintain the core message but use formal language and structure.',
    casual: 'Rewrite the following text in a casual, friendly tone. Make it conversational and easy to read.',
    academic: 'Rewrite the following text in an academic style. Use formal language, proper citations structure, and scholarly tone.',
    technical: 'Rewrite the following text in a technical style. Use precise terminology, clear explanations, and structured format.',
    creative: 'Rewrite the following text in a creative, engaging manner. Use vivid language, metaphors, and storytelling elements.',
    persuasive: 'Rewrite the following text in a persuasive manner. Use compelling arguments, emotional appeals, and strong calls to action.',
    storytelling: 'Rewrite the following text as a story. Use narrative structure, character development, and engaging storytelling techniques.',
    concise: 'Rewrite the following text in a concise manner. Remove unnecessary words, get to the point, and make it brief but complete.'
};

// Rewrite endpoint
app.post('/api/rewrite', async (req, res) => {
    try {
        const { text, style } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        
        const selectedStyle = style || 'professional';
        const prompt = stylePrompts[selectedStyle] || stylePrompts.professional;
        
        // Check if API key is configured
        if (!MINIMAX_API_KEY) {
            return res.status(500).json({ 
                error: 'API key not configured',
                message: 'Please set MINIMAX_API_KEY in server.js or .env file'
            });
        }
        
        // Call MiniMax API
        const response = await fetch(`${MINIMAX_BASE_URL}/v1/text/chatcompletion_v2`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MINIMAX_API_KEY}`
            },
            body: JSON.stringify({
                model: 'MiniMax-Text-01',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional content rewriter. Rewrite the given text according to the specified style while maintaining the original meaning.'
                    },
                    {
                        role: 'user',
                        content: `${prompt}\n\nOriginal text:\n${text}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 4096
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('MiniMax API error:', errorData);
            return res.status(response.status).json({ 
                error: 'API request failed',
                details: errorData
            });
        }
        
        const data = await response.json();
        
        // Extract the generated text from response
        const result = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';
        
        res.json({ result });
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', apiConfigured: !!MINIMAX_API_KEY });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Status: ${MINIMAX_API_KEY ? 'Configured' : 'NOT CONFIGURED - Add your API key'}`);
});
