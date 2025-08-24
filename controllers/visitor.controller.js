const {Visitor, User} = require('../models');

exports.createVisitor = async (req, res) => {
    const { visitor_name, visitor_phone } = req.body;
    const residentId = req.user.id;

    try {
        const visitor = await Visitor.create({
            visitor_name,
            visitor_phone,
            approved_by_resident: residentId,
        });

        res.status(201).json({ message: 'Visitor registered successfully', visitor: visitor })
    } catch (error) {
        console.error("Error creating visitor: ", error);
        res.status(500).json({ message: 'Visitor could not be registered'})
    }
};

exports.getMyVisitors = async (req, res) => {
    const residentId = req.user.id;

    try {
        const visitors = await Visitor.findAll({
            where: {
                // Corrected: The key matches the column name in the Visitor model
                approved_by_resident: residentId 
            },
            order: [['createdAt', 'DESC']]
        });

        // Also, a 200 OK is more appropriate for a successful GET request than a 201 Created.
        res.status(200).json(visitors); // Sending the array directly is a common and clean practice
    } catch (error) {
        console.error("Error getting your visitors! ", error);
        res.status(500).json({message: "Could not get your visitors"});
    }
};

exports.getAllExpectedVisitors = async (req, res) => {
    try {
        const allExpectedVisitors = await Visitor.findAll({
            where: {
                // The only filter we need is for the status
                status: "expected"
            },
            include: {
                model: User,
                as: 'resident',
                attributes: ['name']
            },
            order: [['createdAt', 'ASC']] // Order by creation time ascending to see who's been waiting longest
        });

        res.status(200).json(allExpectedVisitors);
    
    } catch (error) {
        console.error("Error getting all expected visitors!", error);
        res.status(500).json({message: "Could not get all expected visitors!"});
    }
};

exports.checkInVisitor = async (req, res) => {
    // Use a try...catch block for any potential errors
    try {
        // FIX 1: Destructure to get the actual ID
        const { visitorId } = req.params;

        // FIX 2: Use 'await' to wait for the database query
        const visitor = await Visitor.findByPk(visitorId);

        // FIX 3: ALWAYS check if the object was found first
        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }

        // Now we can safely check the status
        if (visitor.status !== 'expected') {
            return res.status(400).json({ message: `Visitor cannot be checked in. Current status is: ${visitor.status}` });
        }

        // All checks passed, now update the fields
        visitor.status = 'arrived';
        visitor.entry_time = new Date();
        visitor.checked_in_by_security = req.user.id;

        // FIX 2 (again): 'await' the save operation
        await visitor.save();

        // FIX 4: Send a success response back to the user
        res.status(200).json({ message: 'Visitor checked in successfully', visitor: visitor });

    } catch (error) {
        console.error("Error checking in visitor:", error);
        res.status(500).json({ message: "An error occurred while checking in the visitor" });
    }
};

exports.checkOutVisitor = async (req, res) => {
    try {
        const {visitorId} = req.params;
        const visitor = await Visitor.findByPk(visitorId);
        
        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found'})
        }

        if (visitor.status !== 'arrived') {
            return res.status(400).json({message: `Visitor cannot be checked out. Current status is ${visitor.status}`});
        }

        visitor.status = 'departed';
        visitor.exit_time = new Date();

        await visitor.save();

        res.status(200).json({message: 'Visitor checked out successfully', visitor: visitor});


        
    } catch (error) {
        console.error("Error checking out visitor.", error);
        res.status(500).json({ message: "An error occurred while checking out the visitor" });
    }
};

exports.cancelVisitor = async (req, res) => {
    try {
        const {visitorId} = req.params;
        const visitor = await Visitor.findByPk(visitorId);

        if (!visitor) {
            return res.status(404).json({message: 'Visitor not found'});
        }

        if (visitor.approved_by_resident !== req.user.id) {
            return res.status(400).json({ message: `Cannot cancel visitor as you are not approver.`});
        }

        if (visitor.status != 'expected') {
            return res.status(400).json({ message: `Cannot cancel visitor. Current status is ${visitor.status}`});
        }

        visitor.status = 'denied';
        await visitor.save();

        res.status(200).json({message: 'Visitor canceled successfully. ', visitor: visitor});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Could not cancel visitor', error: error});
    }
};

