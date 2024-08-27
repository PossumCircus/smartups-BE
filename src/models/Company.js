const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true, // Ensure company names are unique
        trim: true
    },
    website: {
        type: String,
        validate: {
            validator: (value) => validator.isURL(value, { protocols: ['http', 'https'] }), 
            message: 'Please provide a valid website URL'
        }
    },
    industry: {
        type: String,
        enum: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Marketing', 'Other'], // Controlled list of industries
        required: true
    },
    about: {
        type: String,
        maxlength: 500
    },
    logo: {
        type: String  // Could be a URL or path to uploaded image 
    },
    size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    },
    location: {
       type: String 
    },
    founded: {
        type: Number,  // Store the year the company was founded
    },
    // You could add more fields like:
    // specialties: [String],
    // socialLinks: { 
    //     facebook: { type: String },
    //     linkedin: { type: String },
    //     ...
    // }
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
