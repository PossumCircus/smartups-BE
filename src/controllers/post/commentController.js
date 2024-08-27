const Post = require("../../models/Post");
const Comment = require('../../models/Comment');
const AppError = require("../../utils/appError");

// Function 1: Create a Comment
exports.createComment = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId)

        if (!post) {
            return next(new AppError("Post not found", 404));
        }
        const commentData = {
            postId: post._id,
            author: req.body.author,
            content: req.body.content,
            replies: req.body.replies
        }
        const newComment = await Comment.create(commentData)
        post.comments.push(newComment._id);
        await post.save()
        res.status(201).json(post.comments);
    } catch (error) {
        console.error(error)
        next(error);
    }
};

exports.createReplyComment = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId)
        const parentComment = await Comment.findById(req.body.parentCommentId);
        if (!post) {
            return next(new AppError("Post not found", 404));
        }
        if (!parentComment) {
            return next(new AppError("Parent Comment not found", 404));
        }
        const replyCommentData = {
            postId: post._id,
            author: req.body.author,
            content: req.body.content
        }
        const replyComment = await Comment.create(replyCommentData)

        parentComment.replies.push(replyComment);
        await parentComment.save()

        // res.status(201).json(parentComment);
    } catch (error) {
        next(error);
    }
}

exports.updateComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId
        const updatedComment = req.body.content
        const updatedPost = await Comment.findByIdAndUpdate(commentId, { content: updatedComment }, { new: true });

        if (!updatedPost) {
            return next(new AppError("Comment not found", 404));
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        console.log(error)
        next(error);
    }
}

exports.deleteComment = async (req, res, next) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);

        if (!deletedComment) {
            return next(new AppError("Comment not found", 404));
        }

        res.status(200).json({
            data: {
                state: "삭제된 댓글입니다",
                message: "댓글이 성공적으로 삭제되었습니다."
            }
        });
    } catch (error) {
        console.log(error)
        next(error);
    }
};