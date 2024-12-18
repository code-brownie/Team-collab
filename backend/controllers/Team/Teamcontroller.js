const Team = require("../../models/Team");
const TeamUser = require("../../models/TeamUser");

// Creating the Team
const TeamCreation = async (req, res) => {
    try {
        const { name, description, adminId } = req.body;
        // Check if the team exists
        const ifExist = await Team.findOne({
            where: {
                name: name
            }
        });
        if (ifExist) {
            return res.status(409).send('Team already exists choose some diffrent team name');
        }
        // if Not the team Exist then Create a new one
        else {
            const data = {
                name,
                description
            };
            const NewTeam = await Team.create(data);
            console.log("Team", JSON.stringify(NewTeam, null, 2));
            // Assign the AdminId for the Team
            const team_data = {
                TeamId: NewTeam.id,
                UserId: adminId,
                role: 'Admin'
            }
            await TeamUser.create(team_data);
            return res.status(201).json({ Team: NewTeam, Message: 'Admin assigned to the Team' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Error creating Team');
    }
}

// Adding the users to the Team
const AddUsersToTeam = async (req, res) => {
    const { teamId } = req.params;
    const { users } = req.body;

    try {

        if (!Array.isArray(users)) {
            return res.status(400).json({ error: 'Users must be an array.' });
        }


        const userIds = users.map(user => user.userId);
        console.log(userIds);

        // Fetch existing users already linked to the team
        const existingTeamUsers = await TeamUser.findAll({
            where: {
                TeamId: teamId,
                UserId: userIds 
            },
        });

    
        const existingUserIds = existingTeamUsers.map(record => record.UserId);


        const newUsers = users.filter(user => !existingUserIds.includes(user.userId));

        // If all users are already in the team
        if (newUsers.length === 0) {
            return res.status(400).json({ error: 'All users are already part of the team.' });
        }

        const teamUsersToAdd = newUsers.map(user => ({
            TeamId: teamId,
            UserId: user.userId,
            role: user.role || 'Member'
        }));

        await TeamUser.bulkCreate(teamUsersToAdd);

        res.status(201).json({
            message: 'Users added to the team successfully.',
            addedUsers: teamUsersToAdd
        });
    } catch (error) {
        console.error('Error adding users to the team:', error);
        res.status(500).json({ error: 'Failed to add users to the team.' });
    }
}

module.exports = { TeamCreation, AddUsersToTeam };