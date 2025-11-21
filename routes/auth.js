const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { redirectIfAuthenticated } = require('../middleware/auth');
const { validateRegistration, validateLogin, handleValidationErrors } = require('../middleware/validation');

// Page de connexion
router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('auth/login', {
    title: 'Connexion',
  });
});

// Traitement de la connexion
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      req.session.errorMessage = 'Email ou mot de passe incorrect.';
      return res.redirect('/auth/login');
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.session.errorMessage = 'Email ou mot de passe incorrect.';
      return res.redirect('/auth/login');
    }

    // Créer la session
    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      membershipStatus: user.membershipStatus,
      profilePhoto: user.profilePhoto,
    };

    // Mettre à jour le dernier login
    user.lastLogin = new Date();
    await user.save();

    req.session.successMessage = `Bienvenue ${user.firstName} !`;

    // Rediriger vers la page demandée ou le dashboard
    const returnTo = req.session.returnTo || '/membre/dashboard';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (error) {
    console.error('Erreur connexion:', error);
    req.session.errorMessage = 'Une erreur est survenue lors de la connexion.';
    res.redirect('/auth/login');
  }
});

// Page d'inscription
router.get('/inscription', redirectIfAuthenticated, (req, res) => {
  res.render('auth/register', {
    title: 'Inscription',
  });
});

// Traitement de l'inscription
router.post('/inscription', validateRegistration, handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, dateOfBirth } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.session.errorMessage = 'Cet email est déjà utilisé.';
      return res.redirect('/auth/inscription');
    }

    // Créer le nouvel utilisateur
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth: dateOfBirth || undefined,
      membershipStatus: 'pending',
    });

    await user.save();

    req.session.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Erreur inscription:', error);
    req.session.errorMessage = 'Une erreur est survenue lors de l\'inscription.';
    res.redirect('/auth/inscription');
  }
});

// Déconnexion
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erreur déconnexion:', err);
    }
    res.redirect('/');
  });
});

// Mot de passe oublié - Page
router.get('/mot-de-passe-oublie', redirectIfAuthenticated, (req, res) => {
  res.render('auth/forgot-password', {
    title: 'Mot de passe oublié',
  });
});

// Mot de passe oublié - Traitement
router.post('/mot-de-passe-oublie', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      req.session.successMessage = 'Si cet email existe, un lien de réinitialisation a été envoyé.';
      return res.redirect('/auth/login');
    }

    // TODO: Implémenter l'envoi d'email avec nodemailer
    // Générer un token et l'envoyer par email

    req.session.successMessage = 'Un email de réinitialisation a été envoyé.';
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Erreur mot de passe oublié:', error);
    req.session.errorMessage = 'Une erreur est survenue.';
    res.redirect('/auth/mot-de-passe-oublie');
  }
});

module.exports = router;
