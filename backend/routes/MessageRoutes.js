const express = require('express');
const MessageController = require('../controllers/Message/MessageController');
const { getMessageForTeam, createMessage } = MessageController;
const router = express.Router();

router.get('/team/:teamId', getMessageForTeam);
router.post('/create', createMessage);

module.exports = router;