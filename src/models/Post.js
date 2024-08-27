const mongoose = require("mongoose");
const Comment = require('./Comment')
const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 50, 
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000, 
  },
  hashtags: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  topic: {
    type: String,
    required: true, 
    maxlength: 50,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  commentsCount: {
    type: Number,
    default: 0,
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
});
// commentsCount = comments.length + comments.replies.length
postSchema.pre("save", async function (next) {
  try {
    const comments = await Comment.find({ _id: { $in: this.comments } });
    let commentsCount = comments.length;

    for (let comment of comments) {
      commentsCount += comment.replies.length;
    }

    this.commentsCount = commentsCount;
    next();
  } catch (error) {
    next(error);
  }
});

postSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();

    if (update.comments) {
      const comments = await Comment.find({ _id: { $in: update.comments } });
      let commentsCount = comments.length;

      for (let comment of comments) {
        commentsCount += comment.replies.length;
      }

      update.commentsCount = commentsCount;
    } else if (update.$push && update.$push.comments) {
      const post = await this.model.findOne(this.getQuery());
      const comments = await Comment.find({ _id: { $in: [...post.comments, update.$push.comments] } });
      let commentsCount = comments.length;

      for (let comment of comments) {
        commentsCount += comment.replies.length;
      }

      update.commentsCount = commentsCount;
    } else if (update.$pull && update.$pull.comments) {
      const post = await this.model.findOne(this.getQuery());
      const comments = await Comment.find({ _id: { $in: post.comments.filter(commentId => commentId != update.$pull.comments) } });
      let commentsCount = comments.length;

      for (let comment of comments) {
        commentsCount += comment.replies.length;
      }

      update.commentsCount = commentsCount;
    }

    next();
  } catch (error) {
    next(error);
  }
});
// // Post-update hook to update commentsCount
// postSchema.post("findOneAndUpdate", async function (doc) {
//   if (doc) {
//     doc.commentsCount = doc.comments.length;
//     await doc.save();
//   }
// });
// Optionally add a text index for searches on the post content and hashtags
postSchema.index({ title: "text", content: "text", hashtags: "text" });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
