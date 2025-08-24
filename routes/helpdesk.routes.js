const express = require('express');
const router = express.Router();
const helpDeskController = require('../controllers/helpdesk.controller');

const {verifyToken, isAdmin, isResident} = require('../middleware/auth.middleware');


router.post('/', [verifyToken, isResident], helpDeskController.createTicket);

router.get('/my-tickets', [verifyToken, isResident], helpDeskController.getMyTickets);

router.get('/', [verifyToken, isAdmin], helpDeskController.getAllTickets);

router.put('/:ticketId', [verifyToken, isAdmin], helpDeskController.updateTicketStatus);

module.exports = router;