
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Worker = require('../models/Worker');
const { getRecommendedWorkers } = require('../utils/aiMatcher');

// @desc    Get Employer Dashboard
// @route   GET /api/employer/dashboard
// @access  Private (Employer)
const getDashboard = async (req, res, next) => {
  try {
    const employer = await Employer.findById(req.user.id);

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    // Get statistics
    const jobs = await Job.find({ employer: req.user.id });
    const activeJobs = jobs.filter(j => j.status === 'active').length;
    const totalApplications = await Application.countDocuments({ employer: req.user.id });
    const selectedWorkers = await Application.countDocuments({ 
      employer: req.user.id, 
      status: 'selected' 
    });

    // Get recent jobs
    const recentJobs = await Job.find({ employer: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('employer', 'name companyName');

    res.json({
      employer,
      stats: {
        postedJobs: employer.postedJobs,
        activeJobs,
        totalApplications,
        selectedWorkers
      },
      recentJobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Employer Profile
// @route   GET /api/employer/profile
// @access  Private (Employer)
const getProfile = async (req, res, next) => {
  try {
    const employer = await Employer.findById(req.user.id);
    
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.json({ employer });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Employer Profile
// @route   PUT /api/employer/profile
// @access  Private (Employer)
const updateProfile = async (req, res, next) => {
  try {
    const { name, mobile, companyName, companyAddress, location } = req.body;

    const updateData = {
      name,
      mobile,
      companyName,
      companyAddress
    };

    // Parse location if it's a string
    if (location) {
      updateData.location = typeof location === 'string' ? JSON.parse(location) : location;
    }

    // Add company logo if uploaded
    if (req.file) {
      updateData.companyLogo = req.file.path;
    }

    const employer = await Employer.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.json({ 
      message: 'Profile updated successfully', 
      employer 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Employer Jobs
// @route   GET /api/employer/jobs
// @access  Private (Employer)
const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Job Applications
// @route   GET /api/employer/jobs/:jobId/applications
// @access  Private (Employer)
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Verify job belongs to employer
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    // Get applications with worker details
    const applications = await Application.find({ job: jobId })
      .populate('worker')
      .sort({ appliedAt: -1 });

    res.json({ applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Recommended Workers for a Job
// @route   GET /api/employer/jobs/:jobId/recommendations
// @access  Private (Employer)
const getRecommendations = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Verify job belongs to employer
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get active workers
    const activeWorkers = await Worker.find({ status: 'active' });

    // Get AI recommendations
    const recommendations = getRecommendedWorkers(job, activeWorkers, 20);

    res.json({ recommendations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Job Details
// @route   GET /api/employer/jobs/:jobId
// @access  Private (Employer)
const getJobDetails = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate('employer', 'name companyName');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ job });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Employer Statistics
// @route   GET /api/employer/statistics
// @access  Private (Employer)
const getStatistics = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments({ employer: req.user.id });
    const activeJobs = await Job.countDocuments({ employer: req.user.id, status: 'active' });
    const totalApplications = await Application.countDocuments({ employer: req.user.id });
    const selectedApplications = await Application.countDocuments({ 
      employer: req.user.id, 
      status: 'selected' 
    });
    const completedJobs = await Application.countDocuments({ 
      employer: req.user.id, 
      status: 'completed' 
    });

    // Get job statistics by status
    const jobsByStatus = await Job.aggregate([
      { $match: { employer: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get applications by status
    const applicationsByStatus = await Application.aggregate([
      { $match: { employer: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      statistics: {
        totalJobs,
        activeJobs,
        totalApplications,
        selectedApplications,
        completedJobs,
        jobsByStatus,
        applicationsByStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getJobs,
  getJobApplications,
  getRecommendations,
  getJobDetails,
  getStatistics
};