require('dotenv').config();
const mongoose = require('mongoose');
const Activity = require('../models/Activity');

const activities = [
  // ACTIVITÉS SPORTIVES
  {
    title: 'Football',
    description: 'Le football est notre activité phare. Rejoignez nos équipes et participez à des compétitions locales et régionales. Entraînements réguliers pour tous les niveaux, des débutants aux joueurs expérimentés.',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop',
    icon: 'bi-trophy-fill',
    category: 'football',
    type: 'sportive',
    isActive: true,
    isFeatured: true,
    displayOrder: 1,
  },
  {
    title: 'Basketball',
    description: 'Développez vos compétences en basketball dans nos installations modernes. Entraînements techniques, matchs amicaux et compétitions inter-clubs vous attendent pour vivre votre passion.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
    icon: 'bi-circle-fill',
    category: 'basketball',
    type: 'sportive',
    isActive: true,
    isFeatured: true,
    displayOrder: 2,
  },
  {
    title: 'Handball',
    description: 'Le handball combine vitesse, agilité et esprit d\'équipe. Découvrez ce sport dynamique avec nos coachs qualifiés et participez à des tournois passionnants.',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600&fit=crop',
    icon: 'bi-hexagon-fill',
    category: 'autre',
    type: 'sportive',
    isActive: true,
    isFeatured: true,
    displayOrder: 3,
  },
  {
    title: 'Volleyball',
    description: 'Pratiquez le volleyball en salle ou sur terrain extérieur. Un sport qui allie technique, tactique et esprit d\'équipe dans une ambiance conviviale et compétitive.',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop',
    icon: 'bi-star-fill',
    category: 'volleyball',
    type: 'sportive',
    isActive: true,
    isFeatured: true,
    displayOrder: 4,
  },
  {
    title: 'Tir Sportif',
    description: 'Notre discipline emblématique ! Apprenez le tir sportif dans un environnement sécurisé avec des instructeurs certifiés. Précision, concentration et maîtrise de soi sont au rendez-vous.',
    image: 'https://images.unsplash.com/photo-1593444285553-28b0c6e55f1f?w=800&h=600&fit=crop',
    icon: 'bi-bullseye',
    category: 'tir',
    type: 'sportive',
    isActive: true,
    isFeatured: true,
    displayOrder: 5,
  },
  {
    title: 'Athlétisme',
    description: 'Course, saut, lancer... L\'athlétisme offre une multitude de disciplines pour développer votre endurance, votre vitesse et votre force dans un cadre motivant.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
    icon: 'bi-lightning-fill',
    category: 'athletisme',
    type: 'sportive',
    isActive: true,
    isFeatured: false,
    displayOrder: 6,
  },

  // ACTIVITÉS CULTURELLES
  {
    title: 'Danse Traditionnelle',
    description: 'Découvrez et pratiquez les danses traditionnelles sénégalaises. Sabar, Mbalax et autres danses africaines vous attendent pour célébrer notre riche patrimoine culturel.',
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop',
    icon: 'bi-music-note-beamed',
    category: 'danse',
    type: 'culturelle',
    isActive: true,
    isFeatured: true,
    displayOrder: 7,
  },
  {
    title: 'Théâtre',
    description: 'Exprimez-vous sur scène ! Notre troupe de théâtre propose des ateliers d\'expression dramatique et monte des pièces tout au long de l\'année. Débutants et confirmés bienvenus.',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop',
    icon: 'bi-mask',
    category: 'theatre',
    type: 'culturelle',
    isActive: true,
    isFeatured: true,
    displayOrder: 8,
  },
  {
    title: 'Musique & Percussions',
    description: 'Apprenez le djembé, le sabar et d\'autres instruments traditionnels. Des cours de musique moderne sont également disponibles. Venez créer votre mélodie !',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop',
    icon: 'bi-music-note-list',
    category: 'musique',
    type: 'culturelle',
    isActive: true,
    isFeatured: true,
    displayOrder: 9,
  },
  {
    title: 'Arts Plastiques',
    description: 'Peinture, sculpture, artisanat... Libérez votre créativité dans nos ateliers d\'arts plastiques. Expositions régulières pour valoriser les talents de nos membres.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
    icon: 'bi-palette-fill',
    category: 'arts',
    type: 'culturelle',
    isActive: true,
    isFeatured: true,
    displayOrder: 10,
  },
  {
    title: 'Conte & Littérature',
    description: 'Rencontres littéraires, contes traditionnels, ateliers d\'écriture... Plongez dans l\'univers des mots et partagez votre passion pour la littérature africaine.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
    icon: 'bi-book-fill',
    category: 'culture',
    type: 'culturelle',
    isActive: true,
    isFeatured: false,
    displayOrder: 11,
  },
  {
    title: 'Cinéma & Audiovisuel',
    description: 'Ciné-club, ateliers de réalisation, courts-métrages... Découvrez le 7ème art et participez à la création de contenus audiovisuels innovants.',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=600&fit=crop',
    icon: 'bi-camera-reels-fill',
    category: 'culture',
    type: 'culturelle',
    isActive: true,
    isFeatured: false,
    displayOrder: 12,
  },
];

async function seedActivities() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Supprimer les activités existantes
    await Activity.deleteMany({});
    console.log('🗑️  Activités existantes supprimées');

    // Créer les nouvelles activités
    const createdActivities = await Activity.insertMany(activities);
    console.log(`✅ ${createdActivities.length} activités créées avec succès`);

    console.log('\n📋 Activités créées:');
    createdActivities.forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.title} (${activity.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des activités:', error);
    process.exit(1);
  }
}

seedActivities();
