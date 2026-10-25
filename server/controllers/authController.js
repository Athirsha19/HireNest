
const Worker = require('../models/Worker');
const Employer = require('../models/Employer');
const User = require('../models/User');
const generateToken = require('../utils/tokenGenerator');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// @desc    Register Worker
// @route   POST /api/auth/register/worker
// @access  Public
const registerWorker = async (req, res, next) => {
  try {
    const { name, email, mobile, password, skills, location, governmentId } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Parse JSON strings if needed
    const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    const parsedGovId = typeof governmentId === 'string' ? JSON.parse(governmentId) : governmentId;

    // Create worker
    const worker = await Worker.create({
      name,
      email,
      mobile,
      password,
      role: 'worker',
      skills: parsedSkills,
      location: parsedLocation,
      governmentId: {
        type: parsedGovId.type,
        number: parsedGovId.number,
        document: req.file ? req.file.path : parsedGovId.document
      }
    });

    // Send registration email
    await sendEmail(
      email,
      'Registration Received - HireNest',
      emailTemplates.workerRegistration(name)
    );

    res.status(201).json({
      message: 'Worker registration successful. Awaiting admin approval.',
      workerId: worker._id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register Employer
// @route   POST /api/auth/register/employer
// @access  Public
const registerEmployer = async (req, res, next) => {
  try {
    const { name, email, mobile, password, companyName, companyAddress, location } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Parse location if it's a JSON string
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;

    // Validate location exists and has required fields
    if (!parsedLocation || !parsedLocation.state || !parsedLocation.district || !parsedLocation.area) {
      return res.status(400).json({ 
        message: 'Location details (state, district, area) are required' 
      });
    }

    // Handle file uploads
    const documents = {
      license: req.files?.license?.[0]?.path || '',
      registration: req.files?.registration?.[0]?.path || ''
    };

    // Validate documents
    if (!documents.license || !documents.registration) {
      return res.status(400).json({ 
        message: 'Both license and registration documents are required' 
      });
    }

    // Create employer
    const employer = await Employer.create({
      name,
      email,
      mobile,
      password,
      role: 'employer',
      companyName,
      companyAddress,
      location: parsedLocation,
      documents
    });

    // Send registration email
    await sendEmail(
      email,
      'Registration Received - HireNest',
      emailTemplates.employerRegistration(name, companyName)
    );

    res.status(201).json({
      message: 'Employer registration successful. Awaiting admin approval.',
      employerId: employer._id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check account status
    if (user.status === 'pending') {
      return res.status(403).json({ 
        message: 'Your account is pending admin approval' 
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ 
        message: 'Your account has been rejected. Please contact support.' 
      });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ 
        message: 'Your account has been blocked. Please contact support.' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send login notification email
    await sendEmail(
      email,
      'New Login Detected - HireNest',
      emailTemplates.newLogin(user.name, req.ip, new Date().toLocaleString())
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current User
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerWorker,
  registerEmployer,
  login,
  getMe
};
