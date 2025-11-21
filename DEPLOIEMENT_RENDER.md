# 🚀 Déploiement sur Render - Guide Étape par Étape

Guide complet pour déployer l'application **ASC Zone de Tir** sur Render.

---

## 📋 Étape 1 : Préparer le code

### 1.1 Pousser le code sur GitHub

Votre code est déjà initialisé avec Git. Maintenant, poussez-le sur GitHub :

```bash
# Si vous n'avez pas encore créé de dépôt GitHub :
# 1. Allez sur https://github.com
# 2. Cliquez sur "New repository"
# 3. Nom : asc-zone-de-tir
# 4. Visibilité : Private (recommandé)
# 5. NE PAS initialiser avec README
# 6. Cliquez sur "Create repository"

# Ajoutez votre dépôt GitHub (remplacez YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/asc-zone-de-tir.git

# Renommer la branche en "main"
git branch -M main

# Pousser le code
git push -u origin main
```

✅ **Votre code est maintenant sur GitHub !**

---

## 🗄️ Étape 2 : Configurer MongoDB Atlas (Base de données)

Render ne fournit pas MongoDB gratuitement, donc nous utiliserons **MongoDB Atlas** (gratuit).

### 2.1 Créer un compte MongoDB Atlas

1. Allez sur : **https://www.mongodb.com/cloud/atlas/register**
2. Créez un compte (gratuit)
3. Choisissez "Build a Database"

### 2.2 Créer un cluster gratuit

1. Sélectionnez **"M0 Sandbox"** (gratuit, 512MB)
2. **Provider** : AWS
3. **Region** : Choisir **Europe (Ireland)** ou **Europe (Frankfurt)** (le plus proche du Sénégal)
4. **Cluster Name** : `asc-zone-de-tir`
5. Cliquez sur **"Create"**

⏱️ *Attendez 3-5 minutes que le cluster soit créé*

### 2.3 Configurer l'accès utilisateur

1. Dans l'onglet **"Security > Database Access"** :
   - Cliquez sur **"Add New Database User"**
   - **Authentication Method** : Password
   - **Username** : `ascadmin`
   - **Password** : Générez un mot de passe fort (NOTEZ-LE !)
   - **Database User Privileges** : Atlas Admin
   - Cliquez sur **"Add User"**

### 2.4 Autoriser l'accès depuis partout

1. Dans l'onglet **"Security > Network Access"** :
   - Cliquez sur **"Add IP Address"**
   - Cliquez sur **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Cliquez sur **"Confirm"**

### 2.5 Récupérer l'URL de connexion

1. Retournez à **"Database"**
2. Cliquez sur **"Connect"** sur votre cluster
3. Choisissez **"Connect your application"**
4. **Driver** : Node.js, **Version** : 5.5 or later
5. **Copiez l'URL de connexion** :
   ```
   mongodb+srv://ascadmin:<password>@asc-zone-de-tir.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **IMPORTANT** : Remplacez `<password>` par le mot de passe que vous avez créé
7. Ajoutez le nom de la base à la fin :
   ```
   mongodb+srv://ascadmin:VOTRE_MOT_DE_PASSE@asc-zone-de-tir.xxxxx.mongodb.net/asc-zone-de-tir?retryWrites=true&w=majority
   ```

✅ **MongoDB Atlas est configuré ! Gardez cette URL pour plus tard.**

---

## 🌐 Étape 3 : Déployer sur Render

### 3.1 Créer un compte Render

1. Allez sur : **https://render.com**
2. Cliquez sur **"Get Started"**
3. **Connectez-vous avec GitHub** (recommandé)
4. Autorisez Render à accéder à vos dépôts GitHub

### 3.2 Créer un nouveau Web Service

1. Sur le dashboard Render, cliquez sur **"New +"** > **"Web Service"**
2. Connectez votre dépôt :
   - Cliquez sur **"Connect a repository"**
   - Recherchez **"asc-zone-de-tir"**
   - Cliquez sur **"Connect"**

### 3.3 Configurer le service

Remplissez le formulaire :

**Configuration de base :**
- **Name** : `asc-zone-de-tir`
- **Region** : **Frankfurt (EU Central)** (le plus proche)
- **Branch** : `main`
- **Root Directory** : (laissez vide)
- **Runtime** : **Node**
- **Build Command** : `npm install`
- **Start Command** : `npm start`

**Plan :**
- Choisissez **"Free"** (gratuit) ou **"Starter"** (7$/mois pour plus de performances)

### 3.4 Configurer les variables d'environnement

Avant de cliquer sur "Create Web Service", descendez jusqu'à **"Environment Variables"** et ajoutez :

| KEY | VALUE |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://ascadmin:VOTRE_MOT_DE_PASSE@asc-zone-de-tir.xxxxx.mongodb.net/asc-zone-de-tir?retryWrites=true&w=majority` |
| `SESSION_SECRET` | Générez une valeur aléatoire (voir ci-dessous) |
| `SITE_NAME` | `ASC Zone de Tir` |
| `BCRYPT_ROUNDS` | `12` |
| `RATE_LIMIT_WINDOW` | `15` |
| `RATE_LIMIT_MAX` | `100` |

