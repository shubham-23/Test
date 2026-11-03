// errors.js

// 1. The Base Custom Error
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // Set status to 'fail' for 4xx errors, and 'error' for 5xx errors
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; 
    this.isOperational = true; // Marks this as a known error we expected

    Error.captureStackTrace(this, this.constructor);
  }
}

// 2. Specific Error Subclasses
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Invalid data provided') {
    super(message, 400);
  }
}

// Export them so other files can use them
module.exports = {
  AppError,
  NotFoundError,
  ValidationError
};
