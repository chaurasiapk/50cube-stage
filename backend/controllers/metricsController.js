const Metrics = require("../models/Metrics");
const User = require("../models/User");

// @desc    Get admin metrics
// @route   GET /api/admin/metrics
// @access  Admin
const getAdminMetrics = async (req, res) => {
  try {
    const { since, email } = req.query;

    const user = await User.findOne({ email });
    if (!user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Validate since parameter
    if (!since) {
      return res.status(400).json({ message: "Since parameter is required" });
    }

    // Parse since as date
    const sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format for since parameter" });
    }

    // Get metrics since the specified date
    const metrics = await Metrics.find({
      date: { $gte: sinceDate },
    }).sort({ date: 1 });

    // Calculate aggregated metrics
    const aggregated = {
      bursts: 0,
      wins: 0,
      purchases: 0,
      redemptions: 0,
      referrals: 0,
      history: metrics.map((m) => ({
        date: m.date,
        bursts: m.bursts,
        wins: m.wins,
        purchases: m.purchases,
        redemptions: m.redemptions,
        referrals: m.referrals,
      })),
    };

    // Sum up the metrics
    metrics.forEach((metric) => {
      aggregated.bursts += metric.bursts;
      aggregated.wins += metric.wins;
      aggregated.purchases += metric.purchases;
      aggregated.redemptions += metric.redemptions;
      aggregated.referrals += metric.referrals;
    });

    res.json(aggregated);
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAdminMetrics,
};
