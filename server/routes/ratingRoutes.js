const express = require('express');
const router = express.Router();
const { rateWorker, getWorkerRatings } = require('../controllers/ratingController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Employer only - rate worker
router.post('/', protect, roleCheck('employer'), rateWorker);

// Public - get worker ratings
router.get('/worker/:workerId', getWorkerRatings);

module.exports = router;