const Application = require('../models/Application');
const Job = require('../models/Job');
const Worker = require('../models/Worker');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// @desc    Apply for Job
// @route   POST /api/application
// @access  Private (Worker)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId).populate('employer');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ message: 'This job is no longer active' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      worker: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      worker: req.user.id,
      employer: job.employer._id
    });

    // Update job applications count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

    // Get worker details for email
    const worker = await Worker.findById(req.user.id);

    // Send email to employer
    await sendEmail(
      job.employer.email,
      'New Job Application - HireNest',
      emailTemplates.jobApplication(worker.name, job.title, job.employer.name)
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Application Status
// @route   PATCH /api/application/:id/status
// @access  Private (Employer)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('worker')
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if employer owns this job
    if (application.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    
    if (status === 'selected') {
      application.selectedAt = new Date();
    }

    await application.save();

    // Send email notification to worker
    if (status === 'selected') {
      const employer = await require('../models/Employer').findById(req.user.id);
      await sendEmail(
        application.worker.email,
        'Congratulations! You have been selected - HireNest',
        emailTemplates.jobSelected(
          application.worker.name,
          application.job.title,
          employer.companyName
        )
      );
    } else {
      await sendEmail(
        application.worker.email,
        'Application Status Update - HireNest',
        emailTemplates.applicationStatusUpdate(
          application.worker.name,
          application.job.title,
          status
        )
      );
    }

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark Job as Complete (Worker)
// @route   PATCH /api/application/:id/complete/worker
// @access  Private (Worker)
const markCompleteByWorker = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('employer');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.worker.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.workerMarkedComplete = true;

    if (application.employerConfirmedComplete) {
      application.status = 'completed';
      application.completedAt = new Date();
    }

    await application.save();

    // Notify employer
    await sendEmail(
      application.employer.email,
      'Job Completion Notification - HireNest',
      emailTemplates.jobCompleted(
        application.employer.name,
        req.user.name,
        application.job.title
      )
    );

    res.json({
      message: 'Job marked as complete. Awaiting employer confirmation.',
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm Job Complete (Employer)
// @route   PATCH /api/application/:id/complete/employer
// @access  Private (Employer)
const confirmCompleteByEmployer = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.employerConfirmedComplete = true;

    if (application.workerMarkedComplete) {
      application.status = 'completed';
      application.completedAt = new Date();

      // Update worker's completed jobs count
      await Worker.findByIdAndUpdate(application.worker, {
        $inc: { completedJobs: 1 }
      });
    }

    await application.save();

    res.json({
      message: 'Job completion confirmed',
      application
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  updateApplicationStatus,
  markCompleteByWorker,
  confirmCompleteByEmployer
};