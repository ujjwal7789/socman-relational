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
exports.updateTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status, assigned_to } = req.body;

        const ticket = await HelpDesk.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // --- NEW VALIDATION BLOCK ---
        // If the request is trying to assign a user...
        if (assigned_to) {
            const userToAssign = await User.findByPk(assigned_to);

            // Check 1: Does this user even exist?
            if (!userToAssign) {
                return res.status(404).json({ message: `User with ID ${assigned_to} not found.` });
            }
            // Check 2: Does this user have the correct role?
            if (userToAssign.role !== 'admin' && userToAssign.role !== 'staff') {
                return res.status(403).json({ message: `Cannot assign ticket to user with role '${userToAssign.role}'.` });
            }
            // If all checks pass, it's safe to assign.
            ticket.assigned_to = assigned_to;
        }

        // Update status if it was provided
        if (status) {
            ticket.status = status;
        }

        await ticket.save();

        res.status(200).json({ message: 'Ticket updated successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket', error: error.message });
    }
};