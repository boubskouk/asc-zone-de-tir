const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [4, 'Le mot de passe doit contenir au moins 4 caractères'],
  },
  phone: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: { type: String, default: 'Sénégal' },
  },
  profilePhoto: {
    type: String,
    default: '/images/default-avatar.png',
  },
  role: {
    type: String,
    enum: ['member', 'admin', 'moderator'],
    default: 'member',
  },
  membershipStatus: {
    type: String,
    enum: ['active', 'pending', 'expired', 'suspended'],
    default: 'pending',
  },
  membershipNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  disciplines: [{
    type: String,
  }],
  membershipHistory: [{
    year: Number,
    amount: Number,
    paymentDate: Date,
    paymentMethod: String,
  }],
  medicalCertificates: [{
    fileName: String,
    uploadDate: Date,
    expiryDate: Date,
  }],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
  lastLogin: {
    type: Date,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

// Hash password avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, rounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir le nom complet
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Méthode pour vérifier si la cotisation est à jour
userSchema.methods.isMembershipValid = function() {
  const currentYear = new Date().getFullYear();
  return this.membershipHistory.some(m => m.year === currentYear) &&
         this.membershipStatus === 'active';
};

// Virtual pour le nom complet
userSchema.virtual('fullName').get(function() {
  return this.getFullName();
});

// Générer un numéro d'adhérent unique
userSchema.pre('save', async function(next) {
  if (!this.membershipNumber && this.membershipStatus === 'active') {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.membershipNumber = `ASC${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Options de transformation pour JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationExpires;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
