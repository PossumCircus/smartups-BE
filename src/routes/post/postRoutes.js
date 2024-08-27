const express = require("express");
const router = express.Router();
const postController = require("../../controllers/post/postController");
const authMiddleware = require("../../middleware/authMiddleware");

// Routes for Latest and Top content
router.get("/latest", postController.getLatestPosts);
router.get("/top", postController.getTopPosts);

router.route("/")
    // .post(authMiddleware.protect, postController.createPost) with middleware
    .post(postController.createPost)
    .get(postController.getAllPosts);

router.route("/infiniteScroll")
    .get(postController.getInfiniteScrollPosts)

router.route("/:id")
    .get(postController.getPost)
    .patch(
        // authMiddleware.protect,
        postController.updatePost
    )
    .delete(
        // authMiddleware.protect,
        postController.deletePost
    );

// reactions
router.route("/:id/like")
    .post(postController.addPostLike)
router.route("/:id/dislike")
    .post(postController.addPostDislike)
// views
router.route("/:id/increaseViewsCount")
    .post(postController.increaseViewsCount)

module.exports = router;