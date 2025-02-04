import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Veuillez ajouter votre URI Mongo à .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // En développement, utilisez une variable globale pour que la connexion
  // soit réutilisée
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // En production, il est préférable de ne pas utiliser une variable globale
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise; 