// authMiddleware.js

import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  // 1. Get token from Authorization header (Bearer <token>)
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Alternative locations (sometimes used)
  // token = req.cookies?.token || req.query?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized - no token provided',
    });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user info to request (you'll usually fetch full user from DB here)
    req.user = decoded; // { id, role, email, ... }

    next(); // User is authenticated → proceed
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized - token invalid or expired',
    });
  }
};

// Optional: Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not allowed to access this route`,
      });
    }
    next();
  };
};

