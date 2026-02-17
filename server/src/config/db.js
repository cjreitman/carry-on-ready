const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Plans and Pro features will be unavailable until MongoDB is connected.');
  }
}

module.exports = connectDB;
