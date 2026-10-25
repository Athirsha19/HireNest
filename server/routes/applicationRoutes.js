const express = require('express');
const router = express.Router();
const {
  applyForJob,
  updateApplicationStatus,
  markCompleteByWorker,
  confirmCompleteByEmployer
} = require('../controllers/applicationController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All routes are protected
router.use(protect);

// Worker routes
router.post('/', roleCheck('worker'), applyForJob);
router.patch('/:id/complete/worker', roleCheck('worker'), markCompleteByWorker);

// Employer routes
router.patch('/:id/status', roleCheck('employer'), updateApplicationStatus);
router.patch('/:id/complete/employer', roleCheck('employer'), confirmCompleteByEmployer);

module.exports = router;