const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  competition: {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: String,
    level: {
      type: String,
      enum: ['local', 'regional', 'national', 'international'],
    },
  },
  discipline: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  rankings: [{
    position: {
      type: Number,
      required: true,
    },
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    athleteName: String,
    score: String,
    points: Number,
    time: String,
    details: String,
  }],
  teamResult: {
    position: Number,
    teamName: String,
    score: String,
  },
  records: [{
    type: {
      type: String,
      enum: ['personal', 'club', 'regional', 'national'],
    },
    description: String,
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  photos: [{
    url: String,
    caption: String,
  }],
  reportLink: String,
  notes: String,
  status: {
    type: String,
    enum: ['provisional', 'final', 'unofficial'],
    default: 'provisional',
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index pour les recherches
resultSchema.index({ 'competition.date': -1 });
resultSchema.index({ discipline: 1, 'competition.date': -1 });

module.exports = mongoose.model('Result', resultSchema);
