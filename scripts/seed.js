require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Article = require('../models/Article');
const Event = require('../models/Event');
const Result = require('../models/Result');
const Gallery = require('../models/Gallery');

const seedDatabase = async () => {
  try {
    console.log('🌱 Début du seeding de la base de données...\n');

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/asc-zone-de-tir');
    console.log('✅ Connecté à MongoDB\n');

    // Supprimer les données existantes
    console.log('🗑️  Suppression des données existantes...');
    await User.deleteMany({});
    await Article.deleteMany({});
    await Event.deleteMany({});
    await Result.deleteMany({});
    await Gallery.deleteMany({});
    console.log('✅ Données supprimées\n');

    // ==================== UTILISATEURS ====================
    console.log('👥 Création des utilisateurs...');

    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'ASC',
      email: 'admin@asczondetir.sn',
      password: 'Admin123!',
      role: 'admin',
      membershipStatus: 'active',
      phone: '+221771234567',
      dateOfBirth: new Date('1985-05-15'),
    });

    const moderateur = await User.create({
      firstName: 'Modérateur',
      lastName: 'Zone',
      email: 'moderateur@asczondetir.sn',
      password: 'Modo123!',
      role: 'moderator',
      membershipStatus: 'active',
      phone: '+221772345678',
    });

    const membres = await User.create([
      {
        firstName: 'Amadou',
        lastName: 'Diallo',
        email: 'amadou.diallo@example.com',
        password: 'Member123!',
        membershipStatus: 'active',
        phone: '+221773456789',
        disciplines: ['Tir sportif', 'Carabine'],
      },
      {
        firstName: 'Fatou',
        lastName: 'Sow',
        email: 'fatou.sow@example.com',
        password: 'Member123!',
        membershipStatus: 'active',
        phone: '+221774567890',
        disciplines: ['Pistolet', 'Tir de précision'],
      },
      {
        firstName: 'Moussa',
        lastName: 'Ndiaye',
        email: 'moussa.ndiaye@example.com',
        password: 'Member123!',
        membershipStatus: 'pending',
        phone: '+221775678901',
      },
    ]);

    console.log(`✅ ${membres.length + 2} utilisateurs créés\n`);

    // ==================== ARTICLES ====================
    console.log('📰 Création des articles...');

    const articles = await Article.create([
      {
        title: 'Ouverture de la saison sportive 2024',
        content: `<p>L'ASC Zone de Tir est heureuse d'annoncer l'ouverture de la saison sportive 2024. Cette nouvelle saison promet d'être riche en événements et compétitions.</p>
        <p>Au programme : des compétitions régionales, des stages de perfectionnement et de nombreuses activités culturelles pour tous nos membres.</p>
        <p>Les inscriptions sont ouvertes dès maintenant. N'hésitez pas à nous rejoindre !</p>`,
        excerpt: 'L\'ASC Zone de Tir lance sa saison sportive 2024 avec de nombreux événements au programme.',
        category: 'sport',
        author: admin._id,
        status: 'published',
        publishedAt: new Date(),
        isFeatured: true,
        tags: ['saison', 'compétition', 'inscription'],
      },
      {
        title: 'Championnat national : nos athlètes brillent',
        content: `<p>Nos athlètes ont brillé lors du championnat national de tir sportif qui s'est tenu le week-end dernier à Dakar.</p>
        <p>Amadou Diallo a remporté la médaille d'or en carabine 10m, tandis que Fatou Sow s'est classée 2ème au pistolet.</p>
        <p>Félicitations à tous nos participants pour ces excellents résultats !</p>`,
        excerpt: 'Nos athlètes remportent plusieurs médailles au championnat national.',
        category: 'sport',
        author: moderateur._id,
        status: 'published',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['championnat', 'médailles', 'victoire'],
      },
      {
        title: 'Journée culturelle : un franc succès',
        content: `<p>La journée culturelle organisée par l'association a été un véritable succès avec plus de 200 participants.</p>
        <p>Au programme : expositions, démonstrations de tir, spectacles et animations pour toute la famille.</p>`,
        excerpt: 'Plus de 200 personnes ont participé à notre journée culturelle.',
        category: 'culture',
        author: admin._id,
        status: 'published',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isFeatured: true,
        tags: ['culture', 'événement', 'famille'],
      },
      {
        title: 'Nouveau partenariat avec la Fédération de Tir',
        content: `<p>L'ASC Zone de Tir est fière d'annoncer son nouveau partenariat avec la Fédération Sénégalaise de Tir Sportif.</p>
        <p>Ce partenariat permettra d'améliorer nos infrastructures et d'organiser davantage de compétitions de niveau national.</p>`,
        excerpt: 'Un nouveau partenariat pour développer le tir sportif au Sénégal.',
        category: 'vie-associative',
        author: admin._id,
        status: 'published',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        tags: ['partenariat', 'fédération'],
      },
    ]);

    console.log(`✅ ${articles.length} articles créés\n`);

    // ==================== ÉVÉNEMENTS ====================
    console.log('📅 Création des événements...');

    const events = await Event.create([
      {
        title: 'Compétition mensuelle de tir',
        description: 'Compétition ouverte à tous les membres. Plusieurs catégories : carabine, pistolet, tir de précision.',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
        eventType: 'competition',
        category: 'sport',
        location: {
          name: 'Stand de tir ASC',
          address: 'Zone de Tir, Route de Rufisque',
          city: 'Dakar',
        },
        maxParticipants: 50,
        registrationRequired: true,
        registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        price: 5000,
        isPublic: true,
        isFeatured: true,
        createdBy: admin._id,
      },
      {
        title: 'Stage de perfectionnement',
        description: 'Stage de perfectionnement pour les tireurs de niveau intermédiaire et avancé. Encadrement par des entraîneurs qualifiés.',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
        eventType: 'training',
        category: 'sport',
        location: {
          name: 'Stand de tir ASC',
          address: 'Zone de Tir',
          city: 'Dakar',
        },
        maxParticipants: 20,
        registrationRequired: true,
        registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        price: 15000,
        isPublic: true,
        createdBy: moderateur._id,
      },
      {
        title: 'Assemblée Générale 2024',
        description: 'Assemblée générale annuelle de l\'association. Ordre du jour : bilan de l\'année, projets futurs, élection du bureau.',
        startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        eventType: 'meeting',
        category: 'mixte',
        location: {
          name: 'Salle de conférence',
          address: 'Siège de l\'association',
          city: 'Dakar',
        },
        registrationRequired: false,
        isPublic: false,
        createdBy: admin._id,
      },
      {
        title: 'Soirée culturelle de fin d\'année',
        description: 'Soirée festive pour clôturer l\'année en beauté. Spectacles, animations, tombola et restauration.',
        startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        eventType: 'cultural',
        category: 'culture',
        location: {
          name: 'Jardin de l\'association',
          city: 'Dakar',
        },
        maxParticipants: 150,
        registrationRequired: true,
        price: 10000,
        isPublic: true,
        isFeatured: true,
        createdBy: admin._id,
      },
    ]);

    console.log(`✅ ${events.length} événements créés\n`);

    // ==================== RÉSULTATS ====================
    console.log('🏆 Création des résultats...');

    const results = await Result.create([
      {
        competition: {
          name: 'Championnat National de Tir Sportif 2024',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          location: 'Dakar',
          level: 'national',
        },
        discipline: 'Carabine 10m',
        category: 'Senior Hommes',
        rankings: [
          {
            position: 1,
            athlete: membres[0]._id,
            athleteName: 'Amadou Diallo',
            score: '598.5',
            points: 100,
          },
          {
            position: 3,
            athleteName: 'Moussa Ndiaye',
            score: '593.2',
            points: 80,
          },
        ],
        status: 'final',
        addedBy: admin._id,
      },
      {
        competition: {
          name: 'Championnat National de Tir Sportif 2024',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          location: 'Dakar',
          level: 'national',
        },
        discipline: 'Pistolet 10m',
        category: 'Senior Dames',
        rankings: [
          {
            position: 2,
            athlete: membres[1]._id,
            athleteName: 'Fatou Sow',
            score: '385.7',
            points: 90,
          },
        ],
        status: 'final',
        addedBy: admin._id,
      },
    ]);

    console.log(`✅ ${results.length} résultats créés\n`);

    // ==================== GALERIES ====================
    console.log('🖼️  Création des galeries...');

    const galleries = await Gallery.create([
      {
        title: 'Championnat National 2024',
        description: 'Photos du championnat national de tir sportif',
        type: 'photo',
        items: [
          {
            url: 'https://placehold.co/800x600/1e40af/white?text=Photo+1',
            caption: 'Podium carabine 10m',
            order: 1,
          },
          {
            url: 'https://placehold.co/800x600/1e40af/white?text=Photo+2',
            caption: 'Compétition en cours',
            order: 2,
          },
        ],
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isPublic: true,
        isFeatured: true,
        tags: ['championnat', 'compétition'],
        createdBy: moderateur._id,
      },
      {
        title: 'Journée culturelle 2024',
        description: 'Moments forts de notre journée culturelle',
        type: 'photo',
        items: [
          {
            url: 'https://placehold.co/800x600/f59e0b/white?text=Culture+1',
            caption: 'Spectacle traditionnel',
            order: 1,
          },
        ],
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isPublic: true,
        tags: ['culture', 'événement'],
        createdBy: admin._id,
      },
    ]);

    console.log(`✅ ${galleries.length} galeries créées\n`);

    // ==================== RÉSUMÉ ====================
    console.log('\n📊 RÉSUMÉ DU SEEDING');
    console.log('='.repeat(50));
    console.log(`👥 Utilisateurs : ${await User.countDocuments()}`);
    console.log(`📰 Articles : ${await Article.countDocuments()}`);
    console.log(`📅 Événements : ${await Event.countDocuments()}`);
    console.log(`🏆 Résultats : ${await Result.countDocuments()}`);
    console.log(`🖼️  Galeries : ${await Gallery.countDocuments()}`);
    console.log('='.repeat(50));

    console.log('\n✅ SEEDING TERMINÉ AVEC SUCCÈS !\n');

    console.log('📝 COMPTES DE TEST :');
    console.log('─'.repeat(50));
    console.log('🔑 Admin :');
    console.log('   Email    : admin@asczondetir.sn');
    console.log('   Password : Admin123!');
    console.log('');
    console.log('🔑 Modérateur :');
    console.log('   Email    : moderateur@asczondetir.sn');
    console.log('   Password : Modo123!');
    console.log('');
    console.log('🔑 Membre :');
    console.log('   Email    : amadou.diallo@example.com');
    console.log('   Password : Member123!');
    console.log('─'.repeat(50));

    console.log('\n🚀 Vous pouvez maintenant démarrer l\'application avec : npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR LORS DU SEEDING :', error);
    process.exit(1);
  }
};

seedDatabase();
