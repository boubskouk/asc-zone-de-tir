# 🚀 Démarrage Rapide - ASC Zone de Tir

Guide de démarrage rapide en 5 minutes !

## ⚡ Installation Express

### 1️⃣ Prérequis (2 min)

Installez Node.js et MongoDB :
- **Node.js** : https://nodejs.org (version 18+)
- **MongoDB** : https://www.mongodb.com/try/download/community

### 2️⃣ Installation (1 min)

```bash
# Naviguez vers le dossier du projet
cd "E:\site et apps\asc zone de tir"

# Installez les dépendances
npm install
```

### 3️⃣ Configuration (1 min)

```bash
# Copiez le fichier de configuration
copy .env.example .env

# Éditez .env et changez au minimum :
# SESSION_SECRET=VotreSecretSuperSecurise123456
```

### 4️⃣ Données de test (30 secondes)

```bash
# Générez des données de démonstration
npm run seed
```

✅ Cela créera :
- 5 utilisateurs (admin, modérateur, membres)
- 4 articles
- 4 événements
- 2 résultats de compétition
- 2 galeries photos

### 5️⃣ Démarrage (30 secondes)

```bash
# Démarrez l'application
npm run dev
```

## 🎉 C'est prêt !

Ouvrez votre navigateur : **http://localhost:3000**

## 🔑 Comptes de test

### Administrateur
- **Email :** admin@asczondetir.sn
- **Password :** Admin123!
- **Accès :** `/admin/dashboard`

### Modérateur
- **Email :** moderateur@asczondetir.sn
- **Password :** Modo123!

### Membre
- **Email :** amadou.diallo@example.com
- **Password :** Member123!

## 📍 Pages importantes

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` | Page d'accueil publique |
| Actualités | `/actualites` | Liste des articles |
| Événements | `/evenements` | Calendrier des événements |
| Résultats | `/resultats` | Résultats des compétitions |
| Galerie | `/galerie` | Photos et vidéos |
| Contact | `/contact` | Formulaire de contact |
| Connexion | `/auth/login` | Connexion membres |
| Admin | `/admin/dashboard` | Tableau de bord admin |

## 🛠️ Commandes utiles

```bash
# Mode développement (avec auto-reload)
npm run dev

# Mode production
npm start

# Regénérer les données de test
npm run seed

# Vérifier que MongoDB fonctionne
mongosh
```

## 📱 Tester rapidement

### 1. En tant que visiteur
1. Allez sur http://localhost:3000
2. Parcourez les actualités et événements
3. Remplissez le formulaire de contact

### 2. En tant que membre
1. Connectez-vous avec : amadou.diallo@example.com / Member123!
2. Allez dans "Mon espace"
3. Inscrivez-vous à un événement
4. Modifiez votre profil

### 3. En tant qu'admin
1. Connectez-vous avec : admin@asczondetir.sn / Admin123!
2. Allez dans "Administration"
3. Créez un nouvel article
4. Gérez les membres
5. Ajoutez un événement

## ❓ Problèmes ?

### MongoDB ne démarre pas
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Port 3000 déjà utilisé
Changez le port dans `.env` :
```
PORT=3001
```

### Erreur "Cannot find module"
```bash
npm install
```

## 📚 Documentation complète

- **Guide complet :** Voir `README.md`
- **Installation détaillée :** Voir `INSTALLATION.md`
- **Guide utilisateur :** Voir `GUIDE_UTILISATEUR.md`

## 🎯 Prochaines étapes

1. ✅ Changez les mots de passe par défaut
2. ✅ Configurez l'email dans `.env`
3. ✅ Personnalisez le contenu
4. ✅ Ajoutez vos propres images
5. ✅ Configurez les réseaux sociaux dans `.env`

## 💡 Conseils

- **Développement :** Utilisez `npm run dev` pour l'auto-reload
- **Production :** Utilisez `npm start` ou PM2
- **Sauvegardes :** Sauvegardez régulièrement MongoDB
- **Sécurité :** Changez immédiatement les secrets dans `.env`

## 🚨 Sécurité - IMPORTANT !

Avant de mettre en production :

1. ✅ Changez `SESSION_SECRET` dans `.env`
2. ✅ Changez tous les mots de passe par défaut
3. ✅ Configurez MongoDB avec authentification
4. ✅ Utilisez HTTPS (certificat SSL)
5. ✅ Configurez un firewall

## 📞 Support

Besoin d'aide ? Consultez :
- 📖 `README.md` - Documentation complète
- 📋 `INSTALLATION.md` - Guide d'installation détaillé
- 👤 `GUIDE_UTILISATEUR.md` - Manuel utilisateur

---

**Bon développement ! 🎉**
