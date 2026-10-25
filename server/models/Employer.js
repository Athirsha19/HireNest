const mongoose = require('mongoose');
const User = require('./User');

const employerSchema = new mongoose.Schema({
  employerId: {
    type: String,
    unique: true,
    sparse: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  companyAddress: {
    type: String,
    required: true
  },
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    area: { type: String, required: true }
  },
  documents: {
    license: { type: String, required: true },
    registration: { type: String, required: true }
  },
  companyLogo: {
    type: String
  },
  postedJobs: {
    type: Number,
    default: 0
  },
  activeJobs: {
    type: Number,
    default: 0
  }
});

// Generate unique Employer ID on approval
employerSchema.methods.generateEmployerId = function() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  this.employerId = `EM${timestamp}${random}`.toUpperCase();
};

const Employer = User.discriminator('employer', employerSchema);

module.exports = Employer;