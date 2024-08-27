const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Reference to the Company model
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String], // Array of requirements
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'], // Limit to specific options  
        required: true
    },
    applicationLink: {
        type: String,
        validate: {
            validator: (value) => validator.isURL(value, { protocols: ['http', 'https'] }), // Simple URL validation
            message: 'Please provide a valid application URL'
        }
    },
    skills: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    salary: { 
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: 'KRW' } // Optional
    },
    experienceLevel: {
        type: String,
        enum: ['entry-level', 'mid-level', 'senior'],
    },
});

// Index for text-based search on job title and description
jobSchema.index({ title: 'text', description: 'text' });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
