const express = require('express');
const router = express.Router();
const helpDeskController = require('../controllers/helpdesk.controller');

const {verifyToken, hasRole} = require('../middleware/auth.middleware');


router.post('/', [verifyToken, hasRole(['resident'])], helpDeskController.createTicket);

router.get('/my-tickets', [verifyToken, hasRole(['resident'])], helpDeskController.getMyTickets);

router.get('/', [verifyToken, hasRole(['admin'])], helpDeskController.getAllTickets);

router.put('/:ticketId', [verifyToken, hasRole(['admin'])], helpDeskController.updateTicketStatus);

module.exports = router;