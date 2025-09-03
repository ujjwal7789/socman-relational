const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres'
    }
);

// Function to test the connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully')
    } catch (error) {
        console.log('Unable to connect to the database, ', error);
    }
};

module.exports = {sequelize, connectDB};