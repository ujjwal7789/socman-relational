const express = require('express');
const router = express.Router();

// Route to show the login page
// A GET request to http://localhost:3001/login will run this
router.get('/login', (req, res) => {
    // res.render() finds the EJS file in the 'views' folder and sends it as HTML
    res.render('login');
});

// We will add the dashboard route here later
router.get('/dashboard', (req, res) => {
    // For now, just send a simple message
    res.send('<h1>Welcome to your Dashboard!</h1> <p>Login was successful.</p>');
});

module.exports = router;