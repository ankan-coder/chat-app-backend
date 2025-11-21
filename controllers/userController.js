const User = require('../models/User');
const { isUserOnline } = require('../services/presenceService');

const listUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.user._id }
        }).select('username email avatar');

        const formatted = users.map((user) => ({
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar || '',
            isOnline: isUserOnline(user._id)
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { listUsers };


