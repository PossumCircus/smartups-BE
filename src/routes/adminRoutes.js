// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); 
const authMiddleware = require('../middleware/authMiddleware');


router.get('/site-stats', authMiddleware.protect, authMiddleware.requireRole('admin'), adminController.getSiteStats);

router.post('/content-moderation', authMiddleware.protect, authMiddleware.requireRole('admin'), adminController.moderateContent);
