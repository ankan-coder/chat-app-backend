const mongoose = require('mongoose');

const aiConversationSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'New Chat'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },
        text: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

aiConversationSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('AiConversation', aiConversationSchema);

