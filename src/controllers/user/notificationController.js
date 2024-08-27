const AppError = require('../../utils/appError');
const { Notification } = require('../../models/Notification');
const User = require('../../models/User');
const { Error } = require('mongoose');

exports.getNotifications = async (req, res, next) => {
    try {
        const userId = req.params.loginUserId
        const notifications = await Notification.find({ recipient: userId })
            .populate('sender', 'username')
            .sort({ createdAt: -1 })
        if (!notifications) return next(new AppError("There are no notifications to fetch"))
        res.status(200).json(notifications)
    } catch (error) {
        console.log(error)
        next(error);
    }
}

exports.createNotification = async (req, res, next) => {
    try {
        const creationData = req.body
        if (!creationData) return next(new AppError("There is no notificationData"))

        const recipientId = creationData.recipient
        const senderId = creationData.sender

        const newNotification = await Notification.create(creationData);

        await User.findByIdAndUpdate(recipientId, { $inc: { newNotificationsCount: 1 } });
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.setReadNotification = async (req, res, next) => {
    try {
        const { notificationId } = req.params
        const readNotification = await Notification.findByIdAndUpdate(notificationId, { isRead: true, isNewOne : false }, { new: true });

        if (!readNotification) {
            return res.status(404).json({ error: 'Target notification is not found' });
        }

        res.status(200).json(readNotification);
    } catch (error) {
        next(error);
    }
}

exports.deleteNotification = async (req, res, next) => {
    try {
        const { notificationId } = req.params
        const removedData = await Notification.findByIdAndDelete(notificationId);
        if (!removedData) return next(new AppError("There is no notification data to delete"))
        res.status(201).json({
            data: {
                state: "알림 제거.",
                message: "알림이 제거되었습니다."
            }
        })
    } catch (error) {
        next(error);
    }
}

exports.setNotificationsState = async (req, res, next) => {
    try {
        const { alarmState } = req.body
        const user = await User.findById(req.body.loginId)
            .populate('notificationAlarmState')

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.notificationAlarmState.postLikes = alarmState.postLikesState
        user.notificationAlarmState.postNewComments = alarmState.postNewCommentsState
        user.notificationAlarmState.commentLikes = alarmState.commentLikesState
        user.notificationAlarmState.commentNewReplies = alarmState.commentNewRepliesState
        user.notificationAlarmState.chats = alarmState.chatState

        await user.save()

        res.send(201).json({
            data: {
                state: "알림 상태 변경.",
                message: "알림이 상태 값이 변경되었습니다."
            }
        })
    } catch (error) {
        next(error);
    }
}