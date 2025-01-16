const express = require('express');
const router = express.Router();
const Teamcontroller = require('../controllers/Team/Teamcontroller');
const { TeamCreation, AddUsersToTeam, getUserofTeam, getAllTeam, updateMembersOfTeam, JoinTeam, deleteTeam } = Teamcontroller;

router.post('/createTeam', TeamCreation);
router.post('/:teamId/users', AddUsersToTeam);
router.get('/getAll', getUserofTeam);
router.get('/getAllTeam', getAllTeam);
router.post('/updateTeam', updateMembersOfTeam);
router.post('/joinTeam', JoinTeam);
router.delete('/delete/:id', deleteTeam);

module.exports = router;       