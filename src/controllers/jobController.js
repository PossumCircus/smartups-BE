const Job = require('../models/Job');
const Company = require('../models/Company'); 
const AppError = require('../utils/appError');

// Function 1: Create a Job
exports.createJob = async (req, res, next) => {
    try {
        req.body.companyID = req.user.id; // Associate job with the logged-in user's company

        const newJob = await Job.create(req.body);
        res.status(201).json(newJob);
    } catch (error) {
        next(error);
    }
}

// Function 2: Get All Jobs (with basic search and filtering)
exports.getAllJobs = async (req, res, next) => {
    try {
        const filters = { ...req.query };  
        // Example: Filter based on jobType, skills, location
        const query = Job.find(filters);

        // Advanced: Pagination 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit; 

        const results = await query.skip(startIndex).limit(limit);

        res.json({ 
            count: results.length,
            jobs: results 
        });
    } catch (error) {
        next(error); 
    }
}

// Function 3: Get a Single Job
exports.getJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate('companyID', 'companyName logo');

        if (!job) {
            return next(new AppError('Job not found', 404)); 
        }

        res.json(job);
    } catch (error) {
        next(error);
    }
}

// Function 4: Update a Job  
exports.updateJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return next(new AppError('Job not found', 404)); 
        }

        // Authorization: Ensure the logged-in user's company owns the job.
        if (job.companyID.toString() !== req.user.id.toString()) {
            return next(new AppError('Unauthorized to update this job', 403));
        }

        // Update fields (add validation if needed)
        Object.keys(req.body).forEach(update => job[update] = req.body[update]);
        await job.save();

        res.json(job); 
    } catch (error) {
        next(error);
    }
}

// Function 5: Delete a Job
exports.deleteJob = async (req, res, next) => {
    try {
        // Similar implementation to updateJob (ownership check, then delete) ...
    } catch (error) {
        next(error);
    }
}
