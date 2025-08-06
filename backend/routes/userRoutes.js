const express = require('express');
const router = express.Router();

// Import the controller function to handle user profile retrieval
const { getUserProfile } = require('../controllers/userController');

// Route: GET /api/user/profile
router.get('/profile', getUserProfile);

// Export the router to be used in the main application
module.exports = router;
