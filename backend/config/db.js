const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // Database name
  process.env.DB_USER,      // Database user
  process.env.DB_PASSWORD,  // Database password
  {
    host: process.env.DB_HOST,  // Host (Supabase URL)
    port: process.env.DB_PORT || 5432,  // Port (default: 5432)
    dialect: process.env.DB_DIALECT,  // Dialect (PostgreSQL)
    logging: false,  // Disable logging
    pool: {
      max: 5,        // Maximum number of connections
      min: 0,        // Minimum number of connections
      acquire: 30000,  // Maximum time to try getting a connection (ms)
      idle: 10000,     // Maximum time a connection can be idle (ms)
    },
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection(); // Test the connection when the script runs.

module.exports = sequelize;
