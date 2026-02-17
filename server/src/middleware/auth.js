const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    if (!payload.isPro) {
      return res.status(403).json({ error: 'Pro subscription required.' });
    }
    req.user = { email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = requireAuth;
