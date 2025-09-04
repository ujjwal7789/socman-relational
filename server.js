// server.js (Complete and Corrected)

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// --- Database Connection ---
const { sequelize, connectDB } = require('./config/database');

// --- Route Imports ---
const authRoutes = require('./routes/auth.routes');
const noticeRoutes = require('./routes/notice.routes');
const helpDeskRoutes = require('./routes/helpdesk.routes');
const apartmentRoutes = require('./routes/apartments.routes');
const visitorRoutes = require('./routes/visitor.routes');
const forumRoutes = require('./routes/forum.routes');
const amenityRoutes = require('./routes/amenity.routes');
const vehicleRoutes = require('./routes/vehicle.routes')
// const userRoutes = require('./routes/user.routes'); // For the staff list
const viewsRoutes = require('./routes/views.routes');


// --- Initialize Express App ---
const app = express();


// --- View Engine and Static Files Setup ---
app.set('view engine', 'ejs');
app.use(express.static('public'));


// --- Core Middleware ---
// IMPORTANT: Middleware should be registered before routes.
app.use(cors()); // For handling cross-origin requests
app.use(express.json()); // For parsing JSON request bodies
app.use(cookieParser()); // For parsing cookies


// =================================================================
//                      ROUTE REGISTRATION
// =================================================================

// --- API Routes (More Specific, should come FIRST) ---
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/helpdesk', helpDeskRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/vehicles', vehicleRoutes);
// app.use('/api/users', userRoutes);

// --- View Routes (More Generic, should come LAST) ---
app.use('/', viewsRoutes);


// =================================================================
//                      SERVER STARTUP
// =================================================================

// Define the port to run on, from environment variables or a default
const PORT = process.env.PORT || 3001;

// Start the server and listen for incoming connections
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Test the database connection once the server starts
    connectDB();
});