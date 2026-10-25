const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    area: { type: String, required: true }
  },
  wage: {
    amount: { type: Number, required: true },
    type: { type: String, enum: ['hourly', 'daily', 'monthly', 'fixed'], required: true }
  },
  duration: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['days', 'weeks', 'months'], required: true }
  },
  vacancies: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'closed', 'filled'],
    default: 'active'
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search and filtering
jobSchema.index({ skills: 1, 'location.district': 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);