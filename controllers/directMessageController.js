const DirectConversation = require('../models/DirectConversation');
const DirectMessage = require('../models/DirectMessage');
const User = require('../models/User');

const sanitizeConversationResponse = (conversation, currentUserId) => {
    const otherParticipant = conversation.participants.find(
        participant => participant._id.toString() !== currentUserId.toString()
    );

    return {
        _id: conversation._id,
        otherParticipant: otherParticipant ? {
            id: otherParticipant._id,
            username: otherParticipant.username,
            email: otherParticipant.email,
            avatar: otherParticipant.avatar || ''
        } : null,
        updatedAt: conversation.updatedAt,
        createdAt: conversation.createdAt,
        lastMessage: conversation.lastMessage ? {
            _id: conversation.lastMessage._id,
            text: conversation.lastMessage.text,
            createdAt: conversation.lastMessage.createdAt,
            sender: conversation.lastMessage.sender ? {
                id: conversation.lastMessage.sender._id,
                username: conversation.lastMessage.sender.username
            } : null
        } : null
    };
};

const getConversations = async (req, res) => {
    try {
        const conversations = await DirectConversation.find({
            participants: req.user._id
        })
            .sort({ updatedAt: -1 })
            .populate('participants', 'username email avatar')
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender', select: 'username' }
            });

        res.json(conversations.map(conversation => 
            sanitizeConversationResponse(conversation, req.user._id)
        ));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createConversation = async (req, res) => {
    try {
        const { targetUserId, username } = req.body;

        if (!targetUserId && !username) {
            return res.status(400).json({ error: 'Target user is required' });
        }

        let targetUser = null;

        if (targetUserId) {
            targetUser = await User.findById(targetUserId);
        } else if (username) {
            targetUser = await User.findOne({
                username: new RegExp(`^${username}$`, 'i')
            });
        }

        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (targetUser._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ error: 'Cannot start a conversation with yourself' });
        }

        const participantKey = [req.user._id.toString(), targetUser._id.toString()]
            .sort()
            .join(':');

        let conversation = await DirectConversation.findOne({ participantKey })
            .populate('participants', 'username email avatar')
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender', select: 'username' }
            });

        if (!conversation) {
            conversation = new DirectConversation({
                participants: [req.user._id, targetUser._id],
                participantKey
            });
            await conversation.save();

            await conversation.populate('participants', 'username email avatar');
        }

        res.status(201).json(sanitizeConversationResponse(conversation, req.user._id));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const conversation = await DirectConversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const isParticipant = conversation.participants
            .some(participantId => participantId.toString() === req.user._id.toString());

        if (!isParticipant) {
            return res.status(403).json({ error: 'Not authorized to view this conversation' });
        }

        const messages = await DirectMessage.find({ conversation: conversationId })
            .sort({ createdAt: 1 })
            .limit(200)
            .populate('sender', 'username')
            .populate('recipient', 'username');

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sendDirectMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Message text is required' });
        }

        const conversation = await DirectConversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const isParticipant = conversation.participants
            .some(participantId => participantId.toString() === req.user._id.toString());

        if (!isParticipant) {
            return res.status(403).json({ error: 'Not authorized to send messages in this conversation' });
        }

        const recipientId = conversation.participants.find(
            participantId => participantId.toString() !== req.user._id.toString()
        );

        const message = new DirectMessage({
            conversation: conversationId,
            sender: req.user._id,
            recipient: recipientId,
            text
        });

        await message.save();
        await message.populate('sender', 'username');

        conversation.lastMessage = message._id;
        await conversation.save();

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getConversations,
    createConversation,
    getConversationMessages,
    sendDirectMessage
};


