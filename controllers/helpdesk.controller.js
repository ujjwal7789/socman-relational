const {HelpDesk, Apartment, User} = require('../models');

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
// exports.getAllTickets = async (req, res) => {
//     const residentId = req.user.id;

//     try {
//         const tickets = await HelpDesk.findAll({
//             order: [['createdAt', 'DESC']],
//             include: [{
//                 model: User,
//                 as: 'requester',
//                 attributes: [ 'name', 'email'],
            

//                 include: {
//                         model: Apartment,
//                         as: 'apartmentDetails', // Use the alias from models/index.js
//                         attributes: ['apartment_number']
//                 }
//             }],
//         });

//         res.status(200).json(tickets);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching all tickets', error : error.message});
//     }
// };

exports.getAllTickets = async (req, res) => {
    console.log('--- Admin is requesting all help desk tickets ---');
    try {
        const tickets = await HelpDesk.findAll({
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'requester',
                attributes: ['id', 'name', 'email'], // Temporarily include 'id' for debugging
                include: {
                    model: Apartment,
                    as: 'apartmentDetails',
                    attributes: ['id', 'apartment_number'] // Temporarily include 'id'
                }
            }],
        });
        res.status(200).json(tickets);
        

    } catch (error) {
        // If an error happens, we will see it here.
        console.error('--- CRITICAL ERROR in getAllTickets ---');
        console.error(error);
        console.error('-------------------------------------');
        res.status(500).json({ message: 'Error fetching all tickets', error: error.message });
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