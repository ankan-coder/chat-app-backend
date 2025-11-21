require('dotenv').config();
const path = require('path');
const express = require('express');
const http = require('http');
const fs = require('fs');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const initializeSocket = require('./services/socketService');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

connectDB();
initializeSocket(io);

app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
    const startTime = Date.now();
    const metadata = {
        time: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    };

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(JSON.stringify({
            ...metadata,
            statusCode: res.statusCode,
            durationMs: duration
        }));
    });

    next();
});

const frontendPath = path.join(__dirname, '..', 'frontend');
const hasFrontendBundle = fs.existsSync(path.join(frontendPath, 'index.html'));

if (hasFrontendBundle) {
    app.use(express.static(frontendPath));
}

app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/ai-conversations', require('./routes/aiConversations'));
app.use('/api/direct-messages', require('./routes/directMessages'));
app.use('/api/users', require('./routes/users'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.get('/', (req, res) => {
    if (hasFrontendBundle) {
        return res.sendFile(path.join(frontendPath, 'index.html'));
    }

    return res.json({
        status: 'Backend running',
        frontend: process.env.FRONTEND_URL || 'Hosted separately',
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Global error handlers
process.on('uncaughtException', (error) => {
    console.error('=== UNCAUGHT EXCEPTION ===');
    console.error({
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack
    });
    console.error('==========================');
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('=== UNHANDLED REJECTION ===');
    console.error({
        timestamp: new Date().toISOString(),
        reason: reason,
        promise: promise
    });
    console.error('===========================');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Automatic health check ping every 10 seconds
    setInterval(() => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/api/health',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`[Health Check] ${new Date().toISOString()} - Status: ${res.statusCode}, Response: ${data}`);
            });
        });

        req.on('error', (error) => {
            console.error(`[Health Check Error] ${new Date().toISOString()} - ${error.message}`);
        });

        req.end();
    }, 60000); // 1 minute
});

