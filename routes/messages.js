const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getMessages, createMessage } = require('../controllers/messageController');

router.get('/:roomId', authenticate, getMessages);
router.post('/', authenticate, createMessage);

module.exports = router;

