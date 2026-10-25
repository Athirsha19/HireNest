const express = require('express');
const router = express.Router();
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Worker = require('../models/Worker');
const { getRecommendedWorkers } = require('../utils/aiMatcher');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { uploadSingle } = require('../middleware/upload');

// All routes are protected and employer-only
router.use(protect);
router.use(roleCheck('employer'));

// @desc    Get Employer Dashboard
// @route   GET /api/employer/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const employer = await Employer.findById(req.user.id);
    
    const jobs = await Job.find({ employer: req.user.id });
    const activeJobs = jobs.filter(j => j.status === 'active').length;
    const totalApplications = await Application.countDocuments({ employer: req.user.id });
    const selectedWorkers = await Application.countDocuments({ 
      employer: req.user.id, 
      status: 'selected' 
    });

    res.json({
      employer,
      stats: {
        postedJobs: employer.postedJobs,
        activeJobs,
        totalApplications,
        selectedWorkers
      },
      recentJobs: jobs.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get Employer Profile
// @route   GET /api/employer/profile
router.get('/profile', async (req, res, next) => {
  try {
    const employer = await Employer.findById(req.user.id);
    res.json({ employer });
  } catch (error) {
    next(error);
  }
});

// @desc    Update Employer Profile
// @route   PUT /api/employer/profile
router.put('/profile', uploadSingle('companyLogo'), async (req, res, next) => {
  try {
    const { name, mobile, companyName, companyAddress, location } = req.body;

    const employer = await Employer.findByIdAndUpdate(
      req.user.id,
      {
        name,
        mobile,
        companyName,
        companyAddress,
        location,
        ...(req.file && { companyLogo: req.file.path })
      },
      { new: true, runValidators: true }
    );

    res.json({ 
      message: 'Profile updated successfully', 
      employer 
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get My Jobs
// @route   GET /api/employer/jobs
router.get('/jobs', async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    next(error);
  }
});

// @desc    Get Job Applications
// @route   GET /api/employer/jobs/:jobId/applications
router.get('/jobs/:jobId/applications', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('worker')
      .sort({ appliedAt: -1 });

    res.json({ applications });
  } catch (error) {
    next(error);
  }
});

// @desc    Get Recommended Workers for a Job
// @route   GET /api/employer/jobs/:jobId/recommendations
router.get('/jobs/:jobId/recommendations', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const activeWorkers = await Worker.find({ status: 'active' });
    const recommendations = getRecommendedWorkers(job, activeWorkers, 20);

    res.json({ recommendations });
  } catch (error) {
    next(error);
  }
});

module.exports = router;