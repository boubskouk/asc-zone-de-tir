# Guide d'Installation - ASC Zone de Tir

Ce guide vous accompagne étape par étape dans l'installation du site web de l'ASC Zone de Tir.

## 📋 Sommaire

1. [Installation locale (Windows)](#installation-locale-windows)
2. [Installation locale (Mac/Linux)](#installation-locale-maclinux)
3. [Configuration de la base de données](#configuration-de-la-base-de-données)
4. [Premier compte administrateur](#premier-compte-administrateur)
5. [Résolution de problèmes](#résolution-de-problèmes)

---

## Installation locale (Windows)

### Étape 1 : Installer les prérequis

#### Node.js
1. Téléchargez Node.js depuis [nodejs.org](https://nodejs.org/)
2. Installez la version LTS (18.x ou supérieure)
3. Vérifiez l'installation :
```bash
node --version
npm --version
```

#### MongoDB
1. Téléchargez MongoDB Community Server depuis [mongodb.com](https://www.mongodb.com/try/download/community)
2. Installez avec les options par défaut
3. Vérifiez que MongoDB est démarré :
```bash
mongod --version
```

### Étape 2 : Cloner le projet

```bash
cd "E:\site et apps"
# Si vous avez Git installé
git clone https://github.com/votre-repo/asc-zone-de-tir.git

# Ou décompressez l'archive ZIP dans ce dossier
cd "asc zone de tir"
```

### Étape 3 : Installer les dépendances

```bash
npm install
```

⏱️ Cette étape peut prendre 2-5 minutes selon votre connexion internet.

### Étape 4 : Configurer l'environnement

1. Copiez le fichier `.env.example` :
```bash
copy .env.example .env
```

2. Ouvrez `.env` avec un éditeur de texte et modifiez :
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/asc-zone-de-tir
SESSION_SECRET=ChangezCeSecretParQuelqueChoseDeTresSecurise123456
```

### Étape 5 : Créer les dossiers nécessaires

```bash
mkdir public\uploads\profiles
mkdir public\uploads\articles
mkdir public\uploads\events
mkdir public\uploads\gallery
mkdir public\uploads\documents
mkdir public\images
```

### Étape 6 : Démarrer l'application

```bash
npm run dev
```

✅ Le site est maintenant accessible sur **http://localhost:3000**

---

## Installation locale (Mac/Linux)

### Étape 1 : Installer les prérequis

#### Node.js (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Node.js (macOS avec Homebrew)
```bash
brew install node
```

#### MongoDB (Ubuntu/Debian)
```bash
# Import de la clé publique
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Ajout du repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Installation
sudo apt-get update
sudo apt-get install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### MongoDB (macOS avec Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

### Étape 2 : Cloner et configurer

```bash
cd ~
git clone https://github.com/votre-repo/asc-zone-de-tir.git
cd asc-zone-de-tir

# Installer les dépendances
npm install

# Copier le fichier de configuration
cp .env.example .env

# Éditer la configuration
nano .env  # ou vim .env
```

### Étape 3 : Créer les dossiers

```bash
mkdir -p public/uploads/{profiles,articles,events,gallery,documents}
mkdir -p public/images
```

### Étape 4 : Lancer l'application

```bash
npm run dev
```

---

## Configuration de la base de données

### Vérifier la connexion MongoDB

1. Ouvrez un terminal et tapez :
```bash
mongosh
```

2. Listez les bases de données :
```javascript
show dbs
```

3. Utilisez la base de données du projet :
```javascript
use asc-zone-de-tir
```

### MongoDB Atlas (Cloud)

Si vous préférez utiliser MongoDB dans le cloud :

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit
3. Créez un utilisateur de base de données
4. Ajoutez votre IP à la whitelist (ou 0.0.0.0/0 pour tout autoriser en dev)
5. Récupérez la connection string :
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/asc-zone-de-tir
```
6. Mettez à jour le `.env` :
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/asc-zone-de-tir
```

---

## Premier compte administrateur

### Méthode 1 : Via l'interface web

1. Allez sur http://localhost:3000/auth/inscription
2. Créez un compte avec vos informations :
   - Prénom : Admin
   - Nom : ASC
   - Email : admin@asczondetir.sn
   - Mot de passe : (choisissez un mot de passe fort)

3. Ouvrez MongoDB Shell :
```bash
mongosh
```

4. Exécutez les commandes :
```javascript
use asc-zone-de-tir

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

5. Déconnectez-vous et reconnectez-vous
6. Vous avez maintenant accès à `/admin/dashboard`

### Méthode 2 : Script direct

Créez un fichier `create-admin.js` :

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connecté à MongoDB');

    const admin = new User({
      firstName: 'Admin',
      lastName: 'ASC',
      email: 'admin@asczondetir.sn',
      password: 'Admin123!',
      role: 'admin',
      membershipStatus: 'active',
      phone: '+221123456789'
    });

    await admin.save();
    console.log('✅ Compte administrateur créé !');
    console.log('Email: admin@asczondetir.sn');
    console.log('Mot de passe: Admin123!');
    console.log('⚠️ CHANGEZ CE MOT DE PASSE IMMÉDIATEMENT !');

    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
  });
```

Exécutez :
```bash
node create-admin.js
```

---

## Résolution de problèmes

### Erreur : "Cannot find module"

**Solution :**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "MongoNetworkError: connect ECONNREFUSED"

**Cause :** MongoDB n'est pas démarré

**Solution Windows :**
1. Ouvrez les Services (services.msc)
2. Cherchez "MongoDB Server"
3. Démarrez le service

**Solution Linux/Mac :**
```bash
sudo systemctl start mongod
# ou
brew services start mongodb-community
```

### Erreur : "Port 3000 is already in use"

**Solution :**

Changez le port dans `.env` :
```env
PORT=3001
```

Ou tuez le processus utilisant le port :
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Les images ne s'affichent pas

**Solution :**

Vérifiez que les dossiers uploads existent :
```bash
ls -la public/uploads
```

Si absents, créez-les :
```bash
mkdir -p public/uploads/{profiles,articles,events,gallery,documents}
```

### Erreur : "Session store unavailable"

**Cause :** MongoDB n'est pas accessible

**Solution :**

1. Vérifiez que MongoDB est démarré
2. Vérifiez la connection string dans `.env`
3. Testez la connexion :
```bash
mongosh "mongodb://localhost:27017/asc-zone-de-tir"
```

### Les emails ne s'envoient pas

**Solution temporaire :**

Commentez les parties email dans le code (TODO marqués)

**Solution permanente :**

Configurez un service SMTP dans `.env` :
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-application
```

Pour Gmail, créez un [mot de passe d'application](https://support.google.com/accounts/answer/185833).

---

## Prochaines étapes

Une fois l'installation terminée :

1. ✅ Connectez-vous en tant qu'admin
2. ✅ Explorez le tableau de bord `/admin/dashboard`
3. ✅ Créez votre premier article
4. ✅ Ajoutez un événement
5. ✅ Personnalisez les pages statiques

## Besoin d'aide ?

- 📧 Email : contact@asczondetir.sn
- 📖 Documentation : voir README.md
- 🐛 Issues GitHub : [Créer une issue](https://github.com/votre-repo/issues)

---

**Bonne installation ! 🚀**
