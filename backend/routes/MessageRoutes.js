const express = require('express');
const { getMessageForTeam, createMessage } = require('../controllers/Message/MessageController');
const router = express.Router();

router.get('/team/:teamId', getMessageForTeam);
router.post('/create', createMessage);

module.exports = router;