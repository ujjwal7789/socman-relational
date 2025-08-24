const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {sequelize, connectDB} = require('./config/database');

const authRoutes = require('./routes/auth.routes'); 
const noticeRoutes = require('./routes/notice.routes');
const helpDeskRoutes = require('./routes/helpdesk.routes');
const apartmentRoutes = require('./routes/apartments.routes');
const visitorRoutes = require('./routes/visitor.routes');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());



connectDB();

app.get('/', (req, res) => {
    res.send('Society Management API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/helpdesk', helpDeskRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/visitors', visitorRoutes);

//Define the port to run on, from environment variables or a default
const PORT = process.env.PORT || 3001;

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})