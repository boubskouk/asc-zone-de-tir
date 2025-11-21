const { body, validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.errorMessage = errors.array()[0].msg;
    return res.redirect(req.get('Referrer') || '/');
  }
  next();
};

// Validation pour l'inscription (simplifiée)
exports.validateRegistration = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('Le prénom est requis'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Le nom est requis'),
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 4 }).withMessage('Le mot de passe doit contenir au moins 4 caractères'),
  body('confirmPassword')
    .notEmpty().withMessage('Veuillez confirmer le mot de passe')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Les mots de passe ne correspondent pas'),
  body('phone')
    .optional(),
];

// Validation pour la connexion
exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis'),
];

// Validation pour le formulaire de contact
exports.validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('subject')
    .trim()
    .notEmpty().withMessage('Le sujet est requis'),
  body('message')
    .trim()
    .notEmpty().withMessage('Le message est requis')
    .isLength({ min: 10 }).withMessage('Le message doit contenir au moins 10 caractères'),
];

// Validation pour un article
exports.validateArticle = [
  body('title')
    .trim()
    .notEmpty().withMessage('Le titre est requis')
    .isLength({ min: 5 }).withMessage('Le titre doit contenir au moins 5 caractères'),
  body('content')
    .trim()
    .notEmpty().withMessage('Le contenu est requis')
    .isLength({ min: 50 }).withMessage('Le contenu doit contenir au moins 50 caractères'),
  body('category')
    .notEmpty().withMessage('La catégorie est requise')
    .isIn(['sport', 'culture', 'evenement', 'vie-associative'])
    .withMessage('Catégorie invalide'),
];

// Validation pour un événement
exports.validateEvent = [
  body('title')
    .trim()
    .notEmpty().withMessage('Le titre est requis'),
  body('description')
    .trim()
    .notEmpty().withMessage('La description est requise'),
  body('startDate')
    .notEmpty().withMessage('La date de début est requise')
    .isISO8601().withMessage('Date invalide')
    .custom(value => new Date(value) >= new Date())
    .withMessage('La date de début doit être dans le futur'),
  body('eventType')
    .notEmpty().withMessage('Le type d\'événement est requis')
    .isIn(['competition', 'training', 'meeting', 'cultural', 'social'])
    .withMessage('Type d\'événement invalide'),
];
