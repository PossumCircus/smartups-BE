const AppError = require('../utils/appError');

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500; // Default to server error
    // Customize error messages based on error types
    let message = 'Something went wrong!'; // Generic message
    if (process.env.NODE_ENV === 'development') {
        message = err.message;
        console.error(err.stack); // Log error stack in development
    } else if (err instanceof AppError) { // If you have a custom AppError class
        message = err.message;
    }
    res.status(statusCode).json({
        code: err.statusCode,
        status: 'error',
        message
    });
}

module.exports = errorHandler;