**Pour générer SESSION_SECRET :**
```bash
# Sur votre machine locale
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copiez le résultat et utilisez-le comme valeur pour `SESSION_SECRET`.

**⚠️ IMPORTANT** : Remplacez `VOTRE_MOT_DE_PASSE` dans `MONGODB_URI` par votre vrai mot de passe MongoDB Atlas !

### 3.5 Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va automatiquement :
   - Cloner votre code
   - Exécuter `npm install`
   - Démarrer l'application avec `npm start`

⏱️ *Le déploiement prend environ 2-5 minutes*

### 3.6 Vérifier le déploiement

1. Regardez les logs en temps réel dans l'interface Render
2. Attendez que vous voyiez :
   ```
   🚀 Serveur démarré sur http://localhost:3000
   ✅ MongoDB connecté avec succès
   ```
3. Une fois **"Live"** affiché, cliquez sur l'URL de votre application (quelque chose comme `https://asc-zone-de-tir.onrender.com`)

✅ **Votre application est en ligne !**

---

## 🎨 Étape 4 : Peupler la base de données

Maintenant que l'application est déployée, il faut créer les données initiales.

### Option A : Via Render Shell (Recommandé)

1. Dans l'interface Render, allez dans **"Shell"** (onglet en haut)
2. Tapez la commande :
   ```bash
   npm run seed
   ```
3. Attendez que le script termine
4. Vous devriez voir :
   ```
   ✅ Seed terminé avec succès !
   5 utilisateurs créés
   4 articles créés
   4 événements créés
   ...
   ```

### Option B : Localement puis export

```bash
# Sur votre machine locale
# 1. Modifier temporairement .env pour pointer vers MongoDB Atlas
MONGODB_URI=mongodb+srv://ascadmin:VOTRE_MOT_DE_PASSE@...

# 2. Exécuter le seed
npm run seed

# 3. Remettre .env en local
MONGODB_URI=mongodb://localhost:27017/asc-zone-de-tir
```

---

## 🔐 Étape 5 : Se connecter à l'application

1. Allez sur votre URL Render : `https://asc-zone-de-tir.onrender.com`
2. Cliquez sur **"Connexion"** en haut à droite
3. Utilisez le compte admin créé par le seed :
   - **Email** : `admin@asczondetir.sn`
   - **Mot de passe** : `Admin123!`

✅ **Vous êtes connecté en tant qu'administrateur !**

---

## 🔧 Étape 6 : Configuration post-déploiement

### 6.1 Configurer un domaine personnalisé (Optionnel)

Si vous avez un nom de domaine (ex: `asczondetir.sn`) :

1. Dans Render, allez dans **"Settings"**
2. Section **"Custom Domains"**
3. Cliquez sur **"Add Custom Domain"**
4. Entrez votre domaine : `asczondetir.sn`
5. Render vous donnera des instructions DNS à configurer chez votre registrar

