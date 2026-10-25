const Worker = require('../models/Worker');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { getRecommendedJobs } = require('../utils/aiMatcher');

// @desc    Get Worker Dashboard
// @route   GET /api/worker/dashboard
// @access  Private (Worker)
const getDashboard = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user.id);

    // Get statistics
    const applications = await Application.find({ worker: req.user.id });
    const totalApplications = applications.length;
    const selectedApplications = applications.filter(a => a.status === 'selected').length;
    const completedApplications = applications.filter(a => a.status === 'completed').length;

    // Get recommended jobs
    const activeJobs = await Job.find({ status: 'active' }).populate('employer', 'name companyName');
    const recommendedJobs = getRecommendedJobs(worker, activeJobs, 5);

    res.json({
      worker,
      stats: {
        totalApplications,
        selectedApplications,
        completedApplications,
        rating: worker.rating.average,
        ratingCount: worker.rating.count
      },
      recommendedJobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Worker Profile
// @route   GET /api/worker/profile
// @access  Private (Worker)
const getProfile = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user.id);
    res.json({ worker });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Worker Profile
// @route   PUT /api/worker/profile
// @access  Private (Worker)
const updateProfile = async (req, res, next) => {
  try {
    const { name, mobile, skills, location } = req.body;

    const worker = await Worker.findByIdAndUpdate(
      req.user.id,
      {
        name,
        mobile,
        skills,
        location,
        ...(req.file && { profilePicture: req.file.path })
      },
      { new: true, runValidators: true }
    );

    res.json({ 
      message: 'Profile updated successfully', 
      worker 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Jobs
// @route   GET /api/worker/jobs
// @access  Private (Worker)
const getAllJobs = async (req, res, next) => {
  try {
    const { skill, district, minWage, maxWage } = req.query;
    
    // Build filter
    const filter = { status: 'active' };
    
    if (skill) {
      filter.skills = { $in: [new RegExp(skill, 'i')] };
    }
    
    if (district) {
      filter['location.district'] = new RegExp(district, 'i');
    }
    
    if (minWage || maxWage) {
      filter['wage.amount'] = {};
      if (minWage) filter['wage.amount'].$gte = parseInt(minWage);
      if (maxWage) filter['wage.amount'].$lte = parseInt(maxWage);
    }

    const jobs = await Job.find(filter)
      .populate('employer', 'name companyName location')
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Recommended Jobs
// @route   GET /api/worker/jobs/recommended
// @access  Private (Worker)
const getRecommendedJobsForWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user.id);
    const activeJobs = await Job.find({ status: 'active' }).populate('employer', 'name companyName');
    
    const recommendedJobs = getRecommendedJobs(worker, activeJobs, 20);

    res.json({ jobs: recommendedJobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Worker Applications
// @route   GET /api/worker/applications
// @access  Private (Worker)
const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ worker: req.user.id })
      .populate('job')
      .populate('employer', 'name companyName')
      .sort({ appliedAt: -1 });

    res.json({ applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Work History
// @route   GET /api/worker/history
// @access  Private (Worker)
const getWorkHistory = async (req, res, next) => {
  try {
    const completedApplications = await Application.find({ 
      worker: req.user.id,
      status: 'completed'
    })
      .populate('job')
      .populate('employer', 'name companyName')
      .populate({
        path: 'job',
        populate: {
          path: 'employer',
          select: 'name companyName'
        }
      })
      .sort({ completedAt: -1 });

    res.json({ history: completedApplications });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getAllJobs,
  getRecommendedJobsForWorker,
  getApplications,
  getWorkHistory
};