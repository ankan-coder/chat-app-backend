# Advanced Chat App

A full-stack chat application with AI integration, real-time messaging, and MongoDB storage.

---

## 🚀 **Want to Deploy? [START HERE!](START_HERE.md)**

Your app is ready for FREE production deployment. Complete documentation included! ✨

---

## Features

- **Dual Chat Modes**: AI chat (Gemini) and real-time user-to-user chat
- **Direct Messages**: Private 1:1 conversations between users
- **Real-time Messaging**: Socket.io for instant message delivery
- **Multiple Chat Rooms**: Create and join public/private rooms
- **User Authentication**: JWT-based authentication system
- **Message Persistence**: MongoDB for storing chat history
- **Simple UI**: Clean black and white design

## Project Structure

```
Chat App/
├── frontend/          # Frontend application
│   ├── index.html
│   ├── styles/
│   └── js/
└── backend/           # Backend server
    ├── server.js
    ├── models/
    ├── routes/
    ├── controllers/
    └── services/
```

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Get Your API Keys

**MongoDB:**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string
- Replace `<password>` with your database password

**Gemini API:**
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create an API key
- Copy it to your `.env` file

### 4. Start the Backend Server

```bash
cd backend
npm start
```

The server will run on `http://localhost:3000`

### 5. Open the Frontend

The backend now serves the frontend files. After starting the server, visit:

- `http://localhost:3000/` for the main app
- `http://localhost:3000/register.html` for the full registration page

## Usage

1. **Register/Login**: Use `register.html` for full-page signup or the inline modal to create an account, then login
2. **Choose Mode**: Toggle between AI Chat and User Chat
3. **AI Chat**: Start chatting with Gemini AI directly
4. **User Chat**: Create or join a room to chat with other users
5. **Real-time**: Messages appear instantly for all users in the room

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create new room
- `GET /api/messages/:roomId` - Get room messages
- `POST /api/ai/chat` - Chat with AI

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6 Modules)
- **Backend**: Node.js, Express, @google/genai
- **Real-time**: Socket.io
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini API
- **Authentication**: JWT

## 🚀 Deployment

Ready to deploy your app to production?

- **Quick Start**: See [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for a 15-minute deployment guide
- **Detailed Guide**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive instructions
- **Checklist**: Use [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) to track your progress

**Recommended Setup:**
- Backend → Render (Free)
- Frontend → GitHub Pages (Free)
- Database → MongoDB Atlas (Free)

**Total Cost: $0/month!** 🎉

## License

ISC
