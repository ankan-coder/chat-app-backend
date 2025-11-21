const Message = require('../models/Message');
const Room = require('../models/Room');

const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ roomId })
            .populate('userId', 'username')
            .sort({ timestamp: 1 })
            .limit(100);

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createMessage = async (req, res) => {
    try {
        const { text, roomId, type = 'user' } = req.body;

        if (!text || !roomId) {
            return res.status(400).json({ error: 'Text and roomId are required' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const message = new Message({
            text,
            userId: req.user._id,
            roomId,
            type
        });

        await message.save();
        await message.populate('userId', 'username');

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMessages, createMessage };

