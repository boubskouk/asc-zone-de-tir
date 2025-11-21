# 🚀 Guide GitHub et Mise en Production

Guide complet pour mettre le projet sur GitHub et le déployer en production.

---

## 📦 Partie 1 : Mettre sur GitHub

### Étape 1 : Créer un dépôt sur GitHub

1. **Allez sur GitHub** : https://github.com
2. **Connectez-vous** à votre compte (ou créez-en un)
3. **Cliquez sur "New repository"** (bouton vert en haut à droite)
4. **Remplissez le formulaire** :
   - Repository name : `asc-zone-de-tir`
   - Description : `Application web pour l'Association Sportive et Culturelle Zone de Tir`
   - Visibilité : **Private** (recommandé) ou Public
   - **NE PAS** cocher "Initialize with README" (on a déjà les fichiers)
5. **Cliquez sur "Create repository"**

### Étape 2 : Lier votre projet local à GitHub

```bash
# Dans votre terminal, à la racine du projet
cd "E:\site et apps\asc zone de tir"

# Ajouter le remote GitHub (remplacez YOUR_USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/YOUR_USERNAME/asc-zone-de-tir.git

# Vérifier que le remote est bien ajouté
git remote -v
```

### Étape 3 : Pousser le code sur GitHub

```bash
# Renommer la branche principale en "main" (standard GitHub)
git branch -M main

# Pousser le code vers GitHub
git push -u origin main
```

**Résultat** : Votre code est maintenant sur GitHub ! 🎉

### Étape 4 : Vérification

- Allez sur `https://github.com/YOUR_USERNAME/asc-zone-de-tir`
- Vous devriez voir tous vos fichiers
- Le fichier `README.md` s'affiche automatiquement

---

## 🌐 Partie 2 : Déployer en Production

### Option A : Déploiement sur VPS (Recommandé)

#### Plateformes VPS populaires :
- **DigitalOcean** : https://www.digitalocean.com (5$/mois)
- **Linode** : https://www.linode.com (5$/mois)
- **Vultr** : https://www.vultr.com (5$/mois)
- **Hostinger VPS** : https://www.hostinger.fr/serveur-vps (à partir de 4€/mois)

#### Étapes de déploiement VPS :

**1. Créer un VPS Ubuntu 22.04**
- Mémoire : Minimum 1GB RAM
- Stockage : 20GB
- Région : Choisir le plus proche (Europe pour le Sénégal)

**2. Se connecter au VPS**
```bash
ssh root@VOTRE_IP_VPS
```

**3. Installer Node.js et MongoDB**
```bash
# Mise à jour système
apt update && apt upgrade -y

# Installer Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Installer MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Installer Git
apt install -y git

# Installer Nginx (serveur web)
apt install -y nginx

# Installer PM2 (gestionnaire de processus)
npm install -g pm2
```

**4. Cloner le projet**
```bash
# Créer un dossier pour l'application
mkdir -p /var/www
cd /var/www

# Cloner depuis GitHub
git clone https://github.com/YOUR_USERNAME/asc-zone-de-tir.git
cd asc-zone-de-tir

# Installer les dépendances
npm install --production
```

**5. Configurer les variables d'environnement**
```bash
# Copier le fichier .env.example
cp .env.example .env

# Éditer le fichier .env
nano .env
```

**Contenu du .env en production :**
```env
NODE_ENV=production
PORT=3000

# MongoDB local sur le VPS
MONGODB_URI=mongodb://localhost:27017/asc-zone-de-tir

# SESSION_SECRET : Générer une valeur aléatoire sécurisée
SESSION_SECRET=VOTRE_SECRET_TRES_SECURISE_ICI

# URL de production (remplacez par votre domaine)
BASE_URL=https://votre-domaine.com
SITE_NAME=ASC Zone de Tir

# Reste de la config...
```

**Générer un SESSION_SECRET sécurisé :**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**6. Créer les données initiales**
```bash
# Peupler la base de données
npm run seed
```

**7. Démarrer l'application avec PM2**
```bash
# Démarrer l'app
pm2 start server.js --name asc-zone-de-tir

# Configurer le démarrage automatique
pm2 startup
pm2 save

# Vérifier que l'app tourne
pm2 status
pm2 logs asc-zone-de-tir
```

**8. Configurer Nginx**
```bash
# Créer la configuration Nginx
nano /etc/nginx/sites-available/asc-zone-de-tir
```

**Contenu du fichier :**
```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Upload de fichiers (max 10MB)
    client_max_body_size 10M;
}
```

**Activer la configuration :**
```bash
# Créer le lien symbolique
ln -s /etc/nginx/sites-available/asc-zone-de-tir /etc/nginx/sites-enabled/

# Tester la configuration
nginx -t

# Redémarrer Nginx
systemctl restart nginx
```

**9. Configurer SSL avec Let's Encrypt (HTTPS)**
```bash
# Installer Certbot
apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Renouvellement automatique
certbot renew --dry-run
```

**10. Configurer le pare-feu**
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

---

### Option B : MongoDB Atlas (Base de données cloud)

Si vous ne voulez pas gérer MongoDB vous-même :

**1. Créer un compte MongoDB Atlas**
- Allez sur : https://www.mongodb.com/cloud/atlas
- Créez un compte gratuit

**2. Créer un cluster**
- Choisir "Free Shared Cluster" (gratuit)
- Région : Choisir la plus proche (Europe)
- Cluster Name : `asc-zone-de-tir`

**3. Configurer l'accès**
- Database Access : Créer un utilisateur avec mot de passe
- Network Access : Ajouter `0.0.0.0/0` (accès depuis partout)

**4. Récupérer l'URL de connexion**
- Cliquer sur "Connect"
- Choisir "Connect your application"
- Copier l'URL : `mongodb+srv://username:password@cluster.mongodb.net/`

**5. Mettre à jour .env**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/asc-zone-de-tir?retryWrites=true&w=majority
```

---

### Option C : Render (Déploiement facile)

**Render** est une plateforme moderne qui facilite le déploiement :

**1. Créer un compte sur Render**
- Allez sur : https://render.com
- Connectez-vous avec GitHub

**2. Créer un nouveau Web Service**
- Cliquer sur "New +" > "Web Service"
- Connecter votre repo GitHub `asc-zone-de-tir`

**3. Configuration**
```
Name: asc-zone-de-tir
Environment: Node
Build Command: npm install
Start Command: npm start
Plan: Free (ou Starter à 7$/mois)
```

**4. Variables d'environnement**
Ajouter dans l'interface Render :
- `NODE_ENV` = `production`
- `MONGODB_URI` = Votre URL MongoDB Atlas
- `SESSION_SECRET` = Valeur aléatoire sécurisée
- `BASE_URL` = URL fournie par Render
- Etc.

**5. Déployer**
- Cliquer sur "Create Web Service"
- Render va automatiquement déployer votre app

---

### Option D : Heroku (Alternative)

**1. Installer Heroku CLI**
```bash
# Windows
# Télécharger depuis : https://devcenter.heroku.com/articles/heroku-cli
```

**2. Déployer**
```bash
# Login
heroku login

# Créer l'app
heroku create asc-zone-de-tir

# Ajouter MongoDB addon
heroku addons:create mongolab:sandbox

# Configurer les variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=votre_secret

# Déployer
git push heroku main

# Peupler la base
heroku run npm run seed
```

---

## 🔧 Commandes utiles après déploiement

### Mettre à jour le code en production

```bash
# Sur votre machine locale
git add .
git commit -m "Description des changements"
git push origin main

# Sur le VPS
cd /var/www/asc-zone-de-tir
git pull origin main
npm install --production
pm2 restart asc-zone-de-tir
```

### Vérifier les logs

```bash
# Logs de l'application
pm2 logs asc-zone-de-tir

# Logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Sauvegarder la base de données

```bash
# Créer une sauvegarde
mongodump --db asc-zone-de-tir --out /backup/mongo-$(date +%Y%m%d)

# Restaurer une sauvegarde
mongorestore --db asc-zone-de-tir /backup/mongo-20250121/asc-zone-de-tir
```

---

## 📊 Checklist de mise en production

### Avant le déploiement
- [ ] Fichier `.env` configuré avec des valeurs de production
- [ ] `SESSION_SECRET` généré aléatoirement (PAS celui par défaut)
- [ ] MongoDB installé et configuré
- [ ] Code testé localement
- [ ] Documentation à jour

### Configuration serveur
- [ ] Node.js 18+ installé
- [ ] MongoDB installé ou Atlas configuré
- [ ] PM2 configuré pour démarrage automatique
- [ ] Nginx installé et configuré
- [ ] SSL/HTTPS configuré (Let's Encrypt)
- [ ] Pare-feu configuré (UFW)

### Sécurité
- [ ] Mot de passe SSH fort ou clés SSH
- [ ] Ports inutiles fermés
- [ ] MongoDB avec authentification
- [ ] Variables sensibles dans .env (pas dans Git)
- [ ] Rate limiting activé
- [ ] Helmet.js configuré

### Post-déploiement
- [ ] Application accessible depuis le domaine
- [ ] HTTPS fonctionne correctement
- [ ] Connexion admin fonctionne
- [ ] Upload de fichiers fonctionne
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Sauvegarde de la base configurée

---

## 🆘 Dépannage

### L'application ne démarre pas
```bash
# Vérifier les logs
pm2 logs asc-zone-de-tir

# Vérifier le port 3000
netstat -tulpn | grep :3000

# Redémarrer
pm2 restart asc-zone-de-tir
```

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB tourne
systemctl status mongod

# Redémarrer MongoDB
systemctl restart mongod

# Vérifier les logs MongoDB
tail -f /var/log/mongodb/mongod.log
```

### Site inaccessible
```bash
# Vérifier Nginx
nginx -t
systemctl status nginx

# Vérifier le pare-feu
ufw status

# Vérifier les logs Nginx
tail -f /var/log/nginx/error.log
```

---

## 📞 Support

Pour toute question :
1. Consultez la documentation : `README.md`, `DEPLOYMENT.md`
2. Vérifiez les logs : `pm2 logs`
3. Consultez la communauté Node.js/Express

---

**🎉 Félicitations ! Votre application ASC Zone de Tir est en production !**

Une fois déployée, votre application sera accessible 24/7 depuis n'importe où dans le monde.
