const User = require("../models/User");

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

module.exports = { saveUser };
