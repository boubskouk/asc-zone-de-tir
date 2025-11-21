const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les dossiers s'ils n'existent pas
const uploadDirs = [
  'public/uploads/profiles',
  'public/uploads/articles',
  'public/uploads/events',
  'public/uploads/gallery',
  'public/uploads/documents',
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let uploadPath = 'public/uploads/';

    if (file.fieldname === 'profilePhoto') {
      uploadPath += 'profiles/';
    } else if (file.fieldname === 'featuredImage') {
      uploadPath += req.path.includes('evenement') ? 'events/' : 'articles/';
    } else if (file.fieldname === 'galleryImages') {
      uploadPath += 'gallery/';
    } else if (file.fieldname === 'document') {
      uploadPath += 'documents/';
    }

    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

// Filtre pour les types de fichiers
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf|doc|docx/;

  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
                  allowedDocTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedImageTypes.test(file.mimetype) ||
                   file.mimetype === 'application/pdf' ||
                   file.mimetype === 'application/msword' ||
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers images (JPEG, PNG, GIF, WebP) et documents (PDF, DOC, DOCX) sont autorisés.'));
  }
};

// Configuration upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB par défaut
  },
  fileFilter: fileFilter,
});

// Middleware pour gérer les erreurs d'upload
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      req.session.errorMessage = 'Le fichier est trop volumineux. Taille maximale: 5MB.';
    } else {
      req.session.errorMessage = 'Erreur lors du téléchargement: ' + err.message;
    }
    return res.redirect('back');
  } else if (err) {
    req.session.errorMessage = err.message;
    return res.redirect('back');
  }
  next();
};

module.exports = {
  upload,
  handleUploadError,
};
