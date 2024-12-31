const express = require('express');
const router = express.Router();
const sendMail = require('../controllers/email/Emailcontroller');


router.post('/send-invitation', sendMail);

module.exports = router;