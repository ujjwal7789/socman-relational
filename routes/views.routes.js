const express = require('express');
const router = express.Router();

const { protectView} = require('../middleware/auth.middleware');


// Route to show the login page
// A GET request to http://localhost:3001/login will run this

router.get('/register', (req, res) => {
    res.render('register');
});

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

router.get('/bookings/my-bookings', protectView, (req, res) => {
    if (res.locals.user.role !== 'resident') {
        return res.status(403).send('Access Denied');
    }
    res.render('my-bookings');
});

router.get('/bookings', protectView, (req, res) => {
    if (res.locals.user.role !== 'admin') {
        return res.status(403).send('Access Denied!');
    }
    res.render('all-bookings');
});

router.get('/helpdesk/my-tickets', protectView, (req, res) => {
    // Only residents should see this page
    if (res.locals.user.role !== 'resident') {
        return res.status(403).send('Access Denied');
    }
    res.render('my-tickets');
});

router.get('/helpdesk', protectView, (req, res) => {
    // Only admins should see this page
    if (res.locals.user.role !== 'admin') {
        return res.status(403).send('Access Denied');
    }
    res.render('helpdesk-admin');
});

router.get('/helpdesk/assigned-to-me', protectView, (req, res) => {
    const user = res.locals.user;

    if (user.role !== 'admin' && user.role !== 'staff') {
        return res.status(403).send('Access Denied');
    }
    res.render('assigned-tickets');
});

router.get('/notices', protectView, (req, res) => {
    return res.render('notices');

    
});

router.get('/manage-notices', protectView, (req, res) => {
    const user = res.locals.user;

    if (!(user.role === 'admin')) {
        return res.status(403).send('Access Denied');
    }

    res.render('manage-notices')
});

router.get('/forum', protectView, (req, res) => {
    res.render('forum');
});

router.get('/forum/posts/:postId', protectView, (req, res) => {
    res.render('post-detail');
});

router.get('/forum/new', protectView, (req, res) => {
    if (res.locals.user.role !== 'resident') {
        return res.status(403).send('Only residents can create posts.')
    }
    res.render('new-post');
});

router.get('/my-vehicles', protectView, (req, res) => {
    // Only residents should see this page
    if (res.locals.user.role !== 'resident') {
        return res.status(403).send('Access Denied');
    }
    res.render('my-vehicles');
});

router.get('/my-visitors', protectView, (req, res) => {
    // Only residents should see this page
    if (res.locals.user.role !== 'resident') {
        return res.status(403).send('Access Denied');
    }
    res.render('my-visitors');
});

router.get('/gatekeeper', protectView, (req, res) => {
    const user = res.locals.user;
    // Only admins and security should see this page
    if (user.role !== 'admin' && user.role !== 'security') {
        return res.status(403).send('Access Denied');
    }
    res.render('gatekeeper');
});

module.exports = router;