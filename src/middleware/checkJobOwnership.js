const checkJobOwnership = async (req, res, next) => {
    const job = await Job.findById(req.params.id); 
    if (!job) {
        return next(new AppError('Job not found', 404)); 
    }

    if (job.companyID.toString() !== req.user.id.toString()) {
        return next(new AppError('Unauthorized to modify this job', 403));
    }

    next();
}
