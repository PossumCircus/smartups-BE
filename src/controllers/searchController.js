const User = require('../models/User');
const Post = require('../models/Post');
const AppError = require('../utils/appError'); // Assuming you have an AppError class

exports.searchUsers = async (req, res, next) => {
    try {
        const query = req.query.q;

        if (!query) {
            return next(new AppError('Please provide a search query', 400));
        }

        // Basic text search (adjust as needed)
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { bio: { $regex: query, $options: 'i' } }
            ]
        }).select(/* ... fields to include ... */);

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (error) {
        next(error);
    }
}

exports.searchPosts = async (req, res, next) => {
    try {
        const query = req.query.q;
        const topic = req.query.topic;
        const sortBy = req.query.sortBy || 'relevance'; // Default to relevance-based sorting

        if (!query) {
            return next(new AppError('Please provide a search query', 400));
        }

        const pipeline = [
            { $match: { $text: { $search: query } } },
        ];

        if (topic) {
            pipeline.push({ $match: { topic: topic } });
        }

        if (sortBy === 'relevance') {
            pipeline.push({ $sort: { score: { $meta: "textScore" } } });
        } else if (sortBy === 'newest') {
            pipeline.push({ $sort: { createdAt: -1 } });
        } else if (sortBy === 'top') {
            // Assuming you track likes or an upvote count somewhere
            pipeline.push({ $sort: { likesCount: -1 } }); // Replace 'likesCount' with appropriate field
        } // Add more sorting options

        const posts = await Post.aggregate(pipeline);

        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: { posts }
        });
    } catch (error) {
        next(error);
    }
};