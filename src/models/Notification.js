const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notificationType: {
        type: String,
        enum: ['post_new_comment', 'post_like', 'comment_new_reply', 'chat']
    },
    link: { type: String },
    isNewOne: { type: Boolean, default: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const notificationStateSchema = new mongoose.Schema({
    postLikes: {
        type: Boolean,
        default: false
    },
    postNewComments: {
        type: Boolean,
        default: false
    },
    commentNewReplies: {
        type: Boolean,
        default: false
    },
    chats: {
        type: Boolean,
        default: false
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = { Notification, notificationStateSchema } 
