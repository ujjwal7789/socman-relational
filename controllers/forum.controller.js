// forum.controller.js

const { User, ForumPost, ForumComment } = require('../models');

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const author_id = req.user.id;

        // This is the line that actually saves to the database
        const newPost = await ForumPost.create({
            title,
            content,
            author_id: author_id,
        });

        console.log('--- Post successfully CREATED in database ---', newPost.toJSON());
        res.status(201).json({ message: 'Post created successfully!', post: newPost });

    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: 'An error occurred while creating the post.' });
    }
};

// exports.createPost = async (req, res) => {
//     console.log('--- REAL createPost controller function was hit ---');
//     console.log('Request Body:', req.body); // Let's see what we received

//     // We won't even touch the database. We'll just send a success message.
//     res.status(201).json({ message: 'createPost controller function is working.' });
// };

// in controllers/forum.controller.js

exports.getAllPosts = async (req, res) => {
    console.log('--- getAllPosts controller function was HIT ---'); // You can keep this for now
    try {
        const allPosts = await ForumPost.findAll({
            order: [['createdAt', 'DESC']],
            include: {
                model: User,
                as: 'author',
                attributes: ['name'],
            },
        });
        // Let's log what the database returns
        console.log(`Found ${allPosts.length} posts in the database.`); 
        res.status(200).json(allPosts);
    } catch (error) {
        console.error("Error in getAllPosts:", error);
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
        const { postId } = req.params;
        const { comment_text } = req.body;
        const author_id = req.user.id;

        const postExists = await ForumPost.findByPk(postId);

        if (!postExists) {
            return res.status(404).json({ message: "Post not found. Cannot add comment." });
        }

        // --- THE FIX ---
        // Change 'newComment_id' to the correct column name: 'post_id'
        const newComment = await ForumComment.create({
            comment_text: comment_text,
            post_id: postId, 
            author_id: author_id
        });

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });

    } catch (error) {
        console.error("Error adding comment:", error); // It's good practice to use console.error for errors
        res.status(500).json({ message: 'An error occurred while adding the comment', error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const loggedInUserId = req.user.id; // Get the current user's ID
        const loggedInUserRole = req.user.role; // Get the current user's role

        const post = await ForumPost.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // --- ROBUST AUTHORIZATION CHECK ---
        // Let's check the conditions separately for clarity.
        const isAdmin = loggedInUserRole === 'admin';
        // Use non-strict '==' to avoid potential string vs. number issues.
        const isAuthor = post.author_id == loggedInUserId; 

        if (!isAdmin && !isAuthor) {
            // If the user is neither an admin NOR the author, deny access.
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        // If we get here, the user has permission.
        await post.destroy();

        // Send back the data of the post that was just deleted.
        res.status(200).json({ message: 'Post deleted successfully', post: post });

    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: 'An error occurred while deleting the post' });
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