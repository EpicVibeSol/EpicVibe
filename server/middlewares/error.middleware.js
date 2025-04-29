/**
 * Global error handling middleware
 * Catches and formats all errors in a consistent way
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);
  
  // Default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  
  // Handle different types of errors
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    // Mongoose ObjectId casting error
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.code === 11000) {
    // Mongoose duplicate key error
    statusCode = 400;
    message = 'Duplicate field value entered';
  } else if (err.name === 'JsonWebTokenError') {
    // JWT errors
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    timestamp: new Date().toISOString()
  });
};

/**
 * Not found middleware
 * Handles 404 errors for routes that don't exist
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * API rate limiter error handler
 * Handles rate limiting errors
 */
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    status: 'error',
    message: 'Too many requests, please try again later',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  errorHandler,
  notFound,
  rateLimitHandler
}; 