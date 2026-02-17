const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  title: { type: String, required: true },
  inputs: { type: Object, required: true },
  checklistSnapshot: { type: Array, required: true },
  rulesVersion: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

planSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Plan', planSchema);
