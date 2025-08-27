const { User } = require('../models');
const { Op } = require('sequelize'); // Import Op for the flexible query

// Get all users who can be assigned to tickets
exports.getStaff = async (req, res) => {
    try {
        // Find all users whose role is either 'staff' OR 'admin'
        const staffList = await User.findAll({
            where: {
                [Op.or]: [{ role: 'staff' }, { role: 'admin' }]
            },
            attributes: ['id', 'name', 'role'] // Only send necessary information
        });

        // It's a successful request even if the list is empty
        res.status(200).json(staffList);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff list', error: error.message });
    }
};