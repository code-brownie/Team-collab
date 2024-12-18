const sequelize = require("../../config/db");
const initializeDatabase = require("../../config/TableSetup");

const connectToDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('connection setup complete');
        initializeDatabase();
    } catch (error) {
        console.log(error)
        console.log('connection error');
    }
};



module.exports = connectToDB;