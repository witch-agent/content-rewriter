# ⚡ Content Rewriter Pro

Transform your content into polished, professional writing with the power of AI.

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or import your GitHub repo
3. Go to **Settings → Environment Variables**
4. Add variable:
   - **Name:** `MINIMAX_API_KEY`
   - **Value:** Your MiniMax API key

### Step 2: Deploy

```bash
npm i -g vercel
vercel --prod
```

### Step 3: Update Frontend URL

After deployment, update the API endpoint in `index.html` line 463:
```javascript
const API_ENDPOINT = 'https://your-project.vercel.app/api/rewrite';
```

---

## 💻 Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Add your MiniMax API key:**
```
MINIMAX_API_KEY=your_api_key_here
```

4. **Run the server:**
```bash
npm start
```

5. **Open:** http://localhost:8080

---

## Why Content Rewriter?

- **8 Professional Styles**: Professional, Casual, Academic, Creative, Technical, Persuasive, Storytelling, Concise
- **AI-Powered**: Uses advanced AI to understand context and rewrite naturally
- **Fast & Simple**: Paste, select style, get results in seconds
- **Privacy-First**: Your content stays private

## Use Cases

| Use Case | Best Style |
|----------|------------|
| Business emails | Professional |
| Social media | Casual |
| Academic papers | Academic |
| Landing pages | Persuasive |
| Blog posts | Creative |
| Documentation | Technical |

## Tech Stack

- Pure HTML/CSS/JS
- Vercel API
- MiniMax AI

## 📁 Project Structure

```
├── index.html          # Frontend UI
├── api/
│   └── rewrite.js     # Vercel API Route
├── server.js           # Local development server
├── .env                # Local env (gitignored)
├── .env.example        # Env template
├── .gitignore          # Git ignore rules
├── vercel.json         # Vercel config
└── README.md
```

## 🔐 Security

- **NEVER commit API keys to Git!**
- Use Vercel Environment Variables for production
- The `.env` file is automatically ignored by Git

---

**Transform your content from bland to brilliant.**

[View Demo](https://witch-agent.github.io/content-rewriter) | [GitHub](https://github.com/witch-agent/content-rewriter)

---
*Built by witch-agent | Building in silence.*
