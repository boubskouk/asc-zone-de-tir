# Site Web - ASC Zone de Tir

Site web officiel de l'Association Sportive et Culturelle Zone de Tir, développé avec Node.js, Express et MongoDB.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Structure du projet](#structure-du-projet)
- [Utilisation](#utilisation)
- [Déploiement](#déploiement)
- [Maintenance](#maintenance)
- [Contribuer](#contribuer)

## ✨ Fonctionnalités

### Front-Office (Public)
- ✅ Page d'accueil avec actualités et événements à venir
- ✅ Système d'actualités avec catégories et recherche
- ✅ Calendrier d'événements avec inscriptions en ligne
- ✅ Galerie photos et vidéos
- ✅ Résultats sportifs et palmarès
- ✅ Formulaire de contact
- ✅ Pages de présentation (Qui sommes-nous, Activités, Partenaires)

### Espace Membre
- ✅ Dashboard personnel
- ✅ Gestion du profil utilisateur
- ✅ Upload de photo de profil
- ✅ Gestion des documents (certificats médicaux)
- ✅ Inscription aux événements
- ✅ Historique des activités

### Back-Office (Administration)
- ✅ Dashboard avec statistiques
- ✅ Gestion des membres (ajout, modification, validation)
- ✅ Gestion des articles (création, modification, suppression)
- ✅ Gestion des événements
- ✅ Gestion des résultats sportifs
- ✅ Gestion de la galerie
- ✅ Gestion des messages de contact

### Sécurité
- ✅ Authentification sécurisée avec bcrypt
- ✅ Sessions avec MongoDB
- ✅ Protection CSRF
- ✅ Validation des données
- ✅ Upload sécurisé de fichiers
- ✅ Rate limiting
- ✅ Headers de sécurité (Helmet)

## 🛠 Technologies utilisées

### Backend
- **Node.js** v18+
- **Express.js** v4.18 - Framework web
- **MongoDB** v6+ - Base de données
- **Mongoose** v8 - ODM pour MongoDB

### Frontend
- **EJS** - Moteur de templates
- **Bootstrap 5.3** - Framework CSS
- **Bootstrap Icons** - Icônes
- **JavaScript ES6+** - Scripts côté client

### Sécurité & Outils
- **bcryptjs** - Hash des mots de passe
- **helmet** - Sécurité des headers HTTP
- **express-validator** - Validation des données
- **express-rate-limit** - Limitation du taux de requêtes
- **multer** - Gestion des uploads
- **nodemailer** - Envoi d'emails
- **dotenv** - Gestion des variables d'environnement

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** version 18 ou supérieure
- **MongoDB** version 6 ou supérieure (local ou Atlas)
- **npm** ou **yarn**
- Un éditeur de code (VS Code recommandé)

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/asc-zone-de-tir.git
cd asc-zone-de-tir
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

Copiez le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos paramètres :

```env
# Configuration de l'application
NODE_ENV=development
PORT=3000

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/asc-zone-de-tir

# Session
SESSION_SECRET=votre_secret_session_super_securise_a_changer
SESSION_NAME=asc_session

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=contact@asczondetir.sn
EMAIL_PASSWORD=votre_mot_de_passe_email

# URLs
BASE_URL=http://localhost:3000
```

### 4. Créer les dossiers nécessaires

```bash
mkdir -p public/uploads/profiles
mkdir -p public/uploads/articles
mkdir -p public/uploads/events
mkdir -p public/uploads/gallery
mkdir -p public/uploads/documents
mkdir -p public/images
```

## 🎯 Lancement

### Mode développement

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

### Mode production

```bash
npm start
```

## 📁 Structure du projet

```
asc-zone-de-tir/
├── models/              # Modèles Mongoose
│   ├── User.js
│   ├── Article.js
│   ├── Event.js
│   ├── Result.js
│   ├── Gallery.js
│   └── Contact.js
├── routes/              # Routes Express
│   ├── index.js
│   ├── auth.js
│   ├── actualites.js
│   ├── evenements.js
│   ├── resultats.js
│   ├── galerie.js
│   ├── contact.js
│   ├── membre.js
│   └── admin.js
├── middleware/          # Middlewares personnalisés
│   ├── auth.js
│   ├── validation.js
│   └── upload.js
├── views/               # Templates EJS
│   ├── partials/
│   ├── auth/
│   ├── membre/
│   ├── admin/
│   ├── actualites/
│   ├── evenements/
│   ├── resultats/
│   ├── galerie/
│   └── pages/
├── public/              # Fichiers statiques
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/
├── .env.example         # Variables d'environnement
├── .gitignore
├── package.json
├── server.js            # Point d'entrée
└── README.md
```

## 📖 Utilisation

### Créer un compte administrateur

1. Inscrivez-vous via `/auth/inscription`
2. Connectez-vous à MongoDB et modifiez le rôle de l'utilisateur :

```javascript
db.users.updateOne(
  { email: "admin@asczondetir.sn" },
  {
    $set: {
      role: "admin",
      membershipStatus: "active"
    }
  }
)
```

### Accéder à l'administration

Connectez-vous avec votre compte admin et accédez à `/admin/dashboard`

### Créer du contenu

1. **Articles** : `/admin/articles/nouveau`
2. **Événements** : `/admin/evenements/nouveau`
3. **Résultats** : `/admin/resultats/nouveau`
4. **Galeries** : `/admin/galerie/nouveau`

## 🌐 Déploiement

### Sur Render (Recommandé - Gratuit)

Le projet inclut un fichier `render.yaml` pour un déploiement automatique sur Render.

1. **Créer un compte sur [Render](https://render.com)**

2. **Nouveau Blueprint**
   - Cliquez sur "New +" → "Blueprint"
   - Connectez votre repository GitHub
   - Render détectera automatiquement le fichier `render.yaml`

3. **Configuration automatique**
   - Le service web sera créé automatiquement
   - La base de données MongoDB sera provisionnée
   - Les variables d'environnement seront configurées

4. **Variables d'environnement à configurer manuellement (optionnel)**
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` (pour les notifications)
   - `FACEBOOK_URL`, `INSTAGRAM_URL`, `TWITTER_URL` (réseaux sociaux)

5. **Déployer les activités**
   Une fois déployé, exécutez le script pour peupler la base de données :
   ```bash
   npm run seed:activities
   ```

6. **Créer un admin**
   Connectez-vous à votre base MongoDB via Render et exécutez :
   ```javascript
   db.users.updateOne(
     { email: "votre-email@example.com" },
     { $set: { role: "admin", membershipStatus: "active" } }
   )
   ```

### Sur un VPS (Linux)

1. **Installer Node.js et MongoDB**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb
```

2. **Cloner et configurer**

```bash
git clone https://github.com/boubskouk/asc-zone-de-tir.git
cd asc-zone-de-tir
npm install --production
```

3. **Configurer PM2**

```bash
sudo npm install -g pm2
pm2 start server.js --name asc-zone-de-tir
pm2 save
pm2 startup
```

4. **Configurer Nginx (optionnel)**

```nginx
server {
    listen 80;
    server_name asczondetir.sn www.asczondetir.sn;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **SSL avec Let's Encrypt**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d asczondetir.sn -d www.asczondetir.sn
```

### Sur MongoDB Atlas

1. Créez un cluster sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez une base de données
3. Ajoutez votre IP à la whitelist
4. Copiez la connection string dans `.env` :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/asc-zone-de-tir
```

## 🔧 Maintenance

### Sauvegardes MongoDB

```bash
# Sauvegarde
mongodump --uri="mongodb://localhost:27017/asc-zone-de-tir" --out=/backup/$(date +%Y%m%d)

# Restauration
mongorestore --uri="mongodb://localhost:27017/asc-zone-de-tir" /backup/20231201
```

### Mise à jour

```bash
git pull origin main
npm install
pm2 restart asc-zone-de-tir
```

### Logs

```bash
# Avec PM2
pm2 logs asc-zone-de-tir

# Logs MongoDB
sudo tail -f /var/log/mongodb/mongod.log
```

## 👨‍💻 Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Email : contact@asczondetir.sn
- Issues GitHub : [https://github.com/votre-repo/issues](https://github.com/votre-repo/issues)

## 🙏 Remerciements

- Bootstrap Team pour le framework CSS
- MongoDB Team pour la base de données
- Express.js Team pour le framework web
- Tous les contributeurs open-source

---

**Développé avec ❤️ pour l'ASC Zone de Tir**
