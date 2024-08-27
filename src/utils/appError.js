class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent Error constructor with the message

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';  
        this.isOperational = true; // Mark this as an operational error

        Error.captureStackTrace(this, this.constructor); // Preserves the stack trace
    }
}

module.exports = AppError;
