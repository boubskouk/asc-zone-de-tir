# Guide Utilisateur - ASC Zone de Tir

Guide complet pour utiliser et administrer le site web de l'ASC Zone de Tir.

## 📑 Table des matières

1. [Pour les visiteurs](#pour-les-visiteurs)
2. [Pour les membres](#pour-les-membres)
3. [Pour les administrateurs](#pour-les-administrateurs)
4. [Gestion du contenu](#gestion-du-contenu)
5. [FAQ](#faq)

---

## Pour les visiteurs

### Navigation sur le site

#### Page d'accueil
- Consultez les dernières actualités
- Découvrez les prochains événements
- Accédez rapidement aux différentes sections

#### Actualités
- **URL :** `/actualites`
- Filtrez par catégorie : Sport, Culture, Événements, Vie associative
- Recherchez des articles par mots-clés
- Partagez sur les réseaux sociaux

#### Événements
- **URL :** `/evenements`
- Consultez le calendrier des événements
- Filtrez par type : Compétition, Entraînement, Réunion, Culturel
- Vue liste ou vue calendrier

#### Résultats
- **URL :** `/resultats`
- Consultez les résultats des compétitions
- Filtrez par discipline ou année
- Accédez au palmarès du club

#### Galerie
- **URL :** `/galerie`
- Photos et vidéos des événements
- Albums organisés par événement

### S'inscrire

1. Cliquez sur "Nous rejoindre" dans le menu
2. Remplissez le formulaire d'inscription :
   - Prénom et Nom
   - Email (servira d'identifiant)
   - Mot de passe (minimum 6 caractères)
   - Téléphone (optionnel)
   - Date de naissance (optionnel)
3. Acceptez les conditions générales
4. Cliquez sur "S'inscrire"
5. Vous recevrez un email de confirmation

⚠️ **Note :** Votre compte devra être validé par un administrateur avant d'avoir accès à toutes les fonctionnalités.

### Contacter l'association

1. Allez sur la page Contact
2. Remplissez le formulaire :
   - Nom
   - Email
   - Sujet
   - Message
3. Vous recevrez une réponse sous 48-72 heures

---

## Pour les membres

### Connexion

1. Cliquez sur "Connexion" dans le menu
2. Entrez votre email et mot de passe
3. Cochez "Se souvenir de moi" (optionnel)

**Mot de passe oublié ?**
- Cliquez sur "Mot de passe oublié ?"
- Entrez votre email
- Suivez les instructions reçues par email

### Mon espace membre

#### Dashboard
- **URL :** `/membre/dashboard`
- Vue d'ensemble de votre compte
- Prochains événements auxquels vous êtes inscrit
- Statut de votre cotisation
- Notifications

#### Mon profil
- **URL :** `/membre/profil`

**Informations modifiables :**
- Prénom, nom
- Téléphone
- Date de naissance
- Adresse complète
- Contact d'urgence

**Photo de profil :**
1. Cliquez sur "Changer la photo"
2. Sélectionnez une image (max 5MB)
3. Formats acceptés : JPG, PNG, GIF
4. Cliquez sur "Télécharger"

#### Mes événements
- **URL :** `/membre/evenements`
- Liste des événements auxquels vous participez
- Statut de votre inscription
- Annuler une inscription

### S'inscrire à un événement

1. Allez sur la page Événements
2. Cliquez sur un événement
3. Vérifiez les détails :
   - Date et heure
   - Lieu
   - Prix
   - Places disponibles
4. Cliquez sur "S'inscrire"
5. Confirmez votre inscription

**Annuler une inscription :**
1. Allez dans "Mes événements"
2. Cliquez sur "Annuler" à côté de l'événement
3. Confirmez l'annulation

### Mes documents
- **URL :** `/membre/documents`

**Upload de certificat médical :**
1. Cliquez sur "Ajouter un certificat"
2. Sélectionnez votre fichier PDF
3. Le certificat est valide 1 an

---

## Pour les administrateurs

### Accès à l'administration

**URL :** `/admin/dashboard`

Vous devez avoir le rôle "admin" ou "moderator".

### Dashboard administrateur

Le tableau de bord affiche :
- 📊 Statistiques clés :
  - Nombre total de membres
  - Membres actifs
  - Articles publiés
  - Événements à venir
  - Messages non lus
- 👥 Derniers membres inscrits
- 📧 Derniers messages de contact

---

## Gestion du contenu

### Gérer les membres

**URL :** `/admin/membres`

#### Voir tous les membres
- Liste complète avec pagination
- Recherche par nom ou email
- Filtre par statut (actif, en attente, expiré, suspendu)

#### Voir le détail d'un membre
1. Cliquez sur le nom du membre
2. Consultez toutes ses informations
3. Historique des cotisations
4. Événements auxquels il participe

#### Modifier le statut d'un membre
1. Ouvrez la fiche du membre
2. Sélectionnez le nouveau statut :
   - **Active** : Cotisation à jour
   - **Pending** : En attente de validation
   - **Expired** : Cotisation expirée
   - **Suspended** : Compte suspendu
3. Cliquez sur "Mettre à jour"

#### Exporter la liste des membres
- Cliquez sur "Exporter (CSV)"
- Le fichier contient tous les membres avec leurs informations

### Gérer les articles

**URL :** `/admin/articles`

#### Créer un article

1. Cliquez sur "Nouvel article"
2. Remplissez les informations :
   - **Titre** (obligatoire)
   - **Contenu** (obligatoire, minimum 50 caractères)
   - **Extrait** (résumé court)
   - **Catégorie** : Sport, Culture, Événement, Vie associative
   - **Tags** (séparés par des virgules)
   - **Image à la une** (optionnel)
3. Choisissez le statut :
   - **Brouillon** : Non visible publiquement
   - **Publié** : Visible par tous
   - **Archivé** : Caché mais conservé
4. Cochez "Article en vedette" pour l'afficher en priorité
5. Cliquez sur "Créer"

#### Modifier un article

1. Cliquez sur l'icône "Modifier" (crayon)
2. Effectuez vos modifications
3. Cliquez sur "Enregistrer"

#### Supprimer un article

1. Cliquez sur l'icône "Supprimer" (poubelle)
2. Confirmez la suppression

⚠️ **Attention :** Cette action est irréversible !

### Gérer les événements

**URL :** `/admin/evenements`

#### Créer un événement

1. Cliquez sur "Nouvel événement"
2. Informations de base :
   - **Titre** (obligatoire)
   - **Description** (obligatoire)
   - **Date de début** (obligatoire)
   - **Date de fin** (optionnel)
   - **Type** : Compétition, Entraînement, Réunion, Culturel, Social
   - **Catégorie** : Sport, Culture, Mixte

3. Localisation :
   - Nom du lieu
   - Adresse
   - Ville

4. Inscription :
   - ✅ Inscription requise ?
   - Nombre maximum de participants
   - Date limite d'inscription
   - Prix (en FCFA)

5. Visibilité :
   - ✅ Public (visible par tous)
   - ✅ En vedette (affiché en priorité)

6. Image à la une (optionnel)

7. Cliquez sur "Créer"

#### Voir les participants

1. Ouvrez un événement
2. Section "Participants"
3. Liste avec :
   - Nom du participant
   - Date d'inscription
   - Statut (Inscrit, Confirmé, Annulé)

#### Modifier/Supprimer un événement

Même procédure que pour les articles.

### Gérer les résultats

**URL :** `/admin/resultats`

#### Ajouter un résultat

1. Cliquez sur "Nouveau résultat"
2. Informations de la compétition :
   - Nom de la compétition
   - Date
   - Lieu
   - Niveau (Local, Régional, National, International)

3. Discipline et catégorie

4. Classement :
   - Position
   - Athlète (sélection depuis les membres)
   - Score
   - Points
   - Détails

5. Résultat d'équipe (optionnel)

6. Records éventuels

7. Statut :
   - Provisoire
   - Final
   - Non officiel

8. Cliquez sur "Enregistrer"

### Gérer la galerie

**URL :** `/admin/galerie`

#### Créer un album

1. Cliquez sur "Nouvel album"
2. Informations :
   - Titre
   - Description
   - Type (Photo ou Vidéo)
   - Date
   - Lié à un événement (optionnel)

3. Upload de médias :
   - Pour les photos : JPG, PNG (max 5MB chacune)
   - Pour les vidéos : lien YouTube ou Vimeo

4. Visibilité et tags

5. Cliquez sur "Créer"

### Gérer les messages de contact

**URL :** `/admin/contacts`

#### Consulter les messages

- Tous les messages reçus via le formulaire de contact
- Badge rouge sur les nouveaux messages
- Statuts :
  - 🔴 **Nouveau** : Non lu
  - 👁️ **Lu** : Consulté
  - ✅ **Répondu** : Réponse envoyée
  - 📦 **Archivé** : Traité et archivé

#### Répondre à un message

1. Cliquez sur le message
2. Le message passe automatiquement en "Lu"
3. Consultez les informations :
   - Nom et email de l'expéditeur
   - Téléphone (si fourni)
   - Sujet et message
   - Date de réception
4. Répondez par email directement à l'adresse fournie
5. Marquez comme "Répondu"

---

## FAQ

### Questions générales

**Q : Comment changer mon mot de passe ?**

R :
1. Connectez-vous
2. Allez dans "Mon profil"
3. Section "Sécurité"
4. Cliquez sur "Modifier le mot de passe"

**Q : Je n'arrive pas à me connecter**

R :
- Vérifiez votre email et mot de passe
- Utilisez "Mot de passe oublié" si nécessaire
- Vérifiez que votre compte est activé
- Contactez un administrateur si le problème persiste

**Q : Comment savoir si ma cotisation est à jour ?**

R :
- Connectez-vous à votre espace membre
- Dashboard → Statut de la cotisation
- Badge vert = À jour
- Badge rouge = Expirée

### Pour les administrateurs

**Q : Comment créer un compte administrateur ?**

R : Voir la section "Premier compte administrateur" dans INSTALLATION.md

**Q : Peut-on restaurer un article supprimé ?**

R : Non, les suppressions sont définitives. Privilégiez le statut "Archivé" pour conserver l'article.

**Q : Comment sauvegarder la base de données ?**

R : Voir la section "Sauvegardes MongoDB" dans README.md

**Q : Les membres peuvent-ils créer du contenu ?**

R : Non, seuls les administrateurs et modérateurs peuvent créer et gérer le contenu.

**Q : Comment ajouter des images optimisées ?**

R :
- Redimensionnez vos images avant upload
- Format recommandé : JPG à 80% de qualité
- Tailles recommandées :
  - Articles : 1200x630px
  - Événements : 800x600px
  - Galerie : 1920x1080px maximum

---

## Raccourcis clavier

### Navigation
- `Ctrl + K` : Recherche globale (à implémenter)
- `Esc` : Fermer les modales

### Administration
- `Ctrl + S` : Sauvegarder (dans les formulaires)
- `Ctrl + Shift + P` : Prévisualiser (articles)

---

## Support technique

### Problèmes fréquents

**Upload d'image échoue**
- Vérifiez la taille (max 5MB)
- Formats acceptés : JPG, PNG, GIF
- Vérifiez vos permissions de dossier

**Session expire rapidement**
- Configurez `SESSION_MAX_AGE` dans `.env`
- Cochez "Se souvenir de moi" à la connexion

**Emails non reçus**
- Vérifiez vos spams
- Vérifiez la configuration SMTP dans `.env`
- Contactez l'administrateur

### Contact support

- 📧 Email : support@asczondetir.sn
- 📞 Téléphone : +221 XX XXX XX XX
- 💬 Disponibilité : Lun-Ven 9h-18h

---

**Dernière mise à jour : Novembre 2024**
