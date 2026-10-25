const Rating = require('../models/Rating');
const Application = require('../models/Application');
const Worker = require('../models/Worker');
const Job = require('../models/Job');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// @desc    Rate Worker
// @route   POST /api/rating
// @access  Private (Employer)
const rateWorker = async (req, res, next) => {
  try {
    const { applicationId, rating, feedback } = req.body;

    // 1. Verify application exists and populate worker details for email/stats
    // We populate 'worker' to get the ID for Worker profile lookup
    const application = await Application.findById(applicationId)
      .populate('worker');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // 2. Security: Ensure the employer rating the worker is the one who owns the job
    if (application.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to rate this application' });
    }

    // 3. Status Check: Allow rating if the worker was hired ('selected') OR already 'completed'
    // This fixed the "Rating failed" error you saw when status was 'SELECTED'
    const validStatuses = ['selected', 'completed'];
    if (!validStatuses.includes(application.status)) {
      return res.status(400).json({ 
        message: 'Worker must be hired (selected) before they can be rated' 
      });
    }

    // 4. Prevent duplicate ratings for the same job application
    const existingRating = await Rating.findOne({ application: applicationId });
    if (existingRating) {
      return res.status(400).json({ message: 'Worker already rated for this job' });
    }

    // 5. Create the Rating record
    const newRating = await Rating.create({
      application: applicationId,
      worker: application.worker._id,
      employer: req.user.id,
      job: application.job,
      rating: Number(rating),
      feedback
    });

    // 6. Update Worker's profile statistics
    // We find the Worker profile by their ID
    const workerProfile = await Worker.findById(application.worker._id);
    
    if (workerProfile) {
      // Fetch all ratings for this worker to calculate accurate average
      const allRatings = await Rating.find({ worker: application.worker._id });
      
      const totalScore = allRatings.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalScore / allRatings.length;

      // Update stats: round to 1 decimal place
      workerProfile.rating.average = Math.round(avgRating * 10) / 10;
      workerProfile.rating.count = allRatings.length;
      
      // Since they are being rated, they have successfully finished this job
      workerProfile.completedJobs += 1; 
      
      await workerProfile.save();
    }

    // 7. Update Application status to reflect completion and rating
    application.status = 'completed';
    application.isRated = true; 
    await application.save();

    // 8. Send notification email to the worker (Non-blocking)
    try {
      const jobData = await Job.findById(application.job);
      if (application.worker.email) {
        await sendEmail(
          application.worker.email,
          'You have received a rating - HireNest',
          emailTemplates.workerRated(
            application.worker.name,
            rating,
            jobData ? jobData.title : 'the job'
          )
        );
      }
    } catch (emailError) {
      console.error('Rating saved, but email notification failed:', emailError.message);
    }

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating
    });

  } catch (error) {
    console.error('RateWorker Error:', error);
    next(error);
  }
};

// @desc    Get Worker Ratings (Publicly visible on worker profile)
// @route   GET /api/rating/worker/:workerId
// @access  Public
const getWorkerRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ worker: req.params.workerId })
      .populate('employer', 'name companyName')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    const worker = await Worker.findById(req.params.workerId);

    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    res.json({
      ratings,
      averageRating: worker.rating.average,
      totalRatings: worker.rating.count
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  rateWorker,
  getWorkerRatings
};