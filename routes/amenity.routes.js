const express = require('express');
const router = express.Router();
const amenityController = require('../controllers/amenity.controller');

const {verifyToken, hasRole} = require('../middleware/auth.middleware');

router.post('/', [verifyToken, hasRole(['admin'])], amenityController.createAmenity);

router.get('/', [verifyToken], amenityController.getAllAmenities );

router.post('/:amenityId/bookings', [verifyToken, hasRole(['resident'])], amenityController.createBooking);

module.exports = router;