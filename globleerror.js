// errorMiddleware.js

function globalErrorHandler(err, req, res, next) {
  // If the error has a statusCode (from our custom errors), use it. Otherwise, default to 500.
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Send a clean, formatted response to the client
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // Only show the stack trace in development mode so you can debug easily
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = globalErrorHandler;
