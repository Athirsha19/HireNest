const express = require('express');
const router = express.Router();
const {
  submitGrievance,
  getMyGrievances,
  getAllGrievances,
  updateGrievanceStatus
} = require('../controllers/grievanceController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { uploadMultiple } = require('../middleware/upload');

// All routes are protected
router.use(protect);

// Worker and Employer routes
router.post('/', uploadMultiple('attachments', 3), submitGrievance);
router.get('/my', getMyGrievances);

// Admin only routes
router.get('/', roleCheck('admin'), getAllGrievances);
router.patch('/:id', roleCheck('admin'), updateGrievanceStatus);

module.exports = router;