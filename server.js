require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/asc-zone-de-tir')
.then(() => console.log('✅ MongoDB connecté avec succès'))
.catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Middlewares de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://www.googletagmanager.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://player.vimeo.com", "https://www.google.com"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || 100),
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
});
app.use('/api/', limiter);

// Middlewares généraux
app.use(compression());
app.use(morgan(isDev ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Configuration du moteur de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'votre_secret_super_securise',
  name: process.env.SESSION_NAME || 'asc_session',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/asc-zone-de-tir',
    touchAfter: 24 * 3600,
  }),
  proxy: process.env.NODE_ENV === 'production', // Trust Render's proxy
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE || 86400000),
    sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
  },
}));

// Variables locales pour les vues
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!req.session.user;
  res.locals.isAdmin = req.session.user?.role === 'admin';
  res.locals.siteName = process.env.SITE_NAME || 'ASC Zone de Tir';
  res.locals.baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  res.locals.currentPath = req.path;
  res.locals.successMessage = req.session.successMessage;
  res.locals.errorMessage = req.session.errorMessage;
  delete req.session.successMessage;
  delete req.session.errorMessage;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/actualites', require('./routes/actualites'));
app.use('/evenements', require('./routes/evenements'));
app.use('/resultats', require('./routes/resultats'));
app.use('/galerie', require('./routes/galerie'));
app.use('/contact', require('./routes/contact'));
app.use('/membre', require('./routes/membre'));
app.use('/admin', require('./routes/admin'));

// Gestion 404
app.use((req, res) => {
  res.status(404).render('errors/404', {
    title: 'Page non trouvée',
    message: 'La page que vous recherchez n\'existe pas.',
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.stack);

  if (isDev) {
    res.status(err.status || 500).render('errors/500', {
      title: 'Erreur serveur',
      message: err.message,
      error: err,
    });
  } else {
    res.status(err.status || 500).render('errors/500', {
      title: 'Erreur serveur',
      message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
      error: {},
    });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