### 6.2 Activer Auto-Deploy

Par défaut, Render redéploie automatiquement quand vous poussez sur GitHub.

Pour désactiver (si vous voulez déployer manuellement) :
1. **Settings** > **"Build & Deploy"**
2. Désactivez **"Auto-Deploy"**

---

## 📊 Commandes utiles après déploiement

### Mettre à jour le code

```bash
# Sur votre machine locale
git add .
git commit -m "Description des changements"
git push origin main

# Render va automatiquement redéployer !
```

### Voir les logs

1. Dans Render, allez dans **"Logs"**
2. Les logs s'affichent en temps réel

### Redémarrer l'application

1. Dans Render, allez dans **"Manual Deploy"**
2. Cliquez sur **"Clear build cache & deploy"**

### Accéder au Shell

1. Dans Render, allez dans **"Shell"**
2. Vous avez un terminal avec accès à votre application

---

## ⚠️ Limitations du plan gratuit Render

- **Sleep après 15 min d'inactivité** : Le service s'endort après 15 minutes sans requêtes
- **750 heures/mois** : Suffisant pour un usage normal
- **Premier démarrage lent** : 30-60 secondes après inactivité
- **Pas de domaine personnalisé SSL** : Uniquement sur plan payant

**💡 Astuce** : Pour éviter le sleep, utilisez un service comme **UptimeRobot** (gratuit) pour ping votre site toutes les 5 minutes.

---

## 🐛 Dépannage

### L'application ne démarre pas

**Vérifiez les logs dans Render :**
1. Allez dans **"Logs"**
2. Cherchez les erreurs rouges
3. Erreurs communes :
   - **MongoDB connection failed** : Vérifiez `MONGODB_URI` dans les variables d'environnement
   - **SESSION_SECRET not defined** : Ajoutez la variable
   - **Module not found** : Redéployez avec "Clear build cache"

### Erreur 503 Service Unavailable

- L'application est en train de démarrer (attendez 30-60 secondes)
- Ou elle a crashé (vérifiez les logs)

### Cannot connect to MongoDB

1. Vérifiez que l'URL MongoDB Atlas est correcte
2. Vérifiez que le mot de passe ne contient pas de caractères spéciaux non encodés
3. Dans MongoDB Atlas, vérifiez que **Network Access** autorise `0.0.0.0/0`

### L'upload d'images ne fonctionne pas

⚠️ **Important** : Render utilise un système de fichiers éphémère. Les fichiers uploadés disparaissent lors des redéploiements.

**Solutions** :
1. Utiliser un service de stockage cloud (AWS S3, Cloudinary, etc.)
2. Modifier le code pour utiliser le cloud storage

---

## 📈 Passer au plan payant

Si votre site a du succès, passez au **plan Starter (7$/mois)** pour :
- ✅ Pas de sleep automatique
- ✅ Plus de RAM et CPU
- ✅ Domaine personnalisé avec SSL
- ✅ Support prioritaire

---

## ✅ Checklist de déploiement

- [x] Code poussé sur GitHub
- [x] MongoDB Atlas créé et configuré
- [x] Compte Render créé
- [x] Web Service Render créé
- [x] Variables d'environnement configurées
- [x] Application déployée avec succès
- [x] Base de données peuplée (seed)
- [x] Connexion admin testée
- [x] Application accessible publiquement

---

## 🎉 Félicitations !

Votre application **ASC Zone de Tir** est maintenant en production sur Render !

**URL de votre application** : `https://asc-zone-de-tir.onrender.com`

**Prochaines étapes** :
1. Testez toutes les fonctionnalités
2. Configurez un domaine personnalisé
3. Partagez le lien avec vos utilisateurs
4. Surveillez les logs et les erreurs

---

## 📞 Besoin d'aide ?

- **Documentation Render** : https://render.com/docs
- **Documentation MongoDB Atlas** : https://docs.atlas.mongodb.com
- **Logs de l'application** : Onglet "Logs" dans Render

**Bon lancement ! 🚀**
