const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/user/notificationController")

// Notifications routing
router.route('/')
    // .get(notificationController.getNotifications)
    .post(notificationController.createNotification)

router.route('/:loginUserId')
    .get(notificationController.getNotifications)

router.route('/:notificationId')
    .put(notificationController.setReadNotification)
    .delete(notificationController.deleteNotification)

module.exports = router;