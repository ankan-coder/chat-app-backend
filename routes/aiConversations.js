const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const AiConversation = require('../models/AiConversation');

// Get all AI conversations for user
router.get('/', authenticate, async (req, res) => {
    try {
        const conversations = await AiConversation.find({ userId: req.user._id })
            .sort({ updatedAt: -1 })
            .select('title createdAt updatedAt messages');

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new AI conversation
router.post('/', authenticate, async (req, res) => {
    try {
        const { title } = req.body;

        const conversation = new AiConversation({
            title: title || 'New Chat',
            userId: req.user._id,
            messages: []
        });

        await conversation.save();
        res.status(201).json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single AI conversation
router.get('/:id', authenticate, async (req, res) => {
    try {
        const conversation = await AiConversation.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update AI conversation title
router.patch('/:id', authenticate, async (req, res) => {
    try {
        const { title } = req.body;

        const conversation = await AiConversation.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, updatedAt: new Date() },
            { new: true }
        );

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete AI conversation
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const conversation = await AiConversation.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json({ message: 'Conversation deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add message to conversation
router.post('/:id/messages', authenticate, async (req, res) => {
    try {
        const { role, text } = req.body;

        const conversation = await AiConversation.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        conversation.messages.push({
            role,
            text,
            timestamp: new Date()
        });

        // Auto-generate title from first user message
        if (conversation.messages.length === 1 && role === 'user') {
            conversation.title = text.substring(0, 50) + (text.length > 50 ? '...' : '');
        }

        await conversation.save();
        res.json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

