require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

const generateRouter = require('./routes/generate');
const plansRouter = require('./routes/plans');

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/generate', generateRouter);
app.use('/api/plans', plansRouter);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown so nodemon can restart without EADDRINUSE
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());

// Connect to MongoDB in background — plans routes need it, generate does not
connectDB();
