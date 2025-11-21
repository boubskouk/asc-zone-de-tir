# 🚀 COMMENCER ICI - ASC Zone de Tir

**Bienvenue !** Ce fichier vous guide pour démarrer rapidement avec le site web de l'ASC Zone de Tir.

---

## 📁 Fichiers importants

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **📖 QUICKSTART.md** | Démarrage rapide en 5 minutes | ⭐ COMMENCEZ PAR ICI |
| **📘 README.md** | Documentation complète | Pour tout comprendre |
| **📗 INSTALLATION.md** | Guide d'installation détaillé | Si vous rencontrez des problèmes |
| **📕 GUIDE_UTILISATEUR.md** | Manuel d'utilisation | Pour utiliser le site |
| **📙 DEPLOYMENT.md** | Guide de déploiement | Pour mettre en production |
| **📋 CHECKLIST_LANCEMENT.md** | Vérifications avant lancement | Avant de déployer |
| **📊 RESUME_PROJET.md** | Vue d'ensemble du projet | Pour comprendre le projet |

---

## ⚡ Démarrage ultra-rapide (5 minutes)

### 1️⃣ Prérequis (installer si nécessaire)

- **Node.js** : https://nodejs.org (version 18+)
- **MongoDB** : https://www.mongodb.com/try/download/community

### 2️⃣ Installation

Ouvrez un terminal dans ce dossier et exécutez :

```bash
npm install
```

### 3️⃣ Configuration

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Ouvrez le fichier `.env` et changez au minimum :
```
SESSION_SECRET=ChangezCeciParQuelqueChoseDeTresSecurise123
```

### 4️⃣ Données de test

```bash
npm run seed
```

### 5️⃣ Démarrage

```bash
npm run dev
```

### 6️⃣ Accéder au site

Ouvrez votre navigateur : **http://localhost:3000**

---

## 🔑 Comptes de test

Une fois le site démarré, connectez-vous avec :

### 👨‍💼 Administrateur
- **Email** : admin@asczondetir.sn
- **Mot de passe** : Admin123!
- **Accès** : http://localhost:3000/admin/dashboard

### 👤 Membre
- **Email** : amadou.diallo@example.com
- **Mot de passe** : Member123!
- **Accès** : http://localhost:3000/membre/dashboard

---

## 📍 Pages principales

| Page | URL | Description |
|------|-----|-------------|
| 🏠 Accueil | `/` | Page d'accueil |
| 📰 Actualités | `/actualites` | Articles et news |
| 📅 Événements | `/evenements` | Calendrier |
| 🏆 Résultats | `/resultats` | Résultats sportifs |
| 🖼️ Galerie | `/galerie` | Photos et vidéos |
| 📧 Contact | `/contact` | Formulaire de contact |
| 🔐 Connexion | `/auth/login` | Se connecter |
| ⚙️ Admin | `/admin/dashboard` | Administration |

---

## 🎯 Que faire ensuite ?

