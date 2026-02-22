# Content Rewriter Pro

AI-powered content rewriter with MiniMax API integration.

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
