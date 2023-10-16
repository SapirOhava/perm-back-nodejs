const express = require('express');

const postController = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router
  .route('/')
  .get(protect, postController.getAllPosts)
  .post(protect, postController.createPost); // when the user wants to create a post were run first the protect middleware

router
  .route('/:id')
  .get(protect, postController.getPost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
