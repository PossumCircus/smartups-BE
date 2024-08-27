const Discussion = require('../models/Discussion');
const Post = require('../models/Post');
const AppError = require('../utils/appError');

// Function 1: Create a Discussion
exports.createDiscussion = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id; // Associate the discussion with the logged-in user

        const newDiscussion = await Discussion.create(req.body);
        res.status(201).json(newDiscussion);
    } catch (error) {
        next(error);
    }
}

// Function 2: Get All Discussions (add filtering/sorting later)
exports.getAllDiscussions = async (req, res, next) => {
    try {
        const discussions = await Discussion.find()
                                            .populate('createdBy', 'fullName profilePicture')
                                            .sort({ createdAt: -1 }); // Sort by newest

        res.json(discussions); 
    } catch (error) {
        next(error);
    }
}

// Function 3: Get a Single Discussion (including its posts)
exports.getDiscussion = async (req, res, next) => {
    try {
        const discussion = await Discussion.findById(req.params.id)
                                           .populate('createdBy', 'fullName profilePicture')
                                           .populate({ 
                                                path: 'posts',
                                                populate: { path: 'userID', select: 'fullName profilePicture' } // Populate post authors
                                           });

        if (!discussion) {
            return next(new AppError('Discussion not found', 404)); 
        }

        res.json(discussion);
    } catch (error) {
        next(error);
    }
}

// Function 4: Update a Discussion (consider authorization in the future)
exports.updateDiscussion = async (req, res, next) => {
    // ... (Add authorization in the future to restrict updates)
}

// Function 5: Delete a Discussion (consider authorization in the future)
exports.deleteDiscussion = async (req, res, next) => {
    // ... (Add authorization in the future to restrict deletion)
}

// Function 6: Add Post to Discussion (link an existing post)
exports.addPostToDiscussion = async (req, res, next) => {
    try {
        const discussion = await Discussion.findById(req.params.discussionId);
        const post = await Post.findById(req.params.postId);

        if (!discussion || !post) {
            return next(new AppError('Discussion or post not found', 404));
        }

        // Prevent duplicate posts
        if (discussion.posts.includes(req.params.postId)) {
            return next(new AppError('Post already in discussion', 400)); // Bad request
        }

        discussion.posts.push(post);
        await discussion.save();

        res.status(200).json({ message: 'Post added to discussion' });
    } catch (error) {
        next(error);
    }
}

// TODO: Consider adding functions to manage participants if needed
