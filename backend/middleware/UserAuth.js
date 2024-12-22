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
    // Retrieve token from cookies or Authorization header
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    console.log('hello token', token);
    if (!token) {
        return res.status(401).json({ message: "Authentication token missing" });
    }

    try {
        // Verify the token and attach the decoded payload to the request
        const decoded = jwt.verify(token, process.env.secretKey); // Ensure secret key matches the one used during token creation
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token. Access denied." });
        }

        return res.status(500).json({ message: "An error occurred while verifying the token." });
    }
};
module.exports = { saveUser, verifyToken };
