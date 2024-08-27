const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    headline: {
        type: String,
        trim: true,
        maxlength: 120
    },
    location: {
        type: String
    },
    avatar: {
        type: String
    },
    desiredJobTypes: {
        type: String
    },
    // experience: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Experience'
    // }]
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
