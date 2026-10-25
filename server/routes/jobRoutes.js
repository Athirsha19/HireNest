const express = require('express');
const router = express.Router();
const {
  createJob,
  getJob,
  updateJob,
  deleteJob,
  closeJob
} = require('../controllers/jobController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public routes
router.get('/:id', getJob);

// Protected routes - Employer only
router.post('/', protect, roleCheck('employer'), createJob);
router.put('/:id', protect, roleCheck('employer'), updateJob);
router.delete('/:id', protect, roleCheck('employer'), deleteJob);
router.patch('/:id/close', protect, roleCheck('employer'), closeJob);

module.exports = router;