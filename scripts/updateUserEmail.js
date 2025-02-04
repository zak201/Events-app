require('dotenv').config({ path: '.env.local' });
const { dbConnect } = require('../lib/dbConnect');
const User = require('../models/User');

async function updateUserEmail() {
  try {
    await dbConnect();
    const result = await User.findOneAndUpdate(
      { email: 'z.anouar832@icloud.com' },
      { email: 'z.anouar@icloud.com' },
      { new: true }
    );
    console.log('Email mis à jour :', result);
  } catch (error) {
    console.error('Erreur:', error);
  }
  process.exit(0);
}

updateUserEmail(); 