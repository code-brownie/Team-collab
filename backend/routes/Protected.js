const express = require('express');
const { verifyToken } = require('../middleware/UserAuth');
const router = express.Router();


router.get('/protected', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
