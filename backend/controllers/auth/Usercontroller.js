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
            const accessToken = jwt.sign(
                { id: user.id },
                process.env.secretKey,
                { expiresIn: '2h' }
            );
            res.cookie('jwt', accessToken, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });

            return res.status(201).json({
                user: user,
                accessToken: accessToken,
            });
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
        const user = await User.findOne({
            where: { email: email }
        });

        if (user && await bcrypt.compare(password, user.password)) {

            const accessToken = jwt.sign(
                { id: user.id },
                process.env.secretKey,
                { expiresIn: '2h' }
            );


            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.refreshTokenSecret,
                { expiresIn: '7d' }
            );

            await User.update(
                { refreshToken: refreshToken },
                { where: { id: user.id } }
            );

            res.cookie("jwt", accessToken, {
                maxAge: 2 * 60 * 60 * 1000,
                httpOnly: true
            });

            return res.status(201).json({
                user: user,
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        }
        return res.status(401).send("Authentication failed");
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
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
const getUserById = async (req, res) => {
    const { id } = req.query;
    try {
        if (!id) return res.status(404).send('Id not provided');
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).send('User Not found');
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
}
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    try {

        const decoded = jwt.verify(refreshToken, process.env.refreshTokenSecret);


        const user = await User.findOne({
            where: {
                id: decoded.id,
                refreshToken: refreshToken
            }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }


        const newAccessToken = jwt.sign(
            { id: user.id },
            process.env.secretKey,
            { expiresIn: '2h' }
        );

        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
};
module.exports = { signUp, signIn, getAllUser, getUserProjects, getUserById, refreshToken };