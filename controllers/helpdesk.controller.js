const {HelpDesk, User} = require('../models');

exports.createTicket = async (req, res) => {
    const { title, description, category } = req.body;
    const residentId = req.user.id;

    try {
        const ticket = await HelpDesk.create({
        title,
        description,
        category,
        raised_by: residentId,
        });

        res.status(201).json({ message: 'Help desk ticket created successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error creating ticket', error: error.message});
    }
};

exports.getMyTickets = async (req, res) => {
  const residentId = req.user.id;

  try {
    const tickets = await HelpDesk.findAll({
      where: { raised_by: residentId },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your tickets', error: error.message });
  }
};

// Admin: Get all tickets from all residents
exports.getAllTickets = async (req, res) => {
    const residentId = req.user.id;

    try {
        const tickets = await HelpDesk.findAll({
            order: [['createdAt', 'DESC']],
            include: {
                model: User,
                as: 'requester',
                attributes: [ 'name', 'email'],
            },
        });

        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all tickets', error : error.message});
    }
};

// Admin: Update the status of a specific ticket
exports.updateTicketStatus = async (req, res) => {
    const {ticketId} = req.params; //Get the ID from the URL (e.g., /api/helpdesk/15)
    const { status, assigned_to } = req.body;

    try {
        const ticket = await HelpDesk.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found'});
        }

        //Update the ticket fields
        ticket.status = status || ticket.status; // only update if a new status is provided

        ticket.assigned_to = assigned_to || ticket.assigned_to;

        await ticket.save(); // save the change to database

        res.status(200).json({ message: 'Ticket updated successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket', error: error.message });
    }
};