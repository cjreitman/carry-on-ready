const express = require('express');
const { generate } = require('../rules/engine');

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const result = generate(req.body);
    res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ errors: err.issues });
    }
    console.error('Generate error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
