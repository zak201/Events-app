require('dotenv').config({ path: '.env.local' });
const { dbConnect } = require('../lib/dbConnect');
const User = require('../models/User');

async function listUsers() {
  try {
    await dbConnect();
    const users = await User.find({}).select('+password');
    console.log('Liste des utilisateurs :');
    users.forEach(user => {
      console.log({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password // Le hash du mot de passe
      });
    });
  } catch (error) {
    console.error('Erreur:', error);
  }
  process.exit(0);
}

listUsers(); 