const User = require("../models/User");
const jwt = require('jsonwebtoken');
const saveUser = async (req, res, next) => {
    try {
        const username = await User.findOne({
            where: {
                name: req.body.name,
            },
        });
        if (username) {
            return res.status(409).send('Username already taken!!');
        }

        const emailcheck = await User.findOne({
            where: {
                email: req.body.email
            },
        });
        if (emailcheck) {
            return res.status(409).send('User Exists with this email');
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};
module.exports = { saveUser, verifyToken };
