const mongoose = require('mongoose');

const MetricsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    bursts: {
      type: Number,
      default: 0,
    },
    wins: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Number,
      default: 0,
    },
    redemptions: {
      type: Number,
      default: 0,
    },
    referrals: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Metrics', MetricsSchema);