const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article');
const Event = require('../models/Event');
const Result = require('../models/Result');
const Gallery = require('../models/Gallery');
const Contact = require('../models/Contact');
const { isAdmin } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { validateArticle, validateEvent, handleValidationErrors } = require('../middleware/validation');

// Toutes les routes admin nécessitent les droits administrateur
router.use(isAdmin);

// ==================== DASHBOARD ====================
router.get('/dashboard', async (req, res) => {
  try {
    const stats = {
      members: await User.countDocuments({ role: 'member' }),
      activeMembers: await User.countDocuments({ membershipStatus: 'active' }),
      articles: await Article.countDocuments(),
      events: await Event.countDocuments({ status: 'upcoming' }),
      contacts: await Contact.countDocuments({ status: 'new' }),
    };

    const recentMembers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('admin/dashboard', {
      title: 'Tableau de bord - Administration',
      stats,
      recentMembers,
      recentContacts,
    });
  } catch (error) {
    console.error('Erreur dashboard admin:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

// ==================== MEMBRES ====================
router.get('/membres', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status;

    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) {
      filter.membershipStatus = status;
    }

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const members = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Statistiques
    const stats = {
      total: await User.countDocuments(),
      active: await User.countDocuments({ membershipStatus: 'active' }),
      pending: await User.countDocuments({ membershipStatus: 'pending' }),
      expired: await User.countDocuments({ membershipStatus: 'expired' }),
    };

    res.render('admin/membres/index', {
      title: 'Gestion des membres',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      members,
      stats,
      currentPage: page,
      totalPages,
      search,
      status: status || 'all',
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });

    // Clear messages
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur liste membres:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

router.get('/membres/:id', async (req, res) => {
  try {
    const member = await User.findById(req.params.id);

    if (!member) {
      req.session.errorMessage = 'Membre introuvable.';
      return res.redirect('/admin/membres');
    }

    res.render('admin/membres/detail', {
      title: `${member.fullName}`,
      member,
    });
  } catch (error) {
    console.error('Erreur détail membre:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

router.post('/membres/:id/statut', async (req, res) => {
  try {
    const { membershipStatus } = req.body;
    const member = await User.findById(req.params.id);

    if (!member) {
      req.session.errorMessage = 'Membre introuvable.';
      return res.redirect('/admin/membres');
    }

    member.membershipStatus = membershipStatus;
    await member.save();

    req.session.successMessage = 'Statut mis à jour avec succès.';
    res.redirect(`/admin/membres/${member._id}`);
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    req.session.errorMessage = 'Une erreur est survenue.';
    res.redirect('back');
  }
});

// ==================== ARTICLES ====================
router.get('/articles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const total = await Article.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'firstName lastName');

    res.render('admin/articles/index', {
      title: 'Gestion des articles',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      articles,
      currentPage: page,
      totalPages,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });
  } catch (error) {
    console.error('Erreur liste articles:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

router.post(
  '/articles/nouveau',
  upload.single('featuredImage'),
  validateArticle,
  handleValidationErrors,
  handleUploadError,
  async (req, res) => {
    try {
      const { title, content, excerpt, category, tags, status, isFeatured } = req.body;

      const article = new Article({
        title,
        content,
        excerpt,
        category,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        status: status || 'draft',
        isFeatured: isFeatured === 'on',
        author: req.session.user.id,
      });

      if (req.file) {
        article.featuredImage = '/uploads/articles/' + req.file.filename;
      }

      await article.save();

      req.session.successMessage = 'Article créé avec succès.';
      res.redirect('/admin/articles');
    } catch (error) {
      console.error('Erreur création article:', error);
      req.session.errorMessage = 'Une erreur est survenue.';
      res.redirect('/admin/articles/nouveau');
    }
  }
);

router.get('/articles/:id/modifier', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      req.session.errorMessage = 'Article introuvable.';
      return res.redirect('/admin/articles');
    }

    res.render('admin/articles/form', {
      title: 'Modifier l\'article',
      article,
    });
  } catch (error) {
    console.error('Erreur édition article:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

router.post(
  '/articles/:id/modifier',
  upload.single('featuredImage'),
  validateArticle,
  handleValidationErrors,
  handleUploadError,
  async (req, res) => {
    try {
      const { title, content, excerpt, category, tags, status, isFeatured } = req.body;

      const article = await Article.findById(req.params.id);

      if (!article) {
        req.session.errorMessage = 'Article introuvable.';
        return res.redirect('/admin/articles');
      }

      article.title = title;
      article.content = content;
      article.excerpt = excerpt;
      article.category = category;
      article.tags = tags ? tags.split(',').map(t => t.trim()) : [];
      article.status = status;
      article.isFeatured = isFeatured === 'on';

      if (req.file) {
        article.featuredImage = '/uploads/articles/' + req.file.filename;
      }

      await article.save();

      req.session.successMessage = 'Article mis à jour avec succès.';
      res.redirect('/admin/articles');
    } catch (error) {
      console.error('Erreur modification article:', error);
      req.session.errorMessage = 'Une erreur est survenue.';
      res.redirect(`/admin/articles/${req.params.id}/modifier`);
    }
  }
);

router.post('/articles/:id/supprimer', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);

    req.session.successMessage = 'Article supprimé avec succès.';
    res.redirect('/admin/articles');
  } catch (error) {
    console.error('Erreur suppression article:', error);
    req.session.errorMessage = 'Une erreur est survenue.';
    res.redirect('/admin/articles');
  }
});

// ==================== ÉVÉNEMENTS ====================
router.get('/evenements', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const total = await Event.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const events = await Event.find()
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'firstName lastName');

    res.render('admin/evenements/index', {
      title: 'Gestion des événements',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      events,
      currentPage: page,
      totalPages,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });

    // Clear messages
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur liste événements:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

router.post(
  '/evenements/nouveau',
  upload.single('featuredImage'),
  validateEvent,
  handleValidationErrors,
  handleUploadError,
  async (req, res) => {
    try {
      const {
        title,
        description,
        startDate,
        endDate,
        eventType,
        category,
        locationName,
        locationAddress,
        locationCity,
        maxParticipants,
        registrationRequired,
        registrationDeadline,
        price,
        isPublic,
        isFeatured,
      } = req.body;

      const event = new Event({
        title,
        description,
        startDate,
        endDate: endDate || undefined,
        eventType,
        category,
        location: {
          name: locationName,
          address: locationAddress,
          city: locationCity,
        },
        maxParticipants: maxParticipants || undefined,
        registrationRequired: registrationRequired === 'on',
        registrationDeadline: registrationDeadline || undefined,
        price: price || 0,
        isPublic: isPublic === 'on',
        isFeatured: isFeatured === 'on',
        createdBy: req.session.user.id,
      });

      if (req.file) {
        event.featuredImage = '/uploads/events/' + req.file.filename;
      }

      await event.save();

      req.session.successMessage = 'Événement créé avec succès.';
      res.redirect('/admin/evenements');
    } catch (error) {
      console.error('Erreur création événement:', error);
      req.session.errorMessage = 'Une erreur est survenue.';
      res.redirect('/admin/evenements/nouveau');
    }
  }
);

// ==================== RÉSULTATS ====================
router.get('/resultats', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const total = await Result.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const results = await Result.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.render('admin/resultats/index', {
      title: 'Gestion des résultats',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      results,
      currentPage: page,
      totalPages,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });

    // Clear messages
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur liste résultats:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

router.get('/resultats/nouveau', async (req, res) => {
  try {
    const athletes = await User.find({ membershipStatus: 'active' })
      .sort({ lastName: 1 });

    res.render('admin/resultats/form', {
      title: 'Nouveau résultat',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      result: null,
      athletes,
      currentPath: req.path,
      isAuthenticated: req.session.user ? true : false,
      user: req.session.user || {},
      isAdmin: req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'moderator'),
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// ==================== GALERIE ====================
router.get('/galerie', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const total = await Gallery.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const galleries = await Gallery.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.render('admin/galerie/index', {
      title: 'Gestion de la galerie',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      galleries,
      currentPage: page,
      totalPages,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });

    // Clear messages
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur liste galeries:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Formulaire nouvel album
router.get('/galerie/nouveau', async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: -1 });

    res.render('admin/galerie/form', {
      title: 'Nouvel album',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      currentPage: 'galerie',
      gallery: null,
      events,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });

    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur formulaire nouvel album:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Créer un nouvel album
router.post('/galerie/nouveau', upload.array('images', 20), async (req, res) => {
  try {
    const { title, description, type, event, isPublic, isFeatured, tags } = req.body;

    // Préparer les items (images)
    const items = req.files ? req.files.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      thumbnail: `/uploads/${file.filename}`,
      caption: req.body[`caption_${index}`] || '',
      order: index,
    })) : [];

    const gallery = new Gallery({
      title,
      description,
      type,
      items,
      event: event || null,
      isPublic: isPublic === 'on',
      isFeatured: isFeatured === 'on',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      createdBy: req.session.user._id,
    });

    await gallery.save();

    req.session.successMessage = 'Album créé avec succès';
    res.redirect('/admin/galerie');
  } catch (error) {
    console.error('Erreur création album:', error);
    req.session.errorMessage = 'Erreur lors de la création de l\'album';
    res.redirect('/admin/galerie/nouveau');
  }
});

// Formulaire modifier album
router.get('/galerie/:id/modifier', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    const events = await Event.find().sort({ startDate: -1 });

    if (!gallery) {
      req.session.errorMessage = 'Album non trouvé';
      return res.redirect('/admin/galerie');
    }

    res.render('admin/galerie/form', {
      title: 'Modifier l\'album',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      currentPage: 'galerie',
      gallery,
      events,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });

    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur formulaire modifier album:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Mettre à jour un album
router.post('/galerie/:id/modifier', upload.array('images', 20), async (req, res) => {
  try {
    const { title, description, type, event, isPublic, isFeatured, tags } = req.body;
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      req.session.errorMessage = 'Album non trouvé';
      return res.redirect('/admin/galerie');
    }

    // Ajouter nouvelles images
    if (req.files && req.files.length > 0) {
      const newItems = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        thumbnail: `/uploads/${file.filename}`,
        caption: req.body[`caption_${index}`] || '',
        order: gallery.items.length + index,
      }));
      gallery.items.push(...newItems);
    }

    gallery.title = title;
    gallery.description = description;
    gallery.type = type;
    gallery.event = event || null;
    gallery.isPublic = isPublic === 'on';
    gallery.isFeatured = isFeatured === 'on';
    gallery.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];

    await gallery.save();

    req.session.successMessage = 'Album modifié avec succès';
    res.redirect('/admin/galerie');
  } catch (error) {
    console.error('Erreur modification album:', error);
    req.session.errorMessage = 'Erreur lors de la modification de l\'album';
    res.redirect(`/admin/galerie/${req.params.id}/modifier`);
  }
});

// Supprimer un album
router.post('/galerie/:id/supprimer', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    req.session.successMessage = 'Album supprimé avec succès';
    res.redirect('/admin/galerie');
  } catch (error) {
    console.error('Erreur suppression album:', error);
    req.session.errorMessage = 'Erreur lors de la suppression de l\'album';
    res.redirect('/admin/galerie');
  }
});

// ==================== CONTACTS ====================
router.get('/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const total = await Contact.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Statistiques
    const stats = {
      total: await Contact.countDocuments(),
      new: await Contact.countDocuments({ status: 'new' }),
      read: await Contact.countDocuments({ status: 'read' }),
      replied: await Contact.countDocuments({ status: 'replied' }),
    };

    res.render('admin/contacts/index', {
      title: 'Messages de contact',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      contacts,
      stats,
      currentPage: page,
      totalPages,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });

    // Clear messages
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur liste contacts:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

router.get('/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: 'Message introuvable' });
    }

    // Marquer comme lu
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    // Retourner JSON pour l'API
    res.json(contact);
  } catch (error) {
    console.error('Erreur détail contact:', error);
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
});

// Archiver un message
router.post('/contacts/:id/archiver', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      req.session.errorMessage = 'Message introuvable.';
      return res.redirect('/admin/contacts');
    }

    contact.status = 'archived';
    await contact.save();

    req.session.successMessage = 'Message archivé avec succès.';
    res.redirect('/admin/contacts');
  } catch (error) {
    console.error('Erreur archivage contact:', error);
    req.session.errorMessage = 'Une erreur est survenue.';
    res.redirect('/admin/contacts');
  }
});

