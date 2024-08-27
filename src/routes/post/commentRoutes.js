const express = require("express");
const router = express.Router();
const commentController = require("../../controllers/post/commentController")
const authMiddleware = require("../../middleware/authMiddleware");

// Routes for Latest and Top content
// router.post("/latest", commentController.createComment);
router.route("/:postId")
    .post(commentController.createComment)

router.route("/:postId/:parentCommentId")
    .post(commentController.createReplyComment)

router.route("/:postId/:commentId")
    .patch(commentController.updateComment)
    .delete(commentController.deleteComment)

module.exports = router;