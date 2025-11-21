const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { isAuthenticated } = require('../middleware/auth');

// Liste des événements
router.get('/', async (req, res) => {
  try {
    const type = req.query.type;
    const view = req.query.vue || 'liste'; // liste, calendrier

    // Construire le filtre
    const filter = { isPublic: true };
    if (type) {
      filter.eventType = type;
    }

    // Récupérer les événements à venir
    const upcomingEvents = await Event.find({
      ...filter,
      startDate: { $gte: new Date() },
      status: { $in: ['upcoming', 'ongoing'] },
    })
      .sort({ startDate: 1 })
      .limit(20);

    // Récupérer les événements passés
    const pastEvents = await Event.find({
      ...filter,
      status: 'completed',
    })
      .sort({ startDate: -1 })
      .limit(10);

    res.render('evenements/index', {
      title: 'Événements',
      upcomingEvents,
      pastEvents,
      currentType: type || 'all',
      view,
    });
  } catch (error) {
    console.error('Erreur événements:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

// Détail d'un événement
router.get('/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({
      slug: req.params.slug,
      isPublic: true,
    }).populate('participants.user', 'firstName lastName profilePhoto');

    if (!event) {
      return res.status(404).render('errors/404', {
        title: 'Événement introuvable',
        message: 'Cet événement n\'existe pas.',
      });
    }

    // Vérifier si l'utilisateur est inscrit
    let isRegistered = false;
    if (req.session.user) {
      isRegistered = event.participants.some(
        p => p.user && p.user._id.toString() === req.session.user.id
      );
    }

    res.render('evenements/detail', {
      title: event.title,
      event,
      isRegistered,
      canRegister: event.isRegistrationOpen(),
    });
  } catch (error) {
    console.error('Erreur détail événement:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

// Inscription à un événement
router.post('/:id/inscription', isAuthenticated, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      req.session.errorMessage = 'Événement introuvable.';
      return res.redirect('/evenements');
    }

    if (!event.isRegistrationOpen()) {
      req.session.errorMessage = 'Les inscriptions sont fermées pour cet événement.';
      return res.redirect(`/evenements/${event.slug}`);
    }

    // Vérifier si déjà inscrit
    const alreadyRegistered = event.participants.some(
      p => p.user && p.user.toString() === req.session.user.id
    );

    if (alreadyRegistered) {
      req.session.errorMessage = 'Vous êtes déjà inscrit à cet événement.';
      return res.redirect(`/evenements/${event.slug}`);
    }

    // Ajouter le participant
    event.participants.push({
      user: req.session.user.id,
      status: 'registered',
    });

    await event.save();

    req.session.successMessage = 'Inscription réussie !';
    res.redirect(`/evenements/${event.slug}`);
  } catch (error) {
    console.error('Erreur inscription événement:', error);
    req.session.errorMessage = 'Une erreur est survenue lors de l\'inscription.';
    res.redirect('back');
  }
});

// Annulation d'inscription
router.post('/:id/annulation', isAuthenticated, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      req.session.errorMessage = 'Événement introuvable.';
      return res.redirect('/evenements');
    }

    // Retirer le participant
    event.participants = event.participants.filter(
      p => !p.user || p.user.toString() !== req.session.user.id
    );

    await event.save();

    req.session.successMessage = 'Inscription annulée.';
    res.redirect(`/evenements/${event.slug}`);
  } catch (error) {
    console.error('Erreur annulation:', error);
    req.session.errorMessage = 'Une erreur est survenue.';
    res.redirect('back');
  }
});

module.exports = router;
