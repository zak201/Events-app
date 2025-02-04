require('dotenv').config({ path: '.env.local' });
const { dbConnect } = require('../lib/dbConnect');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function resetPassword() {
  try {
    await dbConnect();
    
    // Générer un nouveau hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456789', salt);
    
    const result = await User.findOneAndUpdate(
      { email: 'z.anouar832@icloud.com' },
      { password: hashedPassword },
      { new: true }
    ).select('+password');
    
    console.log('Mot de passe réinitialisé pour:', result.email);
    console.log('Nouveau hash:', result.password);
  } catch (error) {
    console.error('Erreur:', error);
  }
  process.exit(0);
}

resetPassword(); 