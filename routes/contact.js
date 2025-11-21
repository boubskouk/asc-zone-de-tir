const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { validateContact, handleValidationErrors } = require('../middleware/validation');

// Page de contact
router.get('/', (req, res) => {
  res.render('contact/index', {
    title: 'Contact',
  });
});

// Traitement du formulaire
router.post('/', validateContact, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await contact.save();

    // TODO: Envoyer une notification email aux administrateurs

    req.session.successMessage = 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.';
    res.redirect('/contact');
  } catch (error) {
    console.error('Erreur contact:', error);
    req.session.errorMessage = 'Une erreur est survenue lors de l\'envoi du message.';
    res.redirect('/contact');
  }
});

module.exports = router;
