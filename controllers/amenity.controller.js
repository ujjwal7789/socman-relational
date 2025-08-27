const { Amenity, User, Booking } = require('../models');
const {Op} = require('sequelize');


exports.createAmenity = async (req, res) => {
    try {
        const {name, description, booking_rules} = req.body;

        const amenity = await Amenity.create({
            name,
            description,
            booking_rules
        });

        res.status(200).json({message: 'Amenity created!', amenity: amenity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Amenity could not be created', error: error});
    }
};

exports.getAllAmenities = async (req, res) => {
    try {
        const all_amenities = await Amenity.findAll({
            order: [['name', 'ASC']],
         });


        res.status(200).json(all_amenities);

    } catch (error) {
        res.status(500).json({message: 'Could not get amenities', error: error});
    }
};
    
exports.createBooking = async (req, res) => {
    try {

        const {amenityId} = req.params;
        const { start_time, end_time } = req.body;
        const booked_by_user = req.user.id; 

        const newBookingStart = new Date(start_time);
        const newBookingEnd = new Date(end_time);
        const now = new Date();

        if (newBookingStart < now) 
            return res.status(400).json({message : 'You cannot book in the past'});

        if (newBookingEnd <= newBookingStart)
            return res.status(400).json({message: 'Booking end time must be after start time'});

       const conflictingBooking = await Booking.findOne({ // Query the Booking model
            where: {
                amenity_id: amenityId,
                status: 'confirmed', // Check for the same amenity
                // The core overlap logic:
                [Op.or]: [ // Find where either of these conditions are true
                    { // Condition A: An existing booking starts during the new booking
                        start_time: {
                            [Op.between]: [newBookingStart, newBookingEnd]
                        }
                    },
                    { // Condition B: An existing booking ends during the new booking
                        end_time: {
                            [Op.between]: [newBookingStart, newBookingEnd]
                        }
                    },
                    { // Condition C: An existing booking completely contains the new booking
                        [Op.and]: [
                            { start_time: { [Op.lte]: newBookingStart } },
                            { end_time: { [Op.gte]: newBookingEnd } }
                        ]
                    }
                ]
            }
        });

        if (conflictingBooking) {
            return res.status(409).json( {message: 'Timeslot unavailable as it conflicts with an existing booking'});
        }

        const newBooking = await Booking.create({
            amenity_id: amenityId,
            start_time: newBookingStart,
            end_time: newBookingEnd,
            booked_by_user
        });

        res.status(201).json( {message: 'Booking created successfully!', booking: newBooking});


    } catch (error) {
        if (error.message.includes('Invalid date')) {
            return res.status(400).json( {message: 'Invalid Date format. Please use ISO 8601 format. YYYY-MM-DDTHH:mm:ss.sssZ'});
        }

        console.error("Error creating booking", error);
        res.status(500).json( {message : 'An error occurred while creating the booking', error: error.message});
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: {
                booked_by_user : req.user.id
            },
            include: {
                model: Amenity,
                as: 'amenity',
                attributes: ['name']
            },

            order: [['start_time', 'ASC']]              
            
        });

        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json( {message: 'Error occurred while getting your bookings'});
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const allBookings = await Booking.findAll({
            include: [{ 
                model: Amenity,
                as: 'amenity',
                attributes: ['name']

            },
            
            {
                model: User,
                as: 'resident',
                attributes: ['name']
            }
            ],
            
            order: 
                [['start_time', 'ASC']]
        });

        res.status(200).json(allBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json( {message: 'Could not list all bookings', error: error.message});
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const {bookingId} = req.params;
        const bookingToCancel = await Booking.findByPk(bookingId);

        if (!(bookingToCancel)) 
            return res.status(404).json( {message: 'Booking was not found'});

        if (!(bookingToCancel.booked_by_user === req.user.id || req.user.role === 'admin')) {   
            return res.status(403).json({ message: 'No authorization to cancel booking. Are you the booker?'});
        }

        if (!( bookingToCancel.start_time > new Date())) {
            return res.status(400).json({message: 'Cannot cancel a future booking'});
        }

        bookingToCancel.status = 'cancelled';
        await bookingToCancel.save();

        res.status(200).json({ message: 'Booking cancelled successfully', booking: bookingToCancel});

    } catch (error) {
        res.status(500).json({message: 'Error canceling booking', error: error.message});
    }
};