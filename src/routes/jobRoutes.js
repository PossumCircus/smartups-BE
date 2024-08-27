const express = require('express');
const router = express.Router();

const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// ---- PROTECTED ROUTES (Authentication Required) -----------
router.use(authMiddleware.protect); // Middleware applies to all routes below

// CREATE a new job (Logged-in users only)
router.post('/', jobController.createJob);

// UPDATE a job (Only the company that created the job)
router.patch('/:id', jobController.updateJob);

// DELETE a job (Only the company that created the job)
router.delete('/:id', jobController.deleteJob);

// -------- OPEN ROUTES (No Authentication Required) -------

// GET all jobs (with search and filtering)
router.get('/', jobController.getAllJobs);

// GET a single job
router.get('/:id', jobController.getJob);

module.exports = router; 
