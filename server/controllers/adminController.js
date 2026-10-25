const Worker = require('../models/Worker');
const Employer = require('../models/Employer');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Grievance = require('../models/Grievance');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// @desc    Get Admin Dashboard
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboard = async (req, res, next) => {
  try {
    const stats = {
      totalWorkers: await Worker.countDocuments(),
      activeWorkers: await Worker.countDocuments({ status: 'active' }),
      pendingWorkers: await Worker.countDocuments({ status: 'pending' }),
      totalEmployers: await Employer.countDocuments(),
      activeEmployers: await Employer.countDocuments({ status: 'active' }),
      pendingEmployers: await Employer.countDocuments({ status: 'pending' }),
      totalJobs: await Job.countDocuments(),
      activeJobs: await Job.countDocuments({ status: 'active' }),
      totalApplications: await Application.countDocuments(),
      completedJobs: await Application.countDocuments({ status: 'completed' }),
      openGrievances: await Grievance.countDocuments({ status: 'open' })
    };

    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Pending Workers
// @route   GET /api/admin/workers/pending
// @access  Private (Admin)
const getPendingWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({ workers });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject Worker
// @route   PATCH /api/admin/workers/:id/verify
// @access  Private (Admin)
const verifyWorker = async (req, res, next) => {
  try {
    const { action, reason } = req.body; // action: 'approve' or 'reject'
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    if (action === 'approve') {
      worker.status = 'active';
      worker.generateWorkerId();
      await worker.save();

      // Send approval email
      await sendEmail(
        worker.email,
        'Account Approved - HireNest',
        emailTemplates.workerApproval(worker.name, worker.workerId)
      );

      res.json({ message: 'Worker approved successfully', worker });
    } else if (action === 'reject') {
      worker.status = 'rejected';
      await worker.save();

      // Send rejection email
      await sendEmail(
        worker.email,
        'Account Status Update - HireNest',
        emailTemplates.workerRejection(worker.name, reason || 'Document verification failed')
      );

      res.json({ message: 'Worker rejected', worker });
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get Pending Employers
// @route   GET /api/admin/employers/pending
// @access  Private (Admin)
const getPendingEmployers = async (req, res, next) => {
  try {
    const employers = await Employer.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({ employers });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject Employer
// @route   PATCH /api/admin/employers/:id/verify
// @access  Private (Admin)
const verifyEmployer = async (req, res, next) => {
  try {
    const { action, reason } = req.body;
    const employer = await Employer.findById(req.params.id);

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    if (action === 'approve') {
      employer.status = 'active';
      employer.generateEmployerId();
      await employer.save();

      // Send approval email
      await sendEmail(
        employer.email,
        'Account Approved - HireNest',
        emailTemplates.employerApproval(employer.name, employer.employerId)
      );

      res.json({ message: 'Employer approved successfully', employer });
    } else if (action === 'reject') {
      employer.status = 'rejected';
      await employer.save();

      // Send rejection email
      await sendEmail(
        employer.email,
        'Account Status Update - HireNest',
        emailTemplates.employerRejection(employer.name, reason || 'Document verification failed')
      );

      res.json({ message: 'Employer rejected', employer });
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, status } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

// @desc    Block/Unblock User
// @route   PATCH /api/admin/users/:id/block
// @access  Private (Admin)
const blockUser = async (req, res, next) => {
  try {
    const { block } = req.body; // true or false
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: block ? 'blocked' : 'active' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: `User ${block ? 'blocked' : 'unblocked'} successfully`, 
      user 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Jobs
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate('employer', 'name companyName')
      .sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Disable Job
// @route   PATCH /api/admin/jobs/:id/disable
// @access  Private (Admin)
const disableJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: 'closed' },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job disabled successfully', job });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Reports/Analytics
// @route   GET /api/admin/reports
// @access  Private (Admin)
const getReports = async (req, res, next) => {
  try {
    const reports = {
      jobSuccessRate: {
        total: await Application.countDocuments(),
        completed: await Application.countDocuments({ status: 'completed' }),
        selected: await Application.countDocuments({ status: 'selected' })
      },
      workerEmploymentRate: {
        total: await Worker.countDocuments({ status: 'active' }),
        employed: await Application.countDocuments({ 
          status: { $in: ['selected', 'completed'] } 
        })
      },
      topSkills: await Job.aggregate([
        { $unwind: '$skills' },
        { $group: { _id: '$skills', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      monthlyJobPostings: await Job.aggregate([
        {
          $group: {
            _id: { 
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
      ])
    };

    res.json({ reports });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getPendingWorkers,
  verifyWorker,
  getPendingEmployers,
  verifyEmployer,
  getAllUsers,
  blockUser,
  getAllJobs,
  disableJob,
  getReports
};