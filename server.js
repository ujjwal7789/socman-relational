const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {sequelize, connectDB} = require('./config/database');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Society Management API is running!');
});

//Define the port to run on, from environment variables or a default
const PORT = process.env.PORT || 3001;

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})