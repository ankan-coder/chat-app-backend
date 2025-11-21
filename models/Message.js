const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    type: {
        type: String,
        enum: ['user', 'ai'],
        default: 'user'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);

