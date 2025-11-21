# Guide de Déploiement - ASC Zone de Tir

Guide complet pour déployer l'application en production.

## 📋 Options de déploiement

1. [VPS Linux (Recommandé)](#vps-linux)
2. [MongoDB Atlas (Cloud Database)](#mongodb-atlas)
3. [Hébergement mutualisé](#hébergement-mutualisé)
4. [Docker](#docker-optionnel)

---

## VPS Linux

### Prérequis

- VPS avec Ubuntu 20.04+ ou Debian 11+
- Minimum 1GB RAM
- 20GB de stockage
- Accès root ou sudo

### 1. Connexion au serveur

```bash
ssh root@votre-serveur.com
# ou
ssh username@votre-serveur.com
```

### 2. Mise à jour du système

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Installation de Node.js

```bash
# Ajout du repository Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Installation
sudo apt install -y nodejs

# Vérification
node --version
npm --version
```

### 4. Installation de MongoDB

```bash
# Import de la clé GPG
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Ajout du repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Mise à jour et installation
sudo apt update
sudo apt install -y mongodb-org

# Démarrage et activation
sudo systemctl start mongod
sudo systemctl enable mongod

# Vérification
sudo systemctl status mongod
```

### 5. Sécurisation de MongoDB

```bash
# Connexion à MongoDB
mongosh

# Création d'un utilisateur admin
use admin
db.createUser({
  user: "admin",
  pwd: "MotDePasseTresSecurise123!",
  roles: ["root"]
})

# Création de l'utilisateur pour la base de données
use asc-zone-de-tir
db.createUser({
  user: "ascuser",
  pwd: "AutreMotDePasseSecurise456!",
  roles: [
    { role: "readWrite", db: "asc-zone-de-tir" }
  ]
})

exit
```

Activez l'authentification :

```bash
sudo nano /etc/mongod.conf
```

Ajoutez ces lignes :
```yaml
security:
  authorization: enabled
```

Redémarrez MongoDB :
```bash
sudo systemctl restart mongod
```

### 6. Installation de Git

```bash
sudo apt install -y git
```

### 7. Création d'un utilisateur dédié

```bash
# Création de l'utilisateur
sudo adduser ascweb
sudo usermod -aG sudo ascweb

# Passage à cet utilisateur
su - ascweb
```

### 8. Clone du projet

```bash
cd /home/ascweb
git clone https://github.com/votre-repo/asc-zone-de-tir.git
cd asc-zone-de-tir
```

### 9. Installation des dépendances

```bash
npm install --production
```

### 10. Configuration de l'environnement

```bash
cp .env.example .env
nano .env
```

Configuration production :
```env
NODE_ENV=production
PORT=3000

# MongoDB avec authentification
MONGODB_URI=mongodb://ascuser:AutreMotDePasseSecurise456!@localhost:27017/asc-zone-de-tir

# Session (générez un secret fort)
SESSION_SECRET=VotreSecretSuperSecuriseAleatoire789!
SESSION_NAME=asc_session_prod
SESSION_MAX_AGE=86400000

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=contact@asczondetir.sn
EMAIL_PASSWORD=votre_mot_de_passe_application
EMAIL_FROM=ASC Zone de Tir <contact@asczondetir.sn>

# URLs
BASE_URL=https://asczondetir.sn
SITE_NAME=ASC Zone de Tir

# Uploads
MAX_FILE_SIZE=5242880
UPLOAD_PATH=public/uploads

# Sécurité
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Réseaux sociaux
FACEBOOK_URL=https://facebook.com/asczondetir
INSTAGRAM_URL=https://instagram.com/asczondetir
TWITTER_URL=https://twitter.com/asczondetir
```

### 11. Création des dossiers nécessaires

```bash
mkdir -p public/uploads/{profiles,articles,events,gallery,documents}
mkdir -p public/images
chmod -R 755 public/uploads
```

### 12. Installation de PM2

```bash
sudo npm install -g pm2
```

### 13. Démarrage de l'application

```bash
# Démarrage
pm2 start server.js --name asc-zone-de-tir

# Configuration du démarrage automatique
pm2 startup
# Suivez les instructions affichées

# Sauvegarde de la configuration
pm2 save
```

### 14. Gestion avec PM2

```bash
# Voir les logs
pm2 logs asc-zone-de-tir

# Redémarrer
pm2 restart asc-zone-de-tir

# Arrêter
pm2 stop asc-zone-de-tir

# Liste des processus
pm2 list

# Monitoring
pm2 monit

# Supprimer
pm2 delete asc-zone-de-tir
```

### 15. Installation de Nginx

```bash
sudo apt install -y nginx
```

### 16. Configuration de Nginx

```bash
sudo nano /etc/nginx/sites-available/asczondetir
```

Contenu :
```nginx
server {
    listen 80;
    server_name asczondetir.sn www.asczondetir.sn;

    # Limite de taille des uploads
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache pour les fichiers statiques
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Activation du site :
```bash
sudo ln -s /etc/nginx/sites-available/asczondetir /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 17. Installation SSL (Let's Encrypt)

```bash
# Installation de Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtention du certificat
sudo certbot --nginx -d asczondetir.sn -d www.asczondetir.sn

# Renouvellement automatique
sudo certbot renew --dry-run
```

Le certificat sera automatiquement renouvelé.

### 18. Configuration du Firewall

```bash
# Installation d'UFW
sudo apt install -y ufw

# Configuration
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Activation
sudo ufw enable

# Vérification
sudo ufw status
```

---

## MongoDB Atlas

### Avantages
- ✅ Gratuit jusqu'à 512MB
- ✅ Pas de maintenance
- ✅ Sauvegardes automatiques
- ✅ Haute disponibilité

### Configuration

1. **Créer un compte** sur https://www.mongodb.com/cloud/atlas

2. **Créer un cluster**
   - Choisissez l'option gratuite (M0)
   - Région : Europe (Paris ou Amsterdam recommandé)

3. **Créer un utilisateur de base de données**
   - Database Access → Add New Database User
   - Username: `ascuser`
   - Password: Générez un mot de passe fort
   - Rôle: Atlas admin

4. **Autoriser l'accès réseau**
   - Network Access → Add IP Address
   - Option 1 (dev): Allow Access from Anywhere (0.0.0.0/0)
   - Option 2 (prod): IP de votre serveur uniquement

5. **Obtenir la connection string**
   - Clusters → Connect → Connect your application
   - Driver: Node.js
   - Copiez la connection string

6. **Configurer dans .env**
```env
MONGODB_URI=mongodb+srv://ascuser:password@cluster0.xxxxx.mongodb.net/asc-zone-de-tir?retryWrites=true&w=majority
```

---

## Hébergement mutualisé

⚠️ **Non recommandé** - La plupart des hébergements mutualisés ne supportent pas Node.js.

Si votre hébergeur supporte Node.js :

1. Upload via FTP des fichiers
2. Installation des dépendances : `npm install --production`
3. Configurez `.env`
4. Démarrage selon la documentation de l'hébergeur

**Hébergeurs compatibles :**
- Heroku
- Render
- Railway
- DigitalOcean App Platform

---

## Docker (Optionnel)

### Dockerfile

Créez `Dockerfile` :
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

Créez `docker-compose.yml` :
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/asc-zone-de-tir
    depends_on:
      - mongo
    volumes:
      - ./public/uploads:/app/public/uploads

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password

volumes:
  mongo-data:
```

### Commandes Docker

```bash
# Build et démarrage
docker-compose up -d

# Voir les logs
docker-compose logs -f app

# Arrêter
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## Maintenance en production

### Sauvegardes MongoDB

#### Sauvegarde automatique quotidienne

Créez `/home/ascweb/backup.sh` :
```bash
#!/bin/bash
BACKUP_DIR="/home/ascweb/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

mongodump --uri="mongodb://ascuser:password@localhost:27017/asc-zone-de-tir" \
  --out="$BACKUP_DIR/backup_$DATE"

# Garder seulement les 7 derniers jours
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed: $DATE"
```

Rendez-le exécutable :
```bash
chmod +x /home/ascweb/backup.sh
```

Ajoutez au cron :
```bash
crontab -e
```

Ajoutez cette ligne (sauvegarde à 2h du matin) :
```
0 2 * * * /home/ascweb/backup.sh >> /home/ascweb/backup.log 2>&1
```

#### Restauration

```bash
mongorestore --uri="mongodb://ascuser:password@localhost:27017/asc-zone-de-tir" \
  /home/ascweb/backups/backup_20241120_020000/asc-zone-de-tir
```

### Mise à jour de l'application

```bash
cd /home/ascweb/asc-zone-de-tir

# Pull les dernières modifications
git pull origin main

# Installer les nouvelles dépendances
npm install --production

# Redémarrer l'application
pm2 restart asc-zone-de-tir
```

### Monitoring

#### Vérifier l'état des services

```bash
# PM2
pm2 status

# MongoDB
sudo systemctl status mongod

# Nginx
sudo systemctl status nginx
```

#### Logs

```bash
# Application
pm2 logs asc-zone-de-tir

# Nginx access
sudo tail -f /var/log/nginx/access.log

# Nginx errors
sudo tail -f /var/log/nginx/error.log

# MongoDB
sudo tail -f /var/log/mongodb/mongod.log
```

### Performance

#### Optimisation Node.js avec PM2

```bash
# Mode cluster (utilise tous les CPU)
pm2 start server.js -i max --name asc-zone-de-tir
```

#### Compression Nginx

Ajoutez dans la config Nginx :
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

---

## Checklist de déploiement

Avant la mise en production :

- [ ] Changé `SESSION_SECRET` en production
- [ ] Changé tous les mots de passe par défaut
- [ ] Configuré MongoDB avec authentification
- [ ] SSL activé (HTTPS)
- [ ] Firewall configuré
- [ ] Sauvegardes automatiques configurées
- [ ] PM2 configuré pour le redémarrage automatique
- [ ] Nginx installé et configuré
- [ ] DNS configurés (A record vers IP du serveur)
- [ ] Email SMTP configuré et testé
- [ ] Variables d'environnement de production définies
- [ ] Compte administrateur créé
- [ ] Tests de fonctionnement effectués

---

## Support

Pour toute aide au déploiement :
- 📧 contact@asczondetir.sn
- 📖 Documentation : README.md

---

**Bon déploiement ! 🚀**
