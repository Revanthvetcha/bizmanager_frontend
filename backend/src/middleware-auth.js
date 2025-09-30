const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    console.log('Missing Authorization header');
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = header.split(' ')[1];
  if (!token) {
    console.log('Missing token in Authorization header');
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-bizmanager-2024');
    req.user = payload; // e.g. { id, email }
    console.log('Token verified for user:', payload.id);
    next();
  } catch (err) {
    console.error('Invalid token error:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