### 🔰 Débutant - Découverte
1. ✅ Démarrez l'application (voir ci-dessus)
2. ✅ Naviguez sur le site (http://localhost:3000)
3. ✅ Connectez-vous en tant qu'admin
4. ✅ Créez votre premier article
5. ✅ Explorez le tableau de bord admin
6. 📖 Lisez **GUIDE_UTILISATEUR.md** pour en savoir plus

### 🔧 Intermédiaire - Configuration
1. ✅ Personnalisez le fichier `.env`
2. ✅ Configurez l'email SMTP
3. ✅ Ajoutez votre logo dans `public/images/`
4. ✅ Modifiez les couleurs dans `public/css/style.css`
5. ✅ Créez votre contenu (articles, événements)
6. 📖 Lisez **README.md** pour la documentation complète

### 🚀 Avancé - Déploiement
1. ✅ Vérifiez **CHECKLIST_LANCEMENT.md**
2. ✅ Configurez votre serveur de production
3. ✅ Suivez **DEPLOYMENT.md**
4. ✅ Activez HTTPS
5. ✅ Configurez les sauvegardes
6. ✅ Lancez en production !

---

## 📂 Structure des dossiers

```
asc-zone-de-tir/
│
├── 📄 Documentation (LISEZ-MOI!)
│   ├── COMMENCER_ICI.md      ← Vous êtes ici
│   ├── QUICKSTART.md          ← Démarrage rapide
│   ├── README.md              ← Documentation complète
│   ├── INSTALLATION.md        ← Guide d'installation
│   ├── GUIDE_UTILISATEUR.md   ← Manuel utilisateur
│   ├── DEPLOYMENT.md          ← Guide de déploiement
│   └── CHECKLIST_LANCEMENT.md ← Avant de lancer
│
├── 💻 Code source
│   ├── models/                ← Base de données (MongoDB)
│   ├── routes/                ← Routes de l'application
│   ├── views/                 ← Interface utilisateur (HTML)
│   ├── public/                ← Fichiers publics (CSS, JS, images)
│   ├── middleware/            ← Logique intermédiaire
│   └── server.js              ← Point d'entrée
│
└── ⚙️ Configuration
    ├── package.json           ← Dépendances
    ├── .env.example           ← Template de configuration
    └── scripts/               ← Scripts utilitaires
```

---

## ❓ Problèmes courants

### 🔴 "npm install" échoue
**Solution** : Vérifiez que Node.js est installé (`node --version`)

### 🔴 "MongoDB connection error"
**Solutions** :
1. Vérifiez que MongoDB est démarré
2. Windows : `net start MongoDB`
3. Linux/Mac : `sudo systemctl start mongod`

### 🔴 "Port 3000 already in use"
**Solution** : Changez le port dans `.env` :
```
PORT=3001
```

### 🔴 Les images ne s'affichent pas
**Solution** : Créez les dossiers manquants :
```bash
mkdir -p public/uploads/profiles
mkdir -p public/uploads/articles
mkdir -p public/uploads/events
mkdir -p public/uploads/gallery
mkdir -p public/uploads/documents
```

---

## 🆘 Besoin d'aide ?

### 📚 Documentation
- **Problème d'installation** → Voir **INSTALLATION.md**
- **Comment utiliser** → Voir **GUIDE_UTILISATEUR.md**
- **Déployer en production** → Voir **DEPLOYMENT.md**

### 💬 Support
- **Email** : contact@asczondetir.sn
- **Documentation** : Lisez les fichiers .md
- **Code** : Commentaires dans le code source

---

## ✅ Checklist rapide

Avant de commencer, assurez-vous d'avoir :

- [ ] Node.js installé (18+)
- [ ] MongoDB installé et démarré
- [ ] Terminal ouvert dans le dossier du projet
- [ ] Connexion internet (pour npm install)

Ensuite :

- [ ] `npm install` exécuté
- [ ] Fichier `.env` créé
- [ ] `npm run seed` exécuté (données de test)
- [ ] `npm run dev` démarré
- [ ] Site accessible sur http://localhost:3000

---

## 🎓 Apprendre

### Pour les développeurs
- **Node.js** : https://nodejs.org/docs
- **Express.js** : https://expressjs.com
- **MongoDB** : https://docs.mongodb.com
- **EJS** : https://ejs.co

### Pour les utilisateurs
- Voir **GUIDE_UTILISATEUR.md**
- Tutoriels disponibles dans la documentation
- Testez avec les comptes de démonstration

---

## 🎉 Prêt à démarrer !

**Suivez le guide de démarrage rapide ci-dessus** ⬆️

Ou lisez **QUICKSTART.md** pour des instructions encore plus détaillées.

**Bon développement ! 🚀**

---

## 📌 Notes importantes

### ⚠️ Sécurité
- Changez **TOUJOURS** le `SESSION_SECRET` en production
- Ne commitez **JAMAIS** le fichier `.env`
- Utilisez des mots de passe forts

### 💾 Sauvegardes
- Configurez des sauvegardes automatiques en production
- Testez la restauration régulièrement

### 🔄 Mises à jour
- Gardez Node.js et MongoDB à jour
- Mettez à jour les dépendances npm régulièrement
- Testez avant de déployer en production

---

**Dernière mise à jour** : 20 novembre 2024
**Version** : 1.0.0

**Développé avec ❤️ pour l'ASC Zone de Tir**
