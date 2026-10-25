const Job = require('../models/Job');
const Employer = require('../models/Employer');

// @desc    Create Job
// @route   POST /api/job
// @access  Private (Employer)
const createJob = async (req, res, next) => {
  try {
    const { title, description, skills, location, wage, duration, vacancies } = req.body;

    const job = await Job.create({
      employer: req.user.id,
      title,
      description,
      skills,
      location,
      wage,
      duration,
      vacancies
    });

    // Update employer stats
    await Employer.findByIdAndUpdate(req.user.id, {
      $inc: { postedJobs: 1, activeJobs: 1 }
    });

    res.status(201).json({
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Job
// @route   GET /api/job/:id
// @access  Public
const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name companyName location email mobile');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Job
// @route   PUT /api/job/:id
// @access  Private (Employer - own jobs only)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check ownership
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Job
// @route   DELETE /api/job/:id
// @access  Private (Employer - own jobs only)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check ownership
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    // Update employer stats
    if (job.status === 'active') {
      await Employer.findByIdAndUpdate(req.user.id, {
        $inc: { activeJobs: -1 }
      });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Close Job
// @route   PATCH /api/job/:id/close
// @access  Private (Employer)
const closeJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    job.status = 'closed';
    await job.save();

    // Update employer stats
    await Employer.findByIdAndUpdate(req.user.id, {
      $inc: { activeJobs: -1 }
    });

    res.json({ message: 'Job closed successfully', job });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJob,
  updateJob,
  deleteJob,
  closeJob
};