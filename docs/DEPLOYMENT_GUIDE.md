# Deployment Guide: Backend on Render + Frontend on GitHub Pages

## 🎯 Overview
This guide will help you deploy:
- **Backend** → Render (free tier)
- **Frontend** → GitHub Pages (free)

## 📦 Prerequisites
- GitHub account
- Render account (sign up at https://render.com)
- MongoDB Atlas account (free tier at https://www.mongodb.com/cloud/atlas)
- Gemini API key (from https://makersuite.google.com/app/apikey)

---

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Prepare Your Backend Repository

1. **Create a GitHub repository** for your backend:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   ```

2. **Push to GitHub**:
   ```bash
   # Create a new repository on GitHub (e.g., "chat-app-backend")
   git remote add origin https://github.com/YOUR_USERNAME/chat-app-backend.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Render

1. **Go to Render Dashboard**:
   - Visit https://dashboard.render.com/
   - Click "New +" → "Web Service"

2. **Connect Your Repository**:
   - Connect your GitHub account
   - Select the `chat-app-backend` repository
   - Click "Connect"

3. **Configure the Service**:
   - **Name**: `chat-app-backend` (or any name you prefer)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or put `backend` if you push the whole project)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. **Add Environment Variables** (in Render dashboard):
   Click "Advanced" → "Add Environment Variable" and add:
   
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
   JWT_SECRET=your_super_secure_random_string_at_least_32_characters_long
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   FRONTEND_URL=https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME
   ```
   
   **Important Notes**:
   - Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
   - Generate a strong random string for `JWT_SECRET` (use https://www.uuidgenerator.net/)
   - Get `GEMINI_API_KEY` from Google AI Studio
   - Update `FRONTEND_URL` after deploying frontend (Step 2)

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your backend URL will be something like: `https://chat-app-backend-xxxx.onrender.com`

6. **Test Your Backend**:
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - You should see: `{"status":"OK"}`

### ⚠️ Important Notes for Render:

**Free Tier Limitations**:
- Your service will spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- You get 750 hours/month free (enough for one service 24/7)

**Keep Your Service Alive** (Optional):
- Use a free uptime monitoring service like:
  - UptimeRobot (https://uptimerobot.com/)
  - Cron-Job.org (https://cron-job.org/)
- Set it to ping your `/api/health` endpoint every 10-14 minutes

---

## 🌐 Part 2: Deploy Frontend to GitHub Pages

### Step 1: Update Frontend Configuration

**Before deploying**, you need to update the hardcoded URLs in your frontend:

1. **Update `frontend/js/utils/helpers.js`**:
   ```javascript
   // Change this:
   export const API_BASE_URL = 'http://172.16.14.225:3000/api';
   
   // To this (use your Render backend URL):
   export const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
   ```

2. **Update `frontend/js/chat/SocketClient.js`**:
   ```javascript
   // Change this (around line 18):
   this.socket = io('http://localhost:3000', {
   
   // To this (use your Render backend URL):
   this.socket = io('https://your-backend-url.onrender.com', {
   ```

### Step 2: Deploy to GitHub Pages

1. **Create a GitHub repository** for your frontend:
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial frontend commit"
   ```

2. **Push to GitHub**:
   ```bash
   # Create a new repository on GitHub (e.g., "chat-app-frontend")
   git remote add origin https://github.com/YOUR_USERNAME/chat-app-frontend.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" → "Pages" (in the left sidebar)
   - Under "Source", select "Deploy from a branch"
   - Select "main" branch and "/ (root)" folder
   - Click "Save"

4. **Wait for Deployment**:
   - GitHub will deploy your site automatically (1-2 minutes)
   - Your frontend URL will be: `https://YOUR_USERNAME.github.io/chat-app-frontend/`
   - Check the "Pages" section for the live URL

### Step 3: Update Backend CORS Settings

1. **Go back to Render Dashboard**:
   - Open your backend web service
   - Go to "Environment"
   - Update the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://YOUR_USERNAME.github.io/chat-app-frontend
   ```
   - Save changes (this will trigger a redeploy)

---

## 🧪 Testing Your Deployment

1. **Visit your GitHub Pages URL**:
   - `https://YOUR_USERNAME.github.io/chat-app-frontend/`

2. **Test Registration**:
   - Click "Register" and create an account
   - Check browser console (F12) for any errors

3. **Test Chat**:
   - Try AI chat mode
   - Create a room and test user chat
   - Open in multiple tabs/browsers to test real-time messaging

4. **Check for Common Issues**:
   - Open browser DevTools (F12) → Console
   - Look for CORS errors or connection issues
   - Check Network tab for failed requests

---

## 🐛 Troubleshooting

### Issue: CORS Errors
**Solution**: Make sure `FRONTEND_URL` in Render matches your GitHub Pages URL exactly (no trailing slash)

### Issue: Socket.io Connection Failed
**Solution**: 
- Verify the Socket.io URL in `SocketClient.js` is correct
- Check that your Render service is running
- Socket.io should work over HTTPS automatically

### Issue: "Cannot connect to backend"
**Solution**:
- Check if backend is awake (visit `/api/health` endpoint)
- If it's a cold start, wait 30-60 seconds and retry
- Check browser console for exact error messages

### Issue: 404 on GitHub Pages
**Solution**:
- Make sure you pushed the `index.html` to the root of your repository
- Check GitHub Pages settings are correct
- Wait a few minutes for deployment to complete

### Issue: MongoDB Connection Failed
**Solution**:
- Verify your MongoDB Atlas connection string
- Make sure your MongoDB cluster allows connections from anywhere (0.0.0.0/0)
- Check MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere

---

## 💰 Cost Breakdown

- **Render Backend**: FREE (750 hours/month)
- **GitHub Pages**: FREE (unlimited)
- **MongoDB Atlas**: FREE (512 MB storage)
- **Total**: $0/month! 🎉

---

## 🔄 Updating Your Deployment

### To Update Backend:
```bash
cd backend
git add .
git commit -m "Update backend"
git push origin main
```
Render will automatically redeploy.

### To Update Frontend:
```bash
cd frontend
git add .
git commit -m "Update frontend"
git push origin main
```
GitHub Pages will automatically redeploy (1-2 minutes).

---

## 📚 Alternative Hosting Options

### Backend Alternatives:
- **Railway** (https://railway.app/) - Similar to Render, $5/month after free trial
- **Fly.io** (https://fly.io/) - Good free tier
- **Heroku** (https://heroku.com/) - No longer has free tier

### Frontend Alternatives:
- **Vercel** (https://vercel.com/) - Great for static sites, free tier
- **Netlify** (https://netlify.com/) - Similar to Vercel, free tier
- **Cloudflare Pages** (https://pages.cloudflare.com/) - Fast and free

---

## 🔒 Security Recommendations

1. **Never commit `.env` file** to Git
2. **Use strong JWT_SECRET** (at least 32 random characters)
3. **Enable MongoDB Atlas IP Whitelist** for better security
4. **Use HTTPS only** (both Render and GitHub Pages provide this)
5. **Regularly update dependencies**: `npm audit fix`

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/

Good luck with your deployment! 🚀

