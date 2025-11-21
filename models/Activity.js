const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'bi-trophy',
    },
    category: {
      type: String,
      enum: ['tir', 'football', 'basketball', 'volleyball', 'athletisme', 'danse', 'theatre', 'musique', 'arts', 'culture', 'autre'],
      default: 'autre',
    },
    type: {
      type: String,
      enum: ['sportive', 'culturelle'],
      default: 'sportive',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
