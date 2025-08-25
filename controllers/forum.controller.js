// forum.controller.js

const { User, ForumPost, ForumComment } = require('../models');

exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    const author_id = req.user.id;

    try {
        const forumPost = await ForumPost.create({
        title,
        content,
        author_id: author_id,
        });

        res.status(201).json( {message: 'Your post was posted to the forum.', forumPost});
    } catch (error) {
        res.status(500).json( {message: 'Error creating Post', error: error.message});
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const allPosts = await ForumPost.findAll({
            order: [['createdAt', 'DESC']],
            include: {
                model: User,
                as: 'author',
                attributes: ['name'],
            },
        });
        
        res.status(200).json(allPosts);
    } catch (error) {
        res.status(500).json({ message: 'Error loading posts'});
    }
};

exports.getPostById = async (req, res) => {
    try {
        const {postId} = req.params;

        const post = await ForumPost.findOne({
            where: {id : postId },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['name']
                },

                {
                    model: ForumComment,
                    as: 'comments',
                    include: {
                        model: User,
                        as: 'author',
                        attributes: ['name']
                    }
                }
            ]
        });

        if (!post) {
            return res.status(404).json( {message: 'Post not found' });
        }

        res.status(200).json(post);
    
    }   catch (error) {
        res.status(500).json({message: 'Could not get the post', error: error.message});
    }
}; 

exports.addCommentToPost = async (req, res) => {


    try {
    const {postId} = req.params;
    const {comment_text} = req.body;
    const author_id = req.user.id;

    const postExists = await ForumPost.findByPk(postId);

    if (!postExists)
        return res.status(404).json({message: `Didn't find post.`, });
        const newComment = await ForumComment.create({
            comment_text,
newComment_id: postId,
            author_id: author_id
        });

    res.status(201).json({message: 'Comment added successfully', forumComment: newComment});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Could not comment on the post', error: error});
    }
};

exports.deletePost = async (req, res) => {
    try {
        const {postId} = req.params;
        
        const post = await ForumPost.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Could not find post'});
        }

        if (!(req.user.role === 'admin' || post.author_id === req.user.id)) {
            return res.status(403).json( {message : 'You are not authorized to delete this post'});
        }

        res.status(200).json( {message: 'Post was deleted successfully', post: post});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Post could not be deleted', error: error});
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const {commentId} = req.params;

        const comment = await ForumComment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment was not found'});
        }

        if (!( comment.author_id === req.user.id || req.user.role === 'admin')) {
            return res.status(403).json({message: 'You are not authorized to delete this comment'});
        }

        await comment.destroy();

        res.status(200).json({ message: 'Comment was deleted', comment: comment});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Could not delete comment', error: error});
    }
};