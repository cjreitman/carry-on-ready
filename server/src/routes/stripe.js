const express = require('express');
const Stripe = require('stripe');
const jwt = require('jsonwebtoken');

const router = express.Router();

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// POST /api/stripe/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 900,
            product_data: { name: 'Carry-On Ready Pro (one-time unlock)' },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}`,
      cancel_url: `${process.env.CLIENT_URL}/unlock`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe create-checkout-session error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

// POST /api/stripe/verify-session
router.post('/verify-session', async (req, res) => {
  const { sessionId, email } = req.body;
  if (!sessionId || !email) {
    return res.status(400).json({ error: 'sessionId and email are required.' });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed.' });
    }

    const sessionEmail =
      session.customer_email || session.customer_details?.email;
    if (sessionEmail?.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({ error: 'Email mismatch.' });
    }

    const token = jwt.sign(
      { email: email.toLowerCase(), isPro: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Stripe verify-session error:', err.message);
    res.status(500).json({ error: 'Failed to verify session.' });
  }
});

module.exports = router;