// Supprimer un message
router.post('/contacts/:id/supprimer', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    req.session.successMessage = 'Message supprimé avec succès.';
    res.redirect('/admin/contacts');
  } catch (error) {
    console.error('Erreur suppression contact:', error);
    req.session.errorMessage = 'Une erreur est survenue.';
    res.redirect('/admin/contacts');
  }
});

// ==================== ROUTES CRUD MANQUANTES ====================

// Formulaire nouveau membre
router.get('/membres/nouveau', async (req, res) => {
  try {
    res.render('admin/membres/edit', {
      title: 'Nouveau membre',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      member: {},
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });

    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Formulaire modification membre
router.get('/membres/:id/modifier', async (req, res) => {
  try {
    const member = await User.findById(req.params.id);

    if (!member) {
      req.session.errorMessage = 'Membre introuvable.';
      return res.redirect('/admin/membres');
    }

    res.render('admin/membres/edit', {
      title: 'Modifier le membre',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      member,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });

    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Supprimer un membre
router.post('/membres/:id/supprimer', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    req.session.successMessage = 'Membre supprimé avec succès.';
    res.redirect('/admin/membres');
  } catch (error) {
    console.error('Erreur suppression membre:', error);
    req.session.errorMessage = 'Une erreur est survenue.';
    res.redirect('/admin/membres');
  }
});

// Formulaire nouvel article
router.get('/articles/nouveau', async (req, res) => {
  try {
    res.render('admin/articles/edit', {
      title: 'Nouvel article',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      article: {},
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
      currentPath: req.path,
      isAuthenticated: req.session.user ? true : false,
      user: req.session.user || {},
      isAdmin: req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'moderator'),
    });

    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Formulaire modification article
router.get('/articles/:id/modifier', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      req.session.errorMessage = 'Article introuvable.';
      return res.redirect('/admin/articles');
    }

    res.render('admin/articles/edit', {
      title: 'Modifier l\'article',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      article,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
      currentPath: req.path,
      isAuthenticated: req.session.user ? true : false,
      user: req.session.user || {},
      isAdmin: req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'moderator'),
    });

    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Supprimer un article
router.post('/articles/:id/supprimer', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);

    req.session.successMessage = 'Article supprimé avec succès.';
    res.redirect('/admin/articles');
  } catch (error) {
    console.error('Erreur suppression article:', error);
    req.session.errorMessage = 'Une erreur est survenue.';
    res.redirect('/admin/articles');
  }
});

// Formulaire nouvel événement
router.get('/evenements/nouveau', async (req, res) => {
  try {
    res.render('admin/evenements/edit', {
      title: 'Nouvel événement',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      event: {},
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
      currentPath: req.path,
      isAuthenticated: req.session.user ? true : false,
      user: req.session.user || {},
      isAdmin: req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'moderator'),
    });

    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Formulaire modification événement
router.get('/evenements/:id/modifier', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      req.session.errorMessage = 'Événement introuvable.';
      return res.redirect('/admin/evenements');
    }

    res.render('admin/evenements/edit', {
      title: 'Modifier l\'événement',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      event,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
      currentPath: req.path,
      isAuthenticated: req.session.user ? true : false,
      user: req.session.user || {},
      isAdmin: req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'moderator'),
    });

    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Supprimer un événement
router.post('/evenements/:id/supprimer', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    req.session.successMessage = 'Événement supprimé avec succès.';
    res.redirect('/admin/evenements');
  } catch (error) {
    console.error('Erreur suppression événement:', error);
    req.session.errorMessage = 'Une erreur est survenue.';
    res.redirect('/admin/evenements');
  }
});

// Supprimer un résultat
router.post('/resultats/:id/supprimer', async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);

    req.session.successMessage = 'Résultat supprimé avec succès.';
    res.redirect('/admin/resultats');
  } catch (error) {
    console.error('Erreur suppression résultat:', error);
    req.session.errorMessage = 'Une erreur est survenue.';
    res.redirect('/admin/resultats');
  }
});

// Supprimer une galerie
router.post('/galerie/:id/supprimer', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);

    req.session.successMessage = 'Album supprimé avec succès.';
    res.redirect('/admin/galerie');
  } catch (error) {
    console.error('Erreur suppression galerie:', error);
    req.session.errorMessage = 'Une erreur est survenue.';
    res.redirect('/admin/galerie');
  }
});

module.exports = router;
