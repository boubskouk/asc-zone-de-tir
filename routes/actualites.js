const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Liste des actualités
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;
    const category = req.query.categorie;

    // Construire le filtre
    const filter = { status: 'published' };
    if (category) {
      filter.category = category;
    }

    // Compter le total
    const total = await Article.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Récupérer les articles
    const articles = await Article.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'firstName lastName');

    res.render('actualites/index', {
      title: 'Actualités',
      articles,
      currentPage: page,
      totalPages,
      category: category || 'all',
    });
  } catch (error) {
    console.error('Erreur actualités:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

// Détail d'une actualité
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      status: 'published',
    }).populate('author', 'firstName lastName profilePhoto');

    if (!article) {
      return res.status(404).render('errors/404', {
        title: 'Article introuvable',
        message: 'Cet article n\'existe pas.',
      });
    }

    // Incrémenter le compteur de vues
    article.views += 1;
    await article.save();

    // Articles similaires
    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      category: article.category,
      status: 'published',
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .populate('author', 'firstName lastName');

    res.render('actualites/detail', {
      title: article.title,
      article,
      relatedArticles,
    });
  } catch (error) {
    console.error('Erreur détail actualité:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

module.exports = router;
