const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

// Liste des résultats
router.get('/', async (req, res) => {
  try {
    const discipline = req.query.discipline;
    const year = req.query.annee;

    // Construire le filtre
    const filter = {};
    if (discipline) {
      filter.discipline = discipline;
    }
    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      filter['competition.date'] = { $gte: startDate, $lte: endDate };
    }

    // Récupérer les résultats
    const results = await Result.find(filter)
      .sort({ 'competition.date': -1 })
      .populate('rankings.athlete', 'firstName lastName profilePhoto')
      .limit(50);

    // Récupérer les disciplines disponibles
    const disciplines = await Result.distinct('discipline');

    // Récupérer les années disponibles
    const years = await Result.aggregate([
      {
        $group: {
          _id: { $year: '$competition.date' },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.render('resultats/index', {
      title: 'Résultats',
      results,
      disciplines,
      years: years.map(y => y._id),
      currentDiscipline: discipline || 'all',
      currentYear: year || 'all',
    });
  } catch (error) {
    console.error('Erreur résultats:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

// Détail d'un résultat
router.get('/:id', async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('rankings.athlete', 'firstName lastName profilePhoto')
      .populate('records.athlete', 'firstName lastName');

    if (!result) {
      return res.status(404).render('errors/404', {
        title: 'Résultat introuvable',
        message: 'Ce résultat n\'existe pas.',
      });
    }

    res.render('resultats/detail', {
      title: result.competition.name,
      result,
    });
  } catch (error) {
    console.error('Erreur détail résultat:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

// Palmarès
router.get('/palmares/club', async (req, res) => {
  try {
    // Récupérer tous les podiums de l'association
    const results = await Result.find({
      'rankings.position': { $lte: 3 },
    })
      .sort({ 'competition.date': -1 })
      .populate('rankings.athlete', 'firstName lastName');

    res.render('resultats/palmares', {
      title: 'Palmarès du club',
      results,
    });
  } catch (error) {
    console.error('Erreur palmarès:', error);
    res.status(500).render('errors/500', {
      title: 'Erreur',
      message: 'Une erreur est survenue',
    });
  }
});

module.exports = router;
