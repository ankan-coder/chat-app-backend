# 🚀 Deployment Checklist

Use this checklist to ensure smooth deployment of your chat app!

## ✅ Pre-Deployment Checklist

### MongoDB Setup
- [ ] Create MongoDB Atlas account
- [ ] Create a cluster (free M0 tier)
- [ ] Create a database user with password
- [ ] Get connection string
- [ ] Whitelist all IPs (0.0.0.0/0) in Network Access
- [ ] Test connection locally

### API Keys
- [ ] Get Gemini API key from Google AI Studio
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Save all keys securely

### Code Preparation
- [ ] Update `frontend/js/config.js` with your Render backend URL
- [ ] Test app locally before deploying
- [ ] Remove any hardcoded sensitive data
- [ ] Check that `.env` is in `.gitignore`

---

## 🖥️ Backend Deployment (Render)

### Repository Setup
- [ ] Create GitHub repository for backend
- [ ] Initialize git in `/backend` folder
- [ ] Add, commit, and push to GitHub
  ```bash
  cd backend
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin YOUR_GITHUB_REPO_URL
  git push -u origin main
  ```

### Render Configuration
- [ ] Sign up/login to Render (https://render.com)
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure service:
  - Runtime: Node
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Instance Type: Free

### Environment Variables (Add in Render)
- [ ] `PORT` = 3000
- [ ] `MONGODB_URI` = (your MongoDB connection string)
- [ ] `JWT_SECRET` = (strong random string)
- [ ] `GEMINI_API_KEY` = (your Gemini API key)
- [ ] `GEMINI_MODEL` = gemini-2.5-flash
- [ ] `FRONTEND_URL` = (will add after frontend deployment)

### Deployment & Testing
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete (~5-10 min)
- [ ] Copy your Render backend URL
- [ ] Test health endpoint: `https://YOUR_APP.onrender.com/api/health`
- [ ] Should return: `{"status":"OK"}`

---

## 🌐 Frontend Deployment (GitHub Pages)

### Update Configuration
- [ ] Open `frontend/js/config.js`
- [ ] Replace `YOUR_BACKEND_URL` with your actual Render URL (both places)
- [ ] Save the file

### Repository Setup
- [ ] Create GitHub repository for frontend
- [ ] Initialize git in `/frontend` folder
- [ ] Add, commit, and push to GitHub
  ```bash
  cd frontend
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin YOUR_GITHUB_REPO_URL
  git push -u origin main
  ```

### GitHub Pages Configuration
- [ ] Go to repository Settings on GitHub
- [ ] Click "Pages" in sidebar
- [ ] Source: Deploy from a branch
- [ ] Branch: main, folder: / (root)
- [ ] Click Save
- [ ] Wait 1-2 minutes for deployment
- [ ] Copy your GitHub Pages URL

---

## 🔄 Final Configuration

### Update Backend CORS
- [ ] Go back to Render dashboard
- [ ] Open your backend service
- [ ] Go to "Environment" tab
- [ ] Add/Update `FRONTEND_URL` with your GitHub Pages URL
- [ ] Save (will trigger redeploy, ~2-3 min)

---

## 🧪 Final Testing

### Basic Functionality
- [ ] Open your GitHub Pages URL
- [ ] App loads without errors
- [ ] Register a new account
- [ ] Login works
- [ ] AI chat works
- [ ] Can create chat rooms
- [ ] Messages send and receive
- [ ] Socket.io connection established

### Browser Console Check
- [ ] Open DevTools (F12)
- [ ] No CORS errors in Console
- [ ] No 404 errors in Network tab
- [ ] Socket.io shows "Connected to server"

### Multi-User Testing
- [ ] Open app in incognito/private window
- [ ] Register second user
- [ ] Both users join same room
- [ ] Test real-time messaging between users
- [ ] Messages appear instantly for both users

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Check:**
- [ ] `FRONTEND_URL` in Render matches GitHub Pages URL exactly
- [ ] No trailing slash in URLs
- [ ] Backend service is running

### Issue: Socket.io Connection Failed
**Check:**
- [ ] `config.js` has correct Socket URL
- [ ] Using HTTPS (not HTTP)
- [ ] Backend service is awake (might need 30-60s for cold start)

### Issue: MongoDB Connection Error
**Check:**
- [ ] Connection string is correct
- [ ] Database user has proper permissions
- [ ] IP whitelist includes 0.0.0.0/0
- [ ] Using correct database name

### Issue: 404 on Frontend
**Check:**
- [ ] Pushed to correct branch (main)
- [ ] GitHub Pages is enabled
- [ ] index.html is in repository root
- [ ] Wait a few minutes for deployment

---

## 📊 Your Deployment URLs

Fill these in once deployed:

- **Backend URL**: `https://___________________.onrender.com`
- **Frontend URL**: `https://___________________.github.io/___________________`
- **MongoDB Cluster**: `___________________`

---

## 🎉 Post-Deployment

### Optional Enhancements
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Add custom domain (if you have one)
- [ ] Enable GitHub Actions for automated deployments
- [ ] Set up error monitoring (Sentry)
- [ ] Add analytics (Google Analytics, Plausible)

### Maintenance
- [ ] Regularly check Render logs for errors
- [ ] Monitor MongoDB usage
- [ ] Update dependencies monthly: `npm update`
- [ ] Run security audit: `npm audit fix`

---

## 📝 Notes

Use this space for any deployment-specific notes:

```
Deployment Date: ___________
Backend URL: ___________
Frontend URL: ___________
MongoDB Database: ___________
Issues Encountered: ___________
```

---

**🎊 Congratulations on your deployment!**

Share your app URL with friends and start chatting! 💬

