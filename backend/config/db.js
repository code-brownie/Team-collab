const dotenv = require('dotenv');
dotenv.config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,     // database name
    process.env.DB_USER,     // username
    process.env.DB_PASSWORD, // password
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false, // set to console.log to see SQL queries
        pool: {
            max: 5,        // maximum number of connections in pool
            min: 0,        // minimum number of connections in pool
            acquire: 30000, // maximum time (ms) that pool will try to get connection before throwing error
            idle: 10000    // maximum time (ms) that a connection can be idle before being released
        }
    }
);

module.exports = sequelize;
