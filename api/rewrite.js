// Vercel API Route for Content Rewriting
// Deploy to Vercel and set MINIMAX_API_KEY in Vercel Dashboard

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_BASE_URL = 'https://api.minimax.io/anthropic';

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

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { text, style } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        
        // Check if API key is configured
        if (!MINIMAX_API_KEY) {
            return res.status(500).json({ 
                error: 'API key not configured',
                message: 'Please set MINIMAX_API_KEY in Vercel environment variables'
            });
        }
        
        const selectedStyle = style || 'professional';
        const prompt = stylePrompts[selectedStyle] || stylePrompts.professional;
        
        // Call MiniMax API (Anthropic-compatible)
        const response = await fetch(`${MINIMAX_BASE_URL}/v1/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': MINIMAX_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'MiniMax-M2.5',
                max_tokens: 4096,
                system: 'You are a professional content rewriter. Rewrite the given text according to the specified style while maintaining the original meaning.',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `${prompt}\n\nOriginal text:\n${text}`
                            }
                        ]
                    }
                ]
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
        let result = '';
        for (const block of data.content) {
            if (block.type === 'text') {
                result += block.text;
            } else if (block.type === 'thinking') {
                result += block.thinking;
            }
        }
        
        return res.status(200).json({ result });
        
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}
