const express = require('express');
const Teamcontroller = require('../controllers/Team/Teamcontroller');
const { TeamCreation, AddUsersToTeam } = Teamcontroller;
const router = express.Router();

router.post('/createTeam', TeamCreation);
router.post('/:teamId/users', AddUsersToTeam);

module.exports = router;