# AI Trading System - Deployment Instructions

## Prerequisites
- GitHub account
- Railway account (free tier available)
- Vercel account (free tier available)
- Git installed on your computer

## Step 1: Push to GitHub

1. Create a new repository on GitHub (public or private)
2. Clone it to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

3. Copy all files from this folder to your repository:
   - requirements.txt
   - README.md
   - index.html
   - style.css
   - app.js
   - ai_trading_backend.py
   - railway.json
   - vercel.json

4. Commit and push:
   ```bash
   git add .
   git commit -m "Initial commit - AI Trading System"
   git push origin main
   ```

## Step 2: Deploy Backend to Railway

1. Go to https://railway.app and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect it's a Python project
5. Wait for deployment to complete (2-3 minutes)
6. Click on your project → Settings → Domains
7. Copy your Railway domain (looks like: your-project.up.railway.app)

## Step 3: Update WebSocket URL

1. Edit `app.js` in your repository
2. Change line 4:
   ```javascript
   // From:
   this.wsUrl = 'ws://localhost:8765';
   
   // To (replace with your actual Railway URL):
   this.wsUrl = 'wss://YOUR-RAILWAY-PROJECT.up.railway.app';
   ```

3. Commit and push:
   ```bash
   git add app.js
   git commit -m "Update WebSocket URL for production"
   git push origin main
   ```

## Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project" → "Import Git Repository"
3. Select your repository
4. Import and deploy with default settings
5. Your frontend will be live at: https://your-project.vercel.app

## Step 5: Verify Deployment

1. Visit your Vercel frontend URL
2. Check that the connection status shows "Connesso"
3. Verify real-time data updates are working

## Troubleshooting

If you see "Disconnesso":
1. Double-check the WebSocket URL in app.js
2. Make sure you're using 'wss://' (not 'ws://') for the production URL
3. Ensure your Railway backend is running
4. Check browser console for errors (F12)

Your AI Trading system should now be fully live and operational!