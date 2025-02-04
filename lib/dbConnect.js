const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI manquant dans les variables d\'environnement');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Utilisation de la connexion MongoDB existante');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('Création d\'une nouvelle connexion MongoDB');
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('Connexion MongoDB établie');
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('Erreur de connexion MongoDB:', e);
    throw e;
  }
}

module.exports = { dbConnect }; 