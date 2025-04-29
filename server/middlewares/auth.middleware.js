const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 * Verifies JWT tokens and attaches user info to request object
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. No token provided.'
      });
    }
    
    // Extract token (remove "Bearer " prefix)
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. Invalid token format.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'epic-vibe-demo-secret');
    
    // Attach user data to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      walletAddress: decoded.walletAddress,
      role: decoded.role || 'user'
    };
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired. Please login again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please login again.'
      });
    }
    
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed.',
      error: error.message
    });
  }
};

/**
 * Role-based authorization middleware
 * @param {string|string[]} roles - Allowed role(s)
 */
const authorizeRoles = (roles) => {
  return (req, res, next) => {
    // authMiddleware should run before this middleware
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    const userRole = req.user.role || 'user';
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You do not have permission to perform this action.'
      });
    }
    
    next();
  };
};

/**
 * Wallet ownership verification middleware
 * Checks if the authenticated user owns the wallet address in the request
 */
const verifyWalletOwnership = (req, res, next) => {
  try {
    const { walletAddress } = req.params;
    
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    if (walletAddress && req.user.walletAddress !== walletAddress) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You do not own this wallet.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Wallet verification error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Wallet verification failed.',
      error: error.message
    });
  }
};

/**
 * Demo authentication middleware
 * For demonstration purposes, this creates a mock user
 * In production, this would be replaced with actual authentication
 */
const demoAuthMiddleware = (req, res, next) => {
  try {
    // Create a mock user for demo purposes
    req.user = {
      id: 'user_1',
      username: 'demouser',
      walletAddress: 'WALLET1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      role: 'user'
    };
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Demo authentication error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed.',
      error: error.message
    });
  }
};

// Use the demo middleware for development
const middlewareToExport = process.env.NODE_ENV === 'production'
  ? authMiddleware
  : demoAuthMiddleware;

module.exports = {
  authMiddleware: middlewareToExport,
  authorizeRoles,
  verifyWalletOwnership
}; 