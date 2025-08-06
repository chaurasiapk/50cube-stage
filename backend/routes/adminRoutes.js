const express = require('express');
const router = express.Router();
const { 
  getAdminMetrics, 
} = require('../controllers/metricsController');
const {
  getLanesImpact,
  updateLaneState
} = require('../controllers/laneController');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  // In a real app, this would check the user's admin status from the auth token
  // For now, we'll just pass through for demo purposes
  next();
};

// @route   GET /api/admin/metrics
// @desc    Get admin metrics
// @access  Admin
router.get('/metrics', isAdmin, getAdminMetrics);

// @route   GET /api/admin/lanes/impact
// @desc    Get lanes with impact scores
// @access  Admin
router.get('/lanes/impact', isAdmin, getLanesImpact);

// @route   POST /api/admin/lanes/:id/state
// @desc    Update lane state
// @access  Admin
router.post('/lanes/:id/state', isAdmin, updateLaneState);

module.exports = router;