const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/notice.controller');
const { verifyToken, isAdmin, hasRole } = require('../middleware/auth.middleware');

// Route to get all notices
// This route requires a user to be logged in (verifyToken)
router.get('/', verifyToken, noticeController.getAllNotices);

// Route to create a new notice
// This route requires the user to be logged in AND be an admin
router.post('/', [verifyToken, hasRole(['admin'])], noticeController.createNotice);

module.exports = router;