const crypto = require('crypto');
const Team = require("../../models/Team");
const TeamUser = require("../../models/TeamUser");
const User = require("../../models/User");
const Project = require('../../models/Project');
// Generating the Random code
const generateJoinCode = () => {
    return crypto.randomBytes(4)
        .toString('hex')
        .toUpperCase();
};

// Creating the Team
const TeamCreation = async (req, res) => {
    try {
        const { name, description, adminId } = req.body;
        console.log('req', req.body);
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
        let joinCode;
        let isCodeUnique = false;

        while (!isCodeUnique) {
            joinCode = generateJoinCode();
            // Check if the code already exists
            const existingTeamWithCode = await Team.findOne({
                where: {
                    joinCode: joinCode
                }
            });

            if (!existingTeamWithCode) {
                isCodeUnique = true;
            }
        }

        // Create new team with the join code
        const data = {
            name,
            description,
            joinCode
        };

        const NewTeam = await Team.create(data);
        console.log("Team", JSON.stringify(NewTeam, null, 2));

        // Assign the AdminId for the Team
        const team_data = {
            TeamId: NewTeam.id,
            UserId: adminId,
            role: 'Admin'
        };

        await TeamUser.create(team_data);

        return res.status(201).json({
            Team: NewTeam,
            Message: 'Admin assigned to the Team'
        });

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

        // Fetch existing users already linked to the team
        const existingTeamUsers = await TeamUser.findAll({
            where: {
                TeamId: teamId,
                UserId: users
            },
        });


        const existingUserIds = existingTeamUsers.map(record => record.UserId);


        const newUsers = users.filter(user => !existingUserIds.includes(user));
        // If all users are already in the team
        if (newUsers.length === 0) {
            return res.status(400).json({ error: 'All users are already part of the team.' });
        }

        const teamUsersToAdd = newUsers.map(user => ({
            TeamId: teamId,
            UserId: user,
            role: user.role || 'Member'
        }));
        await TeamUser.bulkCreate(teamUsersToAdd);

        res.status(201).json({
            message: 'Users added to the team successfully.',
            addedUsers: teamUsersToAdd
        });
    } catch (error) {
        // console.error('Error adding users to the team:', error);
        res.status(500).json({ error: 'Failed to add users to the team.' });
    }
}
// Get all member of a team
const getUserofTeam = async (req, res) => {
    const { teamId } = req.query;

    if (!teamId) {
        return res.status(400).send('Please provide the teamId');
    }

    try {
        const members = await Team.findOne({
            where: { id: teamId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email'],
                    through: { attributes: ['role'] },
                },
            ],
        });

        if (!members) {
            return res.status(404).send('No team members found');
        }

        return res.status(200).json({ members });
    } catch (error) {
        console.error('Error fetching team members:', error);
        return res.status(500).send('Internal server error');
    }
};
//Get all the Team
const getAllTeam = async (req, res) => {
    try {
        const allTeams = await Team.findAll({
            include:
            {
                model: User,
                attributes: ['id', 'name', 'email'],
                through: { attributes: ['role'] },
            },
        });
        if (!allTeams) return res.status(404).send('No Team Found');
        return res.status(200).json({ allTeams });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal server Error');
    }
}

// Update the Team Member
const updateMembersOfTeam = async (req, res) => {
    const { users, teamId } = req.body;

    try {
        if (!Array.isArray(users)) {
            return res.status(400).json({ error: 'Users must be an array.' });
        }

        // Fetch existing team members from the database
        const existingTeamUsers = await TeamUser.findAll({
            where: { TeamId: teamId },
        });

        const existingUserIds = existingTeamUsers.map(record => record.UserId);

        // Determine users to be added and removed
        const usersToAdd = users.filter(userId => !existingUserIds.includes(userId));
        const usersToRemove = existingUserIds.filter(userId => !users.includes(userId));

        // Add new users
        if (usersToAdd.length > 0) {
            const teamUsersToAdd = usersToAdd.map(userId => ({
                TeamId: teamId,
                UserId: userId,
                role: 'Member',
            }));

            await TeamUser.bulkCreate(teamUsersToAdd);
        }

        // Remove users who are no longer part of the team
        if (usersToRemove.length > 0) {
            await TeamUser.destroy({
                where: {
                    TeamId: teamId,
                    UserId: usersToRemove,
                },
            });
        }
        return res.status(201).json({
            message: 'Users added to the team successfully.',
        });
    } catch (error) {
        console.error('Error updating team members:', error);
        res.status(500).json({ error: 'Failed to update team members.' });
    }
};

// Join the Team
const JoinTeam = async (req, res) => {
    const { joinCode, userId } = req.body;

    try {
        // Validate joinCode and userId
        if (!joinCode || !userId) {
            return res.status(400).json({ message: "Join code and user ID are required." });
        }

        // Find the team by join code
        const team = await Team.findOne({
            where: { joinCode },
            include: {
                model: User,
                through: { attributes: ["role"] }, // Include role from TeamUser table
            },
        });

        if (!team) {
            return res.status(404).json({ message: "Invalid join code." });
        }

        // Check if the user is already a member
        const isAlreadyMember = team.Users.some((user) => user.id === userId);

        if (isAlreadyMember) {
            return res.status(400).json({ message: "You are already a member of this team." });
        }

        // Add user to the team
        await TeamUser.create({
            UserId: userId,
            TeamId: team.id,
            role: "Member",
        });

        // Fetch all the Project of the Team
        const teamProjects = await Project.findAll({ where: { teamId: team.id } });

        //Add the user to all the Projects
        if (teamProjects.length > 0) {
            const user = await User.findByPk(userId);
            await Promise.all(
                teamProjects.map((project) =>
                    user.addProject(project, {
                        through: { dateJoined: new Date() },
                    })
                )
            );
        }

        // Fetch updated team members
        const updatedTeam = await Team.findOne({
            where: { id: team.id },
            include: {
                model: User,
                attributes: ["id", "name", "email"],
                through: { attributes: ["role"] },
            },
        });

        return res.status(200).json({
            message: "Successfully joined the team and linked to projects.",
            teamId: team.id,
            updatedMembers: updatedTeam.Users,
        });
    } catch (error) {
        console.error("Error in joinTeam:", error.message);
        return res.status(500).json({ message: "An error occurred while joining the team." });
    }
}

module.exports = { TeamCreation, AddUsersToTeam, getUserofTeam, getAllTeam, updateMembersOfTeam, JoinTeam };