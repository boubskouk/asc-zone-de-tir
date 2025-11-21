const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');

// Page d'accueil
router.get('/', async (req, res) => {
  try {
    // Récupérer les derniers articles publiés
    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(6)
      .populate('author', 'firstName lastName');

    // Récupérer les prochains événements
    const events = await Event.find({
      status: 'upcoming',
      startDate: { $gte: new Date() },
      isPublic: true,
    })
      .sort({ startDate: 1 })
      .limit(5);

    // Articles en vedette
    const featuredArticles = await Article.find({
      status: 'published',
      isFeatured: true,
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .populate('author', 'firstName lastName');

    // Galeries en vedette
    const featuredGalleries = await Gallery.find({
      isPublic: true,
      isFeatured: true,
    })
      .sort({ date: -1 })
      .limit(3);

    res.render('index', {
      title: 'Accueil',
      articles,
      events,
      featuredArticles,
      featuredGalleries,
    });
  } catch (error) {
    console.error('Erreur page d\'accueil:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

// Page À propos
router.get('/a-propos', (req, res) => {
  res.render('pages/about', {
    title: 'À propos de l\'ASC Zone de Tir',
  });
});

// Page Qui sommes-nous
router.get('/qui-sommes-nous', (req, res) => {
  res.render('pages/who-we-are', {
    title: 'Qui sommes-nous ?',
  });
});

// Page Nos activités
router.get('/activites', (req, res) => {
  res.render('pages/activities', {
    title: 'Nos activités',
  });
});

// Page Adhérer
router.get('/adherer', (req, res) => {
  res.render('pages/join', {
    title: 'Nous rejoindre',
  });
});

// Page Partenaires
router.get('/partenaires', (req, res) => {
  res.render('pages/partners', {
    title: 'Nos partenaires',
  });
});

// Recherche globale
router.get('/recherche', async (req, res) => {
  try {
    const query = req.query.q || '';

    if (!query) {
      return res.render('pages/search', {
        title: 'Recherche',
        query: '',
        results: { articles: [], events: [] },
      });
    }

    // Recherche dans les articles
    const articles = await Article.find({
      status: 'published',
      $text: { $search: query },
    })
      .limit(10)
      .populate('author', 'firstName lastName');

    // Recherche dans les événements
    const events = await Event.find({
      isPublic: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    })
      .limit(10);

    res.render('pages/search', {
      title: `Recherche: ${query}`,
      query,
      results: { articles, events },
    });
  } catch (error) {
    console.error('Erreur recherche:', error);
    res.render('pages/search', {
      title: 'Recherche',
      query: req.query.q || '',
      results: { articles: [], events: [] },
    });
  }
});

// Mentions légales
router.get('/mentions-legales', (req, res) => {
  res.render('pages/legal', {
    title: 'Mentions légales',
  });
});

// Politique de confidentialité
router.get('/confidentialite', (req, res) => {
  res.render('pages/privacy', {
    title: 'Politique de confidentialité',
  });
});

module.exports = router;
