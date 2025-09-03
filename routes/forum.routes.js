// // forum.routes.js (Cleaned and Simplified)

// const express = require('express');
// const router = express.Router();
// const forumController = require('../controllers/forum.controller');
// const { verifyToken, hasRole } = require('../middleware/auth.middleware');

// // --- DEFINE ROUTES INDIVIDUALLY ---

// // POST to create a new post
// // This is the one that was failing.
// router.post('/', [verifyToken, hasRole(['resident'])], forumController.createPost);

// // GET all posts
// router.get('/', [verifyToken], forumController.getAllPosts);

// // GET a single post by ID
// router.get('/:postId', [verifyToken], forumController.getPostById);

// // POST to add a comment to a post
// router.post('/:postId/comments', [verifyToken, hasRole(['resident'])], forumController.addCommentToPost);

// // DELETE a post
// router.delete('/:postId', [verifyToken], forumController.deletePost);

// // DELETE a comment
// router.delete('/comments/:commentId', [verifyToken], forumController.deleteComment);


// // --- MAKE SURE THE ROUTER IS EXPORTED ---
// module.exports = router;

// routes/forum.routes.js (MINIMAL version)

// routes/forum.routes.js (Complete and Verified)

const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forum.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');

console.log('--- forum.routes.js file is being loaded by the server ---');


// --- READ routes ---
// Get all posts (This is the one that was missing)
router.get('/', [verifyToken], forumController.getAllPosts);

// Get a single post by ID
router.get('/:postId', [verifyToken], forumController.getPostById);


// --- CREATE routes ---
// Create a new post
router.post('/', [verifyToken, hasRole(['resident'])], forumController.createPost);

// Add a comment to a post
router.post('/:postId/comments', [verifyToken, hasRole(['resident'])], forumController.addCommentToPost);


// --- DELETE routes ---
// Delete a post
router.delete('/:postId', [verifyToken], forumController.deletePost);

// Delete a comment
router.delete('/comments/:commentId', [verifyToken], forumController.deleteComment);


module.exports = router;