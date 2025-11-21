# ⚡ Quick Deploy Guide

**5-minute setup to deploy your chat app!**

## 🎯 What You Need

1. GitHub account
2. Render account (https://render.com - sign up with GitHub)
3. MongoDB Atlas account (https://mongodb.com/cloud/atlas)
4. Gemini API key (https://makersuite.google.com/app/apikey)

---

## 📝 Step-by-Step (15 minutes total)

### Part 1: MongoDB (3 minutes)

1. Create MongoDB Atlas account
2. Create free cluster (M0)
3. Create database user + password
4. Network Access → Add IP → Allow from Anywhere (0.0.0.0/0)
5. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/`)

### Part 2: Backend to Render (5 minutes)

1. **Create GitHub repo for backend:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Deploy to Render"
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/chat-backend.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect your `chat-backend` repo
   - Settings:
     - Build: `npm install`
     - Start: `npm start`
     - Plan: Free
   - Environment variables (click "Advanced"):
     ```
     PORT=3000
     MONGODB_URI=your_mongodb_connection_string_here
     JWT_SECRET=make_this_a_long_random_string_32_chars
     GEMINI_API_KEY=your_gemini_api_key_here
     GEMINI_MODEL=gemini-2.5-flash
     FRONTEND_URL=https://yourusername.github.io/chat-frontend
     ```
   - Click "Create Web Service"
   - **Save your Render URL!** (e.g., `https://chat-backend-abc123.onrender.com`)

3. **Test:** Visit `https://your-render-url.onrender.com/api/health` → Should show `{"status":"OK"}`

### Part 3: Frontend to GitHub Pages (5 minutes)

1. **Update config file:**
   - Open `frontend/js/config.js`
   - Replace `YOUR_BACKEND_URL` with your actual Render URL (both places)
   - Example:
     ```javascript
     API_BASE_URL: isDevelopment 
         ? 'http://localhost:3000/api'
         : 'https://chat-backend-abc123.onrender.com/api',
     
     SOCKET_URL: isDevelopment
         ? 'http://localhost:3000'
         : 'https://chat-backend-abc123.onrender.com',
     ```

2. **Push to GitHub:**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Deploy to GitHub Pages"
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/chat-frontend.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repo → Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: / (root)
   - Save
   - **Your app will be at:** `https://YOUR_USERNAME.github.io/chat-frontend/`

### Part 4: Final Update (2 minutes)

1. **Update backend CORS:**
   - Go back to Render dashboard
   - Your web service → Environment
   - Update `FRONTEND_URL` to your GitHub Pages URL
   - Save (auto-redeploys)

2. **Test everything:**
   - Visit your GitHub Pages URL
   - Register an account
   - Try AI chat
   - Create a room and chat

---

## ✅ Done!

Your app is now live! 🎉

**Share your app:** `https://YOUR_USERNAME.github.io/chat-frontend/`

---

## 🔄 To Update Later

**Update Backend:**
```bash
cd backend
# make changes
git add .
git commit -m "Update"
git push
# Render auto-deploys
```

**Update Frontend:**
```bash
cd frontend
# make changes
git add .
git commit -m "Update"
git push
# GitHub Pages auto-deploys (1-2 min)
```

---

## 🆘 Problems?

### Backend won't start on Render?
- Check "Logs" tab in Render dashboard
- Verify environment variables are set correctly
- Make sure MongoDB connection string is valid

### Frontend shows CORS error?
- Check `FRONTEND_URL` in Render matches GitHub Pages URL exactly
- No trailing slash!

### Socket.io won't connect?
- Make sure `config.js` has correct URL
- Wait 30-60 seconds if backend is "cold starting"
- Check browser console for errors

### Need more help?
See the full `DEPLOYMENT_GUIDE.md` for detailed troubleshooting!

---

## 💰 Cost: $0/month (100% FREE!)

- Render: Free tier (750 hrs/month)
- GitHub Pages: Free unlimited
- MongoDB Atlas: Free tier (512 MB)

**Note:** Render free tier "sleeps" after 15 min of inactivity. First request takes 30-60s to wake up. Use UptimeRobot (free) to keep it awake if needed.

