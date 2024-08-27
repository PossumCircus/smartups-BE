const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const AppError = require('../utils/appError'); // Assuming you have an AppError class

module.exports.protect = async (req, res, next) => {
    try {
        // 1. Check for the token
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Not authorized to access this route', 401));
        }

        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        // 3. Check if the user still exists
        const currentUser = await User.findById(decoded.id); 
        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        // 4. Grant access 
        req.user = currentUser; // Attach the user to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        next(error); // Pass errors to a global error handler (if you have one)
    }
}
