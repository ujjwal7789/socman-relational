//forum.routes.js

const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forum.controller')

const { verifyToken, hasRole } = require('../middleware/auth.middleware');

router.get('/:postId', [verifyToken], forumController.getPostById);

router.post('/', [verifyToken, hasRole(['resident'])], forumController.createPost);

router.get('/', [verifyToken], forumController.getAllPosts);

router.post('/:postId/comments', [verifyToken, hasRole(['resident'])], forumController.addCommentToPost);

router.delete('/:postId', [verifyToken], forumController.deletePost);

router.delete('/comments/:commentId', [verifyToken], forumController.deleteComment);
module.exports = router;