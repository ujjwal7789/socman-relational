const express = require('express');
const router = express.Router();

const { protectView} = require('../middleware/auth.middleware');


// Route to show the login page
// A GET request to http://localhost:3001/login will run this

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    // res.render() finds the EJS file in the 'views' folder and sends it as HTML
    res.render('login');
});

// We will add the dashboard route here later
router.get('/dashboard', protectView, (req, res) => {
    // For now, just send a simple message
    res.render('dashboard');
});

router.get('/apartments', protectView, (req, res) => {
    if (res.locals.user.role !== 'admin') {
        return res.status(403).send('Access Denied');
    }

    res.render('apartments');
});

router.get('/amenities', protectView, (req, res) => {
    // Only admins can access this page
    if (res.locals.user.role !== 'admin') {
        return res.status(403).send('Access Denied');
    }
    res.render('amenities');
});

router.get('/amenities/book', protectView, (req, res) => {
    // Only residents can access this page
    if (res.locals.user.role !== 'resident') {
        return res.status(403).send('Access Denied');
    }
    res.render('book-amenity');
});

module.exports = router;