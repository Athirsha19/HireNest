const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'selected', 'rejected', 'completed'],
    default: 'applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  selectedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  workerMarkedComplete: {
    type: Boolean,
    default: false
  },
  employerConfirmedComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, worker: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);