const express = require('express');
const router = express.Router();
const { register, login, checkAvailability } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/check', checkAvailability);

module.exports = router;

