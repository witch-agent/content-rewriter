// Vercel API Route for Content Rewriting
// Deploy to Vercel and set MINIMAX_API_KEY in Vercel Dashboard

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_BASE_URL = 'https://api.minimax.io/anthropic';

// Professional prompts for each style - optimized for MiniMax M2.5
const stylePrompts = {
    professional: `You are an expert content writer with 10+ years of experience in business communication. Your task is to rewrite the given text in a PROFESSIONAL manner.

Requirements:
- Use formal, business-appropriate language
- Maintain a confident, authoritative tone
- Structure the content with clear paragraphs
- Keep all factual information intact
- Use professional vocabulary without being stiff
- Add smooth transitions between ideas
- Output ONLY the rewritten content, no explanations or thinking process`,

    casual: `You are a friendly, engaging content writer who excels at making any topic accessible and relatable. Your task is to rewrite the given text in a CASUAL, conversational manner.

Requirements:
- Use a warm, approachable tone as if talking to a friend
- Include colloquial expressions naturally
- Keep sentences varied in length for rhythm
- Make complex ideas simple to understand
- Add personality and warmth
- Maintain accuracy of the original information
- Output ONLY the rewritten content, no explanations`,

    academic: `You are a distinguished academic writer with extensive experience in scholarly publications. Your task is to rewrite the given text in an ACADEMIC style.

Requirements:
- Use formal academic language and terminology
- Maintain objective, impersonal tone
- Structure with clear thesis and supporting points
- Use precise, nuanced vocabulary
- Include logical transitions
- Cite concepts properly without adding fake citations
- Keep all factual facts and data intact
- Output ONLY the rewritten content, no meta-commentary`,

    technical: `You are a senior technical writer with deep expertise in simplifying complex information. Your task is to rewrite the given text in a TECHNICAL style.

Requirements:
- Use precise technical terminology accurately
- Structure information hierarchically with clear sections
- Be concise but comprehensive
- Use active voice where possible
- Define technical terms when first used
- Maintain all technical accuracy
- Include practical examples where helpful
- Output ONLY the rewritten content`,

    creative: `You are an award-winning creative writer known for captivating storytelling. Your task is to rewrite the given text in a CREATIVE, engaging manner.

Requirements:
- Use vivid, descriptive language
- Employ literary devices (metaphors, similes, personification)
- Create emotional engagement with the reader
- Vary sentence structure for dramatic effect
- Use sensory details where appropriate
- Maintain all factual accuracy
- Make the content memorable and compelling
- Output ONLY the rewritten content`,

    persuasive: `You are a master copywriter and persuasion expert. Your task is to rewrite the given text in a PERSUASIVE manner that drives action.

Requirements:
- Use powerful, action-oriented language
- Build compelling arguments with clear reasoning
- Appeal to both logic and emotion
- Use strong, specific calls-to-action
- Anticipate and address objections
- Create urgency without being manipulative
- Support claims with evidence
- Output ONLY the rewritten content`,

    storytelling: `You are a professional storyteller and narrative designer. Your task is to rewrite the given text as an engaging STORY.

Requirements:
- Create a clear narrative arc (beginning, middle, end)
- Use first or third person perspective naturally
- Include character development if applicable
- Build tension and release
- Use dialogue if it enhances the story
- Make abstract concepts concrete through examples
- Maintain all factual accuracy
- Output ONLY the rewritten content`,

    concise: `You are an expert editor known for distilling complex ideas into clear, impactful content. Your task is to rewrite the given text in a CONCISE manner.

Requirements:
- Remove all unnecessary words and filler
- Keep sentences short and direct
- Eliminate redundant phrases
- Maintain the essential message
- Use strong, active verbs
- Preserve all critical information
- Aim for maximum impact with minimum words
- Output ONLY the rewritten content`
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
        const systemPrompt = stylePrompts[selectedStyle] || stylePrompts.professional;
        
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
                system: systemPrompt,
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `Rewrite the following text:\n\n${text}`
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
        
        // Extract ONLY the text block - ignore thinking blocks
        let result = '';
        for (const block of data.content) {
            if (block.type === 'text') {
                result += block.text;
            }
            // Skip thinking blocks - these are internal AI processes
        }
        
        if (!result) {
            return res.status(500).json({ 
                error: 'No content returned',
                message: 'The AI did not generate any content'
            });
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
