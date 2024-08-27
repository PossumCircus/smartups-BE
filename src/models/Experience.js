const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    title: {
        type: String,
        trim: true,
        maxlength: 120
    },
    company: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    description: {
        type: String
    }
});

const Experience = mongoose.model('Experience', experienceSchema);
module.exports = Experience;
