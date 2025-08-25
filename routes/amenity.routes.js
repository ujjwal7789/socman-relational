const express = require('express');
const router = express.Router();
const amenityController = require('../controllers/amenity.controller');

const {verifyToken, hasRole} = require('../middleware/auth.middleware');

router.post('/', [verifyToken, hasRole(['admin'])], amenityController.createAmenity);

router.get('/', [verifyToken], amenityController.getAllAmenities );

router.post('/:amenityId/bookings', [verifyToken, hasRole(['resident'])], amenityController.createBooking);

router.get('/bookings/my-bookings', [verifyToken, hasRole(['resident'])], amenityController.getMyBookings);

router.get('/bookings', [verifyToken, hasRole(['admin'])], amenityController.getAllBookings );

router.put('/bookings/:bookingId/cancel', [verifyToken, hasRole(['resident', 'admin'])], amenityController.cancelBooking);

module.exports = router;