const User = require('../../models/User');
const AppError = require('../../utils/appError'); 

exports.getMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.body.userId); 
        if (!user) {
            return next(new AppError('User not found', 404)); 
        }
        res.json(user); // Send the full user profile
    } catch (error) {
        next(error);
    }
}

exports.updateMyProfile = async (req, res, next) => {
    try {
        // Careful with allowed fields for updates
        const allowedUpdates = ['name', 'bio', 'location', /* ... other allowed fields */];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return next(new AppError('Invalid update fields', 400));
        }

        const user = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return next(new AppError('User not found', 404)); 
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
}