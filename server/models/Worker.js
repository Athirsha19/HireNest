const mongoose = require('mongoose');
const User = require('./User');

const workerSchema = new mongoose.Schema({
  workerId: {
    type: String,
    unique: true,
    sparse: true
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
  governmentId: {
    type: { type: String, enum: ['aadhaar', 'voter_id'], required: true },
    number: { type: String },
    document: { type: String, required: true }
  },
  profilePicture: {
    type: String
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  completedJobs: {
    type: Number,
    default: 0
  }
});

// Generate unique Worker ID on approval
workerSchema.methods.generateWorkerId = function() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  this.workerId = `WK${timestamp}${random}`.toUpperCase();
};

const Worker = User.discriminator('worker', workerSchema);

module.exports = Worker;