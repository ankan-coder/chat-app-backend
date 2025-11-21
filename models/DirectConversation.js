const mongoose = require('mongoose');

const directConversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    participantKey: {
        type: String,
        unique: true,
        required: true
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DirectMessage',
        default: null
    }
}, {
    timestamps: true
});

directConversationSchema.pre('validate', function(next) {
    if (this.participants?.length >= 2) {
        const key = this.participants
            .map(id => id.toString())
            .sort()
            .join(':');
        this.participantKey = key;
    }
    next();
});

module.exports = mongoose.model('DirectConversation', directConversationSchema);


