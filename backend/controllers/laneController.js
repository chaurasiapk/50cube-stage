const Lane = require('../models/Lane');

/**
 * @desc    Fetch all lanes sorted by impact score (descending)
 * @route   GET /api/admin/lanes/impact
 * @access  Admin only
 */
const getLanesImpact = async (req, res) => {
  try {
    // Fetch lanes and sort them by impactScore descending
    const lanes = await Lane.find().sort({ impactScore: -1 });

    // Return lanes as JSON response
    res.json(lanes);
  } catch (error) {
    console.error('Error fetching lanes impact:', error);
    res.status(500).json({ message: 'Server error while fetching lanes' });
  }
};

/**
 * @desc    Update the state of a specific lane
 * @route   POST /api/admin/lanes/:id/state
 * @access  Admin only
 */
const updateLaneState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    // Define allowed states
    const validStates = ['ok', 'watchlist', 'save', 'archive'];

    // Validate provided state
    if (!state || !validStates.includes(state)) {
      return res.status(400).json({
        message: `Invalid state. Allowed values: ${validStates.join(', ')}.`,
      });
    }

    // Find the lane by ID
    const lane = await Lane.findById(id);

    // If lane does not exist
    if (!lane) {
      return res.status(404).json({ message: 'Lane not found' });
    }

    // Update and save the new state
    lane.state = state;
    await lane.save();

    // Return the updated lane
    res.json(lane);
  } catch (error) {
    console.error('Error updating lane state:', error);
    res.status(500).json({ message: 'Server error while updating state' });
  }
};

module.exports = {
  getLanesImpact,
  updateLaneState,
};
