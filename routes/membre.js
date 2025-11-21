const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const { isAuthenticated } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

// Toutes les routes nécessitent une authentification
router.use(isAuthenticated);

// Dashboard membre
router.get('/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);

    // Récupérer les événements auxquels l'utilisateur est inscrit
    const myEvents = await Event.find({
      'participants.user': user._id,
      startDate: { $gte: new Date() },
    }).sort({ startDate: 1 }).limit(5);

    res.render('membre/dashboard', {
      title: 'Mon espace',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      user,
      myEvents,
      isAdmin: user.role === 'admin' || user.role === 'moderator',
    });
  } catch (error) {
    console.error('Erreur dashboard:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Profil
router.get('/profil', async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);

    res.render('membre/profile', {
      title: 'Mon profil',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      user,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });

    // Clear messages
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur profil:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Mise à jour du profil
router.post('/profil', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      street,
      city,
      postalCode,
      emergencyName,
      emergencyPhone,
      emergencyRelationship,
    } = req.body;

    const user = await User.findById(req.session.user.id);

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.dateOfBirth = dateOfBirth || undefined;
    user.address = {
      street,
      city,
      postalCode,
      country: 'Sénégal',
    };
    user.emergencyContact = {
      name: emergencyName,
      phone: emergencyPhone,
      relationship: emergencyRelationship,
    };

    await user.save();

    // Mettre à jour la session
    req.session.user.firstName = user.firstName;
    req.session.user.lastName = user.lastName;

    req.session.successMessage = 'Profil mis à jour avec succès.';
    res.redirect('/membre/profil');
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    req.session.errorMessage = 'Une erreur est survenue lors de la mise à jour.';
    res.redirect('/membre/profil');
  }
});

// Upload photo de profil
router.post(
  '/profil/photo',
  upload.single('profilePhoto'),
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.file) {
        req.session.errorMessage = 'Aucun fichier sélectionné.';
        return res.redirect('/membre/profil');
      }

      const user = await User.findById(req.session.user.id);
      user.profilePhoto = '/uploads/profiles/' + req.file.filename;
      await user.save();

      // Mettre à jour la session
      req.session.user.profilePhoto = user.profilePhoto;

      req.session.successMessage = 'Photo de profil mise à jour.';
      res.redirect('/membre/profil');
    } catch (error) {
      console.error('Erreur upload photo:', error);
      req.session.errorMessage = 'Une erreur est survenue lors de l\'upload.';
      res.redirect('/membre/profil');
    }
  }
);

// Mes événements
router.get('/evenements', async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);

    // Événements à venir
    const upcomingEvents = await Event.find({
      'participants.user': user._id,
      startDate: { $gte: new Date() },
    })
      .sort({ startDate: 1 })
      .populate('participants.user', 'firstName lastName');

    // Événements passés
    const pastEvents = await Event.find({
      'participants.user': user._id,
      startDate: { $lt: new Date() },
    })
      .sort({ startDate: -1 })
      .limit(10)
      .populate('participants.user', 'firstName lastName');

    res.render('membre/evenements', {
      title: 'Mes événements',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      user,
      upcomingEvents,
      pastEvents,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });

    // Clear messages
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur mes événements:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Documents
router.get('/documents', async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);

    res.render('membre/documents', {
      title: 'Mes documents',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      user,
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
    });

    // Clear messages
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error('Erreur documents:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      siteName: process.env.SITE_NAME || 'ASC Zone de Tir',
      message: 'Une erreur est survenue',
    });
  }
});

// Upload document
router.post(
  '/documents/upload',
  upload.single('document'),
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.file) {
        req.session.errorMessage = 'Aucun fichier sélectionné.';
        return res.redirect('/membre/documents');
      }

      const { documentType, description } = req.body;
      const user = await User.findById(req.session.user.id);

      // Initialiser le tableau documents s'il n'existe pas
      if (!user.documents) {
        user.documents = [];
      }

      user.documents.push({
        type: documentType,
        url: '/uploads/documents/' + req.file.filename,
        description: description || '',
        uploadedAt: new Date(),
        verified: false,
      });

      await user.save();

      req.session.successMessage = 'Document ajouté avec succès.';
      res.redirect('/membre/documents');
    } catch (error) {
      console.error('Erreur upload document:', error);
      req.session.errorMessage = 'Une erreur est survenue lors de l\'upload.';
      res.redirect('/membre/documents');
    }
  }
);

// Supprimer un document
router.post('/documents/:id/supprimer', async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);

    if (!user.documents) {
      req.session.errorMessage = 'Document non trouvé.';
      return res.redirect('/membre/documents');
    }

    // Trouver et supprimer le document
    user.documents = user.documents.filter(
      doc => doc._id.toString() !== req.params.id
    );

    await user.save();

    req.session.successMessage = 'Document supprimé avec succès.';
    res.redirect('/membre/documents');
  } catch (error) {
    console.error('Erreur suppression document:', error);
    req.session.errorMessage = 'Une erreur est survenue.';
    res.redirect('/membre/documents');
  }
});

module.exports = router;
