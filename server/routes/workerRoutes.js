const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getProfile,
  updateProfile,
  getAllJobs,
  getRecommendedJobsForWorker,
  getApplications,
  getWorkHistory
} = require('../controllers/workerController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { uploadSingle } = require('../middleware/upload');

// All routes are protected and worker-only
router.use(protect);
router.use(roleCheck('worker'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', uploadSingle('profilePicture'), updateProfile);
router.get('/jobs', getAllJobs);
router.get('/jobs/recommended', getRecommendedJobsForWorker);
router.get('/applications', getApplications);
router.get('/history', getWorkHistory);

module.exports = router;