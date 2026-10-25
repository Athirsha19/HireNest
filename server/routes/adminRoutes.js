const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All routes are protected and admin-only
router.use(protect);
router.use(roleCheck('admin'));

router.get('/dashboard', getDashboard);

// Worker management
router.get('/workers/pending', getPendingWorkers);
router.patch('/workers/:id/verify', verifyWorker);

// Employer management
router.get('/employers/pending', getPendingEmployers);
router.patch('/employers/:id/verify', verifyEmployer);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/block', blockUser);

// Job management
router.get('/jobs', getAllJobs);
router.patch('/jobs/:id/disable', disableJob);

// Reports
router.get('/reports', getReports);

module.exports = router;