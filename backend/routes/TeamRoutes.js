const express = require('express');
const Teamcontroller = require('../controllers/Team/Teamcontroller');
const { TeamCreation, AddUsersToTeam, getUserofTeam } = Teamcontroller;
const router = express.Router();

router.post('/createTeam', TeamCreation);
router.post('/:teamId/users', AddUsersToTeam);
router.get('/getAll', getUserofTeam);

module.exports = router;