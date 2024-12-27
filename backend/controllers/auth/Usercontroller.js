const User = require("../../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Team = require('../../models/Team');
const Project = require("../../models/Project");
const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const data = {
            name,
            email,
            password: await bcrypt.hash(password, 10),
        };
        //save the user
        const user = await User.create(data);
        // generate the token
        if (user) {
            let token = jwt.sign({ id: user.id }, process.env.secretKey);

            res.cookie('jwt', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
            console.log("user", JSON.stringify(user, null, 2));
            console.log(token);
            return res.status(201).json({ user: user, token: token });
        }
        else {
            return res.status(409).json({ Message: "Details are not correct" });
        }
    }
    catch (err) {
        console.log(err);
    }
};
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        //find a user by email
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            const isSame = await bcrypt.compare(password, user.password);

            if (isSame) {
                let token = jwt.sign({ id: user.id }, process.env.secretKey);

                res.cookie("jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
                console.log("user", JSON.stringify(user, null, 2));
                console.log(token);
                //send user data
                return res.status(201).json({ user: user, token: token });
            } else {
                return res.status(401).send("Authentication failed");
            }
        } else {
            return res.status(401).send("Authentication failed");
        }
    }
    catch (err) {
        console.log(err);
    }
};
const getAllUser = async (req, res) => {
    try {
        const users = await User.findAll();
        if (users) {
            return res.status(201).json({ users });
        }
        else {
            return res.status(200).json({ message: 'No user found!!' });
        }
    } catch (error) {
        console.log('Error', error.message);
        return res.status(500).send('Error while fetching all user');
    }
}
const getUserProjects = async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(404).send('User is required');
    try {
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Project,
                    through: { attributes: ['dateJoined'] },
                    include: { model: Team }
                }
            ]
        });
        if (!user.Projects) {
            return res.status(200).json({ message: 'No projects found' });
        }
        const projects = user.Projects;
        return res.status(201).json({ projects });
    } catch (error) {
        console.log('error', error.message);
        return res.status(500).send('Internal server error');
    }
}
module.exports = { signUp, signIn, getAllUser, getUserProjects };