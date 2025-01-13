const express = require('express');
const MessageController = require('../controllers/Message/Messagecontroller');
const { getMessageForTeam, createMessage } = MessageController;
const router = express.Router();

router.get('/team/:teamId', getMessageForTeam);
router.post('/create', createMessage);

module.exports = router;