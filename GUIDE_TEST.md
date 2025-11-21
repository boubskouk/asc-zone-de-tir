# 🧪 Guide de Test - ASC Zone de Tir

## 🚀 L'application est prête !

✅ **Serveur démarré** : http://localhost:3000
✅ **MongoDB connecté** : Base de données peuplée avec des données de test
✅ **Comptes créés** : Admin, modérateur et membres disponibles

---

## 🔑 Comptes de test

### Administrateur
- **Email** : `admin@asczondetir.sn`
- **Mot de passe** : `Admin123!`
- **Accès** : Toutes les fonctionnalités admin + membre

### Modérateur
- **Email** : `moderateur@asczondetir.sn`
- **Mot de passe** : `Modo123!`
- **Accès** : Fonctionnalités admin + membre

### Membre
- **Email** : `amadou.diallo@example.com`
- **Mot de passe** : `Member123!`
- **Accès** : Espace membre uniquement

---

## 📋 Checklist de test

### ✅ Front-office (Pages publiques)

1. **Page d'accueil** - http://localhost:3000
   - [ ] Vérifier l'affichage des derniers articles
   - [ ] Vérifier les événements à venir
   - [ ] Tester le bouton "Nous rejoindre"

2. **Pages statiques**
   - [ ] Qui sommes-nous - http://localhost:3000/qui-sommes-nous
   - [ ] Nos activités - http://localhost:3000/nos-activites
   - [ ] Nous rejoindre - http://localhost:3000/nous-rejoindre
   - [ ] Nos partenaires - http://localhost:3000/nos-partenaires

3. **Actualités**
   - [ ] Liste des articles - http://localhost:3000/actualites
   - [ ] Filtres par catégorie
   - [ ] Détail d'un article
   - [ ] Pagination

4. **Événements**
   - [ ] Liste des événements - http://localhost:3000/evenements
   - [ ] Filtres par type
   - [ ] Détail d'un événement
   - [ ] Inscription à un événement (connecté)

5. **Résultats**
   - [ ] Liste des résultats - http://localhost:3000/resultats
   - [ ] Détail d'un résultat avec podium

6. **Galerie**
   - [ ] Liste des albums - http://localhost:3000/galerie
   - [ ] Détail d'un album
   - [ ] Lightbox pour visualiser les photos

7. **Contact**
   - [ ] Formulaire de contact - http://localhost:3000/contact
   - [ ] Envoi d'un message

### ✅ Authentification

1. **Inscription** - http://localhost:3000/auth/inscription
   - [ ] Créer un nouveau compte
   - [ ] Validation des champs
   - [ ] Redirection après inscription

2. **Connexion** - http://localhost:3000/auth/login
   - [ ] Se connecter avec un compte existant
   - [ ] Affichage des erreurs en cas d'échec
   - [ ] Redirection vers le dashboard membre

3. **Déconnexion**
   - [ ] Bouton de déconnexion fonctionnel

### ✅ Espace Membre

**Connectez-vous d'abord avec un compte membre**

1. **Dashboard** - http://localhost:3000/membre/dashboard
   - [ ] Affichage du statut d'adhésion
   - [ ] Liste des prochains événements
   - [ ] Actions rapides fonctionnelles

2. **Mon profil** - http://localhost:3000/membre/profil
   - [ ] Modifier les informations personnelles
   - [ ] Upload de photo de profil
   - [ ] Modifier l'adresse
   - [ ] Ajouter un contact d'urgence

3. **Mes événements** - http://localhost:3000/membre/evenements
   - [ ] Liste des événements auxquels je suis inscrit
   - [ ] Annuler une inscription
   - [ ] Événements à venir vs passés

4. **Mes documents** - http://localhost:3000/membre/documents
   - [ ] Upload d'un document
   - [ ] Liste des documents uploadés
   - [ ] Télécharger un document
   - [ ] Supprimer un document

### ✅ Administration

**Connectez-vous avec le compte admin**

1. **Dashboard Admin** - http://localhost:3000/admin/dashboard
   - [ ] Statistiques (membres, articles, événements, messages)
   - [ ] Derniers membres inscrits
   - [ ] Derniers messages
   - [ ] Boutons d'actions rapides

2. **Gestion des membres** - http://localhost:3000/admin/membres
   - [ ] Liste de tous les membres
   - [ ] Filtres (statut, rôle)
   - [ ] Recherche par nom/email
   - [ ] Statistiques (total, actifs, en attente, expirés)
   - [ ] Créer un nouveau membre
   - [ ] Modifier un membre existant
   - [ ] Supprimer un membre

