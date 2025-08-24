const express = require('express');
const router = express.Router();
const apartmentController = require('../controllers/apartment.controller');
const { verifyToken, isAdmin} = require('../middleware/auth.middleware');

router.use(verifyToken, isAdmin);

//Create a new Apartment
router.post('/', apartmentController.createApartment);

//Get a list of apartments
router.get('/', apartmentController.getAllApartments);

//Assign a resident to an apartment
router.put('/:apartmentId/assign', apartmentController.assignOwner);

//Delete an apartment
router.delete('/:apartmentId', apartmentController.deleteApartment);

module.exports = router;