const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for handling discussions
router.route('/')
    .post(authMiddleware.protect, discussionController.createDiscussion)
    .get(discussionController.getAllDiscussions);

router.route('/:id')
    .get(discussionController.getDiscussion)
    .patch(authMiddleware.protect, /* Add authorization logic */ discussionController.updateDiscussion)
    .delete(authMiddleware.protect, /* Add authorization logic */ discussionController.deleteDiscussion);

// Route for adding an existing post to a discussion
router.post('/:discussionId/posts/:postId', authMiddleware.protect, discussionController.addPostToDiscussion);

module.exports = router;
