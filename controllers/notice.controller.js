const {Notice, User} = require('../models');

//Admin creates a new Notice

exports.createNotice = async (req, res) => {
    const {title, content} = req.body;

    try {
        const notice = await Notice.create({
            title,
            content,
            created_by: req.user.id
        });

        res.status(201).json({message: 'Notice created successfully', notice});
    } catch (error) {
        res.status(500).json({message: 'Error creating notice', error: error.message });
    }
};

exports.getAllNotices = async (req, res) => {
    try {
        const notices = await Notice.findAll({
            order: [['createdAt', 'DESC']],
            include: {
            model: User,
            as: 'author',
            attributes: ['name']
            }
        });
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({message: 'Error fetching notices ', error: error.message});
    }
};