// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Route for user registration
// A POST request to /api/auth/register will run the register function
router.post('/register', authController.register);

// Route for user login
// A POST request to /api/auth/login will run the login function
router.post('/login', authController.login);

module.exports = router;