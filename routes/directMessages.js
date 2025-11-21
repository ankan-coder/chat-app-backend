const express = require('express');
const auth = require('../middleware/auth');
const {
    getConversations,
    createConversation,
    getConversationMessages,
    sendDirectMessage
} = require('../controllers/directMessageController');

const router = express.Router();

router.use(auth);

router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:conversationId/messages', getConversationMessages);
router.post('/conversations/:conversationId/messages', sendDirectMessage);

module.exports = router;


