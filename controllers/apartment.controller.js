
const { Apartment, User } = require('../models');

exports.createApartment = async (req, res) => {
    const { apartment_number, block } = req.body;

    try {
        const existingApartment = await Apartment.findOne( {where: { apartment_number }});

        if (existingApartment) {
            return res.status(409).json( {message: `Apartment with number ${apartment_number} already exists.` } );
        }

        const apartment = await Apartment.create( { apartment_number, block });
        res.status(201).json( {message: 'Apartment created successfully', apartment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating apartment', error: error.message});
    }
};

exports.getAllApartments = async (req, res) => {
    try {
        const apartments = await Apartment.findAll({
            order: [['apartment_number', 'ASC']],
            include: {
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'email']
            }
        });

        res.status(200).json(apartments);
    } catch (error) {
        res.status(500).json( { message: 'Error fetching apartments', error: error.message });
    }
};

exports.assignOwner = async (req, res) => {
  const { apartmentId } = req.params;
  const { owner_id } = req.body;

  try {
    const apartment = await Apartment.findByPk(apartmentId);
    if (!apartment) {
      return res.status(4404).json({ message: 'Apartment not found' });
    }

    const user = await User.findByPk(owner_id);
    if (!user || user.role !== 'resident') {
      return res.status(404).json({ message: 'Resident user not found' });
    }

    // Update both the apartment's owner_id and the user's apartment_id
    apartment.owner_id = owner_id;
    user.apartment_id = apartment.id;

    await apartment.save();
    await user.save();

    res.status(200).json({ message: `Resident ${user.name} assigned to apartment ${apartment.apartment_number}` });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning owner', error: error.message });
  }
};

exports.deleteApartment = async (req, res) => {
    const { apartmentId } = req.params;

    try {
        const apartment = await Apartment.findByPk(apartmentId);
        if (!apartment) {
            return res.status(404).json({message: 'Apartment not found'});
        }

        // Business logic: Dont allow deletion if someone is living there

        if (apartment.owner_id) {
            return res.status(400).json({message: 'Cannot delete an occupied apartment. Please un-assign the resident first.'});
        }

        await apartment.destroy();
        res.status(200).json( {message: 'Apartment deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error deleting apartment', error: error.message});
    }
};