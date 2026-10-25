const express = require('express');
const router = express.Router();
const { 
  registerWorker, 
  registerEmployer, 
  login, 
  getMe 
} = require('../controllers/authController');
const protect = require('../middleware/auth');
const { uploadSingle, uploadFields } = require('../middleware/upload');

// Public routes
router.post('/register/worker', uploadSingle('governmentId'), registerWorker);
router.post('/register/employer', uploadFields([
  { name: 'license', maxCount: 1 },
  { name: 'registration', maxCount: 1 }
]), registerEmployer);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;