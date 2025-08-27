const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');

router.get('/staff', [verifyToken, hasRole(['admin'])], userController.getStaff);

module.exports = router;

