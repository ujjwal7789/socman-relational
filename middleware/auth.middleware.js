// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

// Middleware to verify the JWT
const verifyToken = (req, res, next) => {
  // Get the token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format is "Bearer TOKEN"

  // If no token is provided, deny access
  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user information to the request object
    // Now, any subsequent middleware or controller can access it
    req.user = decoded;

  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token.' });
  }

  // If the token is valid, proceed to the next function (the controller)
  return next();
};

// Optional: Middleware to check for a specific role
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Requires admin role.' });
    }
};

const isResident = (req, res, next) => {
    if (req.user && req.user.role === 'resident') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Requires resident role.' });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isResident
};