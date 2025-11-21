const mongoose = require('mongoose');
const slugify = require('slugify');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise'],
  },
  endDate: {
    type: Date,
  },
  location: {
    name: String,
    address: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  eventType: {
    type: String,
    enum: ['competition', 'training', 'meeting', 'cultural', 'social'],
    required: true,
  },
  category: {
    type: String,
    enum: ['sport', 'culture', 'mixte'],
  },
  featuredImage: {
    type: String,
  },
  maxParticipants: {
    type: Number,
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['registered', 'confirmed', 'cancelled'],
      default: 'registered',
    },
  }],
  registrationRequired: {
    type: Boolean,
    default: false,
  },
  registrationDeadline: {
    type: Date,
  },
  price: {
    type: Number,
    default: 0,
  },
  organizerInfo: {
    name: String,
    email: String,
    phone: String,
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Générer le slug
eventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Mettre à jour le statut en fonction de la date
  const now = new Date();
  if (this.endDate && this.endDate < now) {
    this.status = 'completed';
  } else if (this.startDate <= now && (!this.endDate || this.endDate >= now)) {
    this.status = 'ongoing';
  }

  next();
});

// Méthode pour vérifier si les inscriptions sont ouvertes
eventSchema.methods.isRegistrationOpen = function() {
  const now = new Date();
  if (!this.registrationRequired) return false;
  if (this.registrationDeadline && this.registrationDeadline < now) return false;
  if (this.maxParticipants && this.participants.length >= this.maxParticipants) return false;
  return this.status === 'upcoming';
};

// Méthode pour obtenir le nombre de places restantes
eventSchema.methods.availableSpots = function() {
  if (!this.maxParticipants) return Infinity;
  return this.maxParticipants - this.participants.length;
};

// Virtual pour le nombre de participants
eventSchema.virtual('participantsCount').get(function() {
  return this.participants.length;
});

// Index
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ eventType: 1, startDate: 1 });

module.exports = mongoose.model('Event', eventSchema);
