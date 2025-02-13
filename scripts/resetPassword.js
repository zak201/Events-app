require('dotenv').config({ path: './.env.local' });
const { dbConnect } = require('../lib/dbConnect');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function resetPassword() {
  try {
    await dbConnect();
    
    const email = 'z.anouar832@icloud.com';
    const newPassword = '123456';
    
    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Mettre à jour l'utilisateur
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    ).select('+password');
    
    if (user) {
      console.log('Mot de passe réinitialisé pour:', email);
      
      // Vérifier que le nouveau mot de passe fonctionne
      const isValid = await bcrypt.compare(newPassword, user.password);
      console.log('Vérification du nouveau mot de passe:', isValid);
    } else {
      console.log('Utilisateur non trouvé');
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
  process.exit(0);
}

resetPassword(); 