const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Room = require('../models/Room');

router.get('/', authenticate, async (req, res) => {
    try {
        const rooms = await Room.find({
            $or: [
                { type: 'public' },
                { participants: req.user._id }
            ]
        }).populate('createdBy', 'username').sort({ createdAt: -1 });

        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const { name, description, type = 'public' } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Room name is required' });
        }

        const room = new Room({
            name,
            description,
            type,
            createdBy: req.user._id,
            participants: [req.user._id]
        });

        await room.save();
        await room.populate('createdBy', 'username');

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:roomId', authenticate, async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId)
            .populate('createdBy', 'username')
            .populate('participants', 'username');

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

