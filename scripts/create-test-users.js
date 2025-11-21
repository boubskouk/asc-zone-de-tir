require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const testUsers = [
  {
    firstName: 'Modérateur',
    lastName: 'ASC',
    email: 'moderateur@asczondetir.sn',
    password: 'Modo123!',
    role: 'moderator',
    membershipStatus: 'active',
    phone: '+221 77 000 00 01',
    disciplines: ['pistolet', 'carabine'],
    isEmailVerified: true,
  },
  {
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: 'amadou.diallo@example.com',
    password: 'Member123!',
    role: 'member',
    membershipStatus: 'active',
    phone: '+221 77 000 00 02',
    dateOfBirth: new Date('1990-05-15'),
    disciplines: ['pistolet'],
    address: {
      city: 'Dakar',
      country: 'Sénégal',
    },
    isEmailVerified: true,
  },
];

async function createTestUsers() {
  try {
    console.log('🔗 Connexion à MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB Atlas');

    // Supprimer les utilisateurs existants avec ces emails
    for (const userData of testUsers) {
      await User.deleteOne({ email: userData.email });
      console.log(`🗑️  Utilisateur existant supprimé: ${userData.email}`);
    }

    // Créer les nouveaux utilisateurs
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Utilisateur créé: ${user.email} (${user.role})`);
      console.log(`   - Nom: ${user.getFullName()}`);
      console.log(`   - N° Adhérent: ${user.membershipNumber || 'En attente'}`);
      console.log(`   - Statut: ${user.membershipStatus}`);
    }

    console.log('\n✅ Tous les utilisateurs de test ont été créés avec succès !');
    console.log('\n📋 Récapitulatif des comptes:');
    console.log('─────────────────────────────────────────────────────');
    console.log('MODÉRATEUR');
    console.log('  Email: moderateur@asczondetir.sn');
    console.log('  Mot de passe: Modo123!');
    console.log('  Rôle: moderator');
    console.log('');
    console.log('MEMBRE');
    console.log('  Email: amadou.diallo@example.com');
    console.log('  Mot de passe: Member123!');
    console.log('  Rôle: member');
    console.log('─────────────────────────────────────────────────────');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Déconnexion de MongoDB');
    process.exit(0);
  }
}

createTestUsers();
