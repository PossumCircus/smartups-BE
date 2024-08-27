const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const profileController = require("../../controllers/user/profileController")

// Profile routing
router.get('/me', authMiddleware.protect, profileController.getMyProfile);  // Get Own Profile
router.patch('/me', authMiddleware.protect, profileController.updateMyProfile);  // Update Own Profile
// router.get('/me/connections', authMiddleware.protect, profileController.getMyConnections) 
// router.get('/others/:id', profileController.getOthersProfile);  // View Other User's Profile

module.exports = router;