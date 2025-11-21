const express = require('express');
const auth = require('../middleware/auth');
const { listUsers } = require('../controllers/userController');

const router = express.Router();

router.use(auth);

router.get('/', listUsers);

module.exports = router;


