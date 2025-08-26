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


const hasRole = (roles) => { // roles will be an array, e.g., ['admin', 'security']
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Requires one of the following roles: ${roles.join(', ')}` });
    }
    next();
  };
};

const protectView = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = decoded;
    next();
  } catch (error) {
    return res.redirect('/login');
  }
};

module.exports = {
    verifyToken,
    hasRole,
    protectView
};