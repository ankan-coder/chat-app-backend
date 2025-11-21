const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { chatWithAI } = require('../controllers/aiController');

router.post('/chat', authenticate, chatWithAI);

module.exports = router;

