const mongoose = require('mongoose');
const slugify = require('slugify');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['photo', 'video'],
    required: true,
  },
  items: [{
    url: {
      type: String,
      required: true,
    },
    thumbnail: String,
    caption: String,
    order: Number,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  views: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Générer le slug
gallerySchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Index
gallerySchema.index({ date: -1 });
gallerySchema.index({ type: 1, date: -1 });

module.exports = mongoose.model('Gallery', gallerySchema);
