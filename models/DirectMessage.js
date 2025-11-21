const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DirectConversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    readAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

directMessageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model('DirectMessage', directMessageSchema);