3. **Gestion des articles** - http://localhost:3000/admin/articles
   - [ ] Liste de tous les articles
   - [ ] Filtres (catégorie, statut)
   - [ ] Créer un nouvel article
   - [ ] Modifier un article (éditeur TinyMCE)
   - [ ] Upload d'image à la une
   - [ ] Gérer les tags et SEO
   - [ ] Supprimer un article

4. **Gestion des événements** - http://localhost:3000/admin/evenements
   - [ ] Liste de tous les événements
   - [ ] Filtres (type, statut)
   - [ ] Créer un nouvel événement
   - [ ] Modifier un événement
   - [ ] Gérer les inscriptions
   - [ ] Supprimer un événement

5. **Gestion des résultats** - http://localhost:3000/admin/resultats
   - [ ] Liste des résultats
   - [ ] Affichage des podiums
   - [ ] Supprimer un résultat

6. **Gestion de la galerie** - http://localhost:3000/admin/galerie
   - [ ] Liste des albums
   - [ ] Filtres (photos/vidéos)
   - [ ] Supprimer un album

7. **Messages de contact** - http://localhost:3000/admin/contacts
   - [ ] Liste de tous les messages
   - [ ] Filtres par statut
   - [ ] Statistiques (nouveaux, lus, répondus)
   - [ ] Voir le détail d'un message
   - [ ] Marquer comme lu automatiquement
   - [ ] Archiver un message
   - [ ] Supprimer un message
   - [ ] Répondre par email

---

## 🐛 Tests de fonctionnalités critiques

### Upload de fichiers
1. **Photo de profil** (membre)
   - Formats acceptés : JPG, PNG
   - Taille max : 5MB
   - Prévisualisation avant upload

2. **Documents** (membre)
   - Types : licence, certificat médical, assurance, ID, photo, autre
   - Formats : PDF, JPG, PNG
   - Taille max : 5MB
   - Statut de vérification (admin peut vérifier)

3. **Image d'article** (admin)
   - Prévisualisation dans l'éditeur
   - Image à la une

### Permissions
1. **Page admin non accessible** si non admin
   - Tester avec compte membre : redirection vers /membre/dashboard

2. **Page membre non accessible** si non connecté
   - Redirection vers /auth/login

### Responsive
- [ ] Tester sur mobile (320px, 375px, 425px)
- [ ] Tester sur tablette (768px, 1024px)
- [ ] Tester sur desktop (1920px)

---

## 📊 Données créées par le seed

- **5 utilisateurs** : 1 admin, 1 modérateur, 3 membres
- **4 articles** : Dans différentes catégories
- **4 événements** : Compétitions et entraînements
- **2 résultats** : Avec podiums complets
- **2 galeries** : Albums photo et vidéo

---

## 🔧 Commandes utiles

```bash
# Démarrer l'application
npm start

# Démarrer en mode développement (avec nodemon)
npm run dev

# Réinitialiser la base de données
npm run seed

# Arrêter le serveur
Ctrl + C
```

---

## 🚨 En cas de problème

### L'application ne démarre pas
```bash
# Vérifier que MongoDB est démarré
# Vérifier que le port 3000 est libre
netstat -ano | findstr :3000

# Si le port est occupé, tuer le processus
taskkill //F //PID [PID_NUMBER]
```

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est installé et démarré
# Windows : Vérifier le service MongoDB
# Vérifier l'URL dans .env : mongodb://localhost:27017/asc-zone-de-tir
```

### Pages admin vides
```bash
# Relancer le seed pour recréer les données
npm run seed
```

---

## 📝 Notes

- **Session expiration** : 24 heures par défaut
- **Sécurité** : Les mots de passe sont hashés avec bcrypt
- **CSRF** : Protection activée sur tous les formulaires
- **Rate limiting** : 100 requêtes par 15 minutes

---

## ✅ Tests réussis

Cochez les fonctionnalités testées et validées :

- [ ] Page d'accueil
- [ ] Inscription/Connexion
- [ ] Espace membre complet
- [ ] Dashboard admin
- [ ] Gestion des membres
- [ ] Gestion des articles
- [ ] Gestion des événements
- [ ] Messages de contact
- [ ] Upload de fichiers
- [ ] Responsive design
- [ ] Sécurité (permissions)

---

**🎉 Bon test ! L'application ASC Zone de Tir est prête à l'emploi.**

Pour toute question ou problème, consultez la documentation dans les fichiers :
- `README.md` - Guide général
- `INSTALLATION.md` - Installation détaillée
- `GUIDE_UTILISATEUR.md` - Guide utilisateur complet
