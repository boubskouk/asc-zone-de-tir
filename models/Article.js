const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
  },
  excerpt: {
    type: String,
    maxlength: 300,
  },
  category: {
    type: String,
    enum: ['sport', 'culture', 'evenement', 'vie-associative'],
    required: true,
  },
  featuredImage: {
    type: String,
  },
  images: [{
    url: String,
    caption: String,
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  publishedAt: {
    type: Date,
  },
  views: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  allowComments: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
  },
}, {
  timestamps: true,
});

// Générer le slug automatiquement
articleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Générer l'extrait si non fourni
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...';
  }

  // Définir la date de publication
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Index pour la recherche
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, publishedAt: -1 });

module.exports = mongoose.model('Article', articleSchema);
