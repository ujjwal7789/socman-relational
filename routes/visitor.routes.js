const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitor.controller');
const {verifyToken, hasRole, protectView} = require('../middleware/auth.middleware');


router.get('/my-visitors', [verifyToken, hasRole(['resident'])], visitorController.getMyVisitors);

router.post('/', [verifyToken, hasRole(['resident'])], visitorController.createVisitor);

router.put('/:visitorId/check-in', [verifyToken, hasRole(['admin', 'security'])], visitorController.checkInVisitor);

router.put('/:visitorId/check-out', [verifyToken, hasRole(['admin', 'security'])], visitorController.checkOutVisitor);

router.put('/:visitorId/cancel', [verifyToken, hasRole(['resident'])], visitorController.cancelVisitor);

router.get('/gate-log', [verifyToken, hasRole(['admin', 'security'])], visitorController.getGateLog);

module.exports = router;
