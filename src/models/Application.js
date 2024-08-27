const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    resume: { type: String },
    coverLetter: { type: String },
    applicationStatus: {
        type: String,
        enum: ['Submitted', 'In Review', 'Rejected', 'Interview Scheduled', 'Offer'],
        default: 'Submitted'
    },
    createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
