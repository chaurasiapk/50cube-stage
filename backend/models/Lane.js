const mongoose = require('mongoose');

const LaneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    impactScore: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      enum: ['ok', 'watchlist', 'save', 'archive'],
      default: 'ok',
    },
    metrics: {
      users: {
        type: Number,
        default: 0,
      },
      engagement: {
        type: Number,
        default: 0,
      },
      retention: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lane', LaneSchema);