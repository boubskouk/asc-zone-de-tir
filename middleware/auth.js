// Vérifier si l'utilisateur est connecté
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  req.session.errorMessage = 'Vous devez être connecté pour accéder à cette page.';
  res.redirect('/auth/login');
};

// Vérifier si l'utilisateur est administrateur
exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.session.errorMessage = 'Accès réservé aux administrateurs.';
  res.redirect('/');
};

// Vérifier si l'utilisateur est modérateur ou admin
exports.isModerator = (req, res, next) => {
  if (req.session && req.session.user &&
      (req.session.user.role === 'admin' || req.session.user.role === 'moderator')) {
    return next();
  }
  req.session.errorMessage = 'Accès réservé aux modérateurs et administrateurs.';
  res.redirect('/');
};

// Vérifier si l'utilisateur a une cotisation valide
exports.hasValidMembership = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.membershipStatus === 'active') {
    return next();
  }
  req.session.errorMessage = 'Votre cotisation doit être à jour pour accéder à cette page.';
  res.redirect('/membre/profil');
};

// Middleware pour rediriger si déjà connecté
exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/membre/dashboard');
  }
  next();
};
