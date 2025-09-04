// routes/vehicle.routes.js

const express = require('express');
const router = express.Router();

const vehicleController = require('../controllers/vehicle.controller'); // Corrected typo in variable name
const { verifyToken, hasRole } = require('../middleware/auth.middleware');

// --- Resident-Specific Routes ---

// POST /api/vehicles (Create a new vehicle)
router.post('/', [verifyToken, hasRole(['resident'])], vehicleController.createVehicle);

// GET /api/vehicles/my-vehicles (View own vehicles)
router.get('/my-vehicles', [verifyToken, hasRole(['resident'])], vehicleController.getMyVehicles);

// DELETE /api/vehicles/:vehicleId (Delete own vehicle)
// The controller will handle checking if they are the true owner.
router.delete('/:vehicleId', [verifyToken, hasRole(['resident'])], vehicleController.deleteVehicle);


// --- Admin-Specific Route ---

// GET /api/vehicles (View all vehicles)
router.get('/', [verifyToken, hasRole(['admin'])], vehicleController.getAllVehicles);


module.exports = router;