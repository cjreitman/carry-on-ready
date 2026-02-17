const express = require('express');
const Plan = require('../models/Plan');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

// POST /api/plans
router.post('/', async (req, res) => {
  const { title, inputs, checklistSnapshot, rulesVersion } = req.body;

  if (!title || !inputs || !checklistSnapshot || !rulesVersion) {
    return res.status(400).json({ error: 'title, inputs, checklistSnapshot, and rulesVersion are required.' });
  }

  try {
    const plan = await Plan.create({
      email: req.user.email,
      title,
      inputs,
      checklistSnapshot,
      rulesVersion,
    });
    res.status(201).json({ plan });
  } catch (err) {
    console.error('Create plan error:', err.message);
    res.status(500).json({ error: 'Failed to save plan.' });
  }
});

// GET /api/plans
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find({ email: req.user.email })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ plans });
  } catch (err) {
    console.error('List plans error:', err.message);
    res.status(500).json({ error: 'Failed to load plans.' });
  }
});

// GET /api/plans/:id
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).lean();
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }
    if (plan.email !== req.user.email) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    res.json({ plan });
  } catch (err) {
    console.error('Get plan error:', err.message);
    res.status(500).json({ error: 'Failed to load plan.' });
  }
});

// PUT /api/plans/:id
router.put('/:id', async (req, res) => {
  const { title, checklistSnapshot } = req.body;

  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }
    if (plan.email !== req.user.email) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (title !== undefined) plan.title = title;
    if (checklistSnapshot !== undefined) plan.checklistSnapshot = checklistSnapshot;
    await plan.save();

    res.json({ plan });
  } catch (err) {
    console.error('Update plan error:', err.message);
    res.status(500).json({ error: 'Failed to update plan.' });
  }
});

// DELETE /api/plans/:id
router.delete('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }
    if (plan.email !== req.user.email) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    await plan.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete plan error:', err.message);
    res.status(500).json({ error: 'Failed to delete plan.' });
  }
});

module.exports = router;
