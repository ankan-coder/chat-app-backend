const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // MongoDB connection error handlers
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', {
                timestamp: new Date().toISOString(),
                error: err.message,
                stack: err.stack
            });
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected:', {
                timestamp: new Date().toISOString()
            });
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
};

module.exports = connectDB;

