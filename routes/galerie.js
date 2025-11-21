const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');

// Liste des galeries
router.get('/', async (req, res) => {
  try {
    const type = req.query.type; // photo ou video

    const filter = { isPublic: true };
    if (type) {
      filter.type = type;
    }

    const galleries = await Gallery.find(filter)
      .sort({ date: -1 })
      .limit(24);

    res.render('galerie/index', {
      title: 'Galerie',
      galleries,
      currentType: type || 'all',
    });
  } catch (error) {
    console.error('Erreur galerie:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

// Détail d'une galerie
router.get('/:slug', async (req, res) => {
  try {
    const gallery = await Gallery.findOne({
      slug: req.params.slug,
      isPublic: true,
    }).populate('event', 'title slug startDate');

    if (!gallery) {
      return res.status(404).render('errors/404', {
        title: 'Galerie introuvable',
        message: 'Cette galerie n\'existe pas.',
      });
    }

    // Incrémenter les vues
    gallery.views += 1;
    await gallery.save();

    res.render('galerie/detail', {
      title: gallery.title,
      gallery,
    });
  } catch (error) {
    console.error('Erreur détail galerie:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

module.exports = router;
