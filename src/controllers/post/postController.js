const Post = require("../../models/Post");
const User = require("../../models/User");
const AppError = require("../../utils/appError");

// Function 1: Create a Post
exports.createPost = async (req, res, next) => {
  try {
    const userId = req.body.author;
    const author = await User.findById(userId)
    const newPost = await Post.create(req.body);
    newPost.author = author
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Function 2: Get All Posts (consider adding filtering options based on topics, etc.)
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author')
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'author',
          },
          {
            path: 'replies',
            populate: {
              path: 'author',
            },
          },
        ],
      }).sort({ createdAt: -1 })

    res.status(200).json(posts);
  } catch (error) {
    console.error(error)
    next(error);
  }
};

exports.getInfiniteScrollPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author')
    // .sort({ createdAt: -1 }); // Sort by newest

    const size = req.query.size;
    const page = req.query.page;
    const totalCount = posts.length
    const totalPages = Math.round(totalCount / size);

    res.status(200).json(
      {
        contents: posts.slice(page * size, (page + 1) * size),
        pageNumber: page,
        pageSize: size,
        totalPages,
        totalCount,
        isLastPage: totalPages <= page,
        isFirstPage: page === 0,
      }
    );
  } catch (error) {
    next(error);
  }
};

// Function 3: Get a Single Post
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author')
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'author',
          },
          {
            path: 'replies',
            populate: {
              path: 'author',
            },
          },
        ],
      }).sort({ createdAt: -1 })
    if (!post) {
      return next(new AppError("Post not found", 404));
    }
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

exports.getLatestPosts = async (req, res, next) => {
  try {
    const limit = 5; // How many to fetch
    const latestPosts = await Post.find().sort({ createdAt: -1 }).limit(limit);
    res.json(latestPosts);
  } catch (error) {
    next(error);
  }
};

exports.getTopPosts = async (req, res, next) => {
  try {
    const limit = 10;
    const topPosts = await Post.find().sort({ upvotes: -1 }).limit(limit);
    res.json(topPosts);
  } catch (error) {
    next(error);
  }
};

// Function 4: Update a Post (with authorization)
exports.updatePost = async (req, res, next) => {
  // ... Similar logic to updateJob in jobController.js (add authorization check)

  try {
    const post = await Post.findByIdAndUpdate(req.body.postId);

    if (!post) return next(new AppError("Post not found", 404));

    // Update fields (add validation if needed)
    Object.keys(req.body).forEach((update) => (post[update] = req.body[update]));
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// Function 5: Delete a Post (with authorization)
exports.deletePost = async (req, res, next) => {
  // ... Similar logic to deleteJob in jobController.js (add authorization check)

  try {
    const post = await Post.findByIdAndDelete(req.body.postId);
    if (!post) return next(new AppError("Post not found", 404));

    res.status(204).json("Post deleted");
  } catch (error) {
    next(error);
  }
};

exports.addPostLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    const userId = req.body.user_id;

    if (post.likes.includes(userId) || post.dislikes.includes(userId)) {
      return next(new AppError("You have already added reaction to this post", 400));
    }

    post.likes.push(userId);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

exports.addPostDislike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }
    const userId = req.body.user_id;

    if (post.likes.includes(userId) || post.dislikes.includes(userId)) {
      return next(new AppError("You have already added reaction to this post", 400));
    }

    post.dislikes.push(userId);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.increaseViewsCount = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError("Post not found", 404));
    }
    post.viewsCount++;
    await post.save();
    res.status(200).json(post);
  } catch (error) { }
};
// TODO: Implement functions for liking posts
