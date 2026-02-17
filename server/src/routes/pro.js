const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// GET /api/pro/status
router.get('/status', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.json({ isPro: false });
  }

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.isPro) {
      return res.json({ isPro: true, email: payload.email });
    }
    return res.json({ isPro: false });
  } catch {
    return res.json({ isPro: false });
  }
});

module.exports = router;
