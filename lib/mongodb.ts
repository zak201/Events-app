import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Veuillez ajouter votre URI Mongo à .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // En développement, utilisez une variable globale pour que la connexion
  // soit réutilisée
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // En production, il est préférable de ne pas utiliser une variable globale
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise; 