const { Vehicle, User } = require("../models");

exports.createVehicle = async (req, res) => {
    try {
        const {vehicle_number, vehicle_type, model} = req.body;
        const ownerId = req.user.id;

        const vehicle_exists = await Vehicle.findOne({
            where: {
                vehicle_number : vehicle_number
            }
        });

        if (vehicle_exists) {
            return console.log('Vehicle already exists');
        }

        const vehicle = Vehicle.create({
            vehicle_number: vehicle_number,
            vehicle_type: vehicle_type,
            model: model,
            owner_id : ownerId
        });

        res.status(201).json({message: 'Vehicle added successfully', vehicle: vehicle});

    } catch (error) {
        console.error("Error adding vehicle: ", error);
        res.status(500).json({message: 'An error occurred during vehicle registration', error: error });
    }
};

exports.getMyVehicles = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const vechicles = await Vehicle.findAll({
            where: {
                owner_id : ownerId 
            }
        });

        res.status(200).json(vechicles);
    } catch (error) {
        console.error("Error in getting all vehicles", error);
        res.status(500).json({message: 'Error getting all vehicles'});
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const {vehicleId} = req.params;
        const loggedInUserId = req.user.id;

        const vehicle = await Vehicle.findByPk(vehicleId);

    // ALWAYS check if the item was found first
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found.' });
        }

        // Now, perform the security check
        if (vehicle.owner_id !== loggedInUserId) {
            return res.status(403).json({ message: 'You are not authorized to delete this vehicle.' });
        }

        // If all checks pass, destroy the vehicle
        await vehicle.destroy();

        res.status(200).json({ message: 'Vehicle removed successfully', vehicle: vehicle });
    } catch (error) {
        console.error("Error deregistering vehicle", error);
        res.status(500).json({ message: 'An error occurred while deregistering vehicle'});
    }
};

exports.getAllVehicles = async (req, res) => {
    try {
        const allVehicles = await Vehicle.findAll({
            include: {
                model: User,
                as: 'owner',
                attributes: ['name'],
            },
        });

        res.status(200).json(allVehicles);
    } catch(error) {
        res.status(500).json({message: 'Could not view all vehicles', error: error});
    }
};