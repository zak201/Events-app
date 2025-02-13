require('dotenv').config({ path: './.env.local' });
const { dbConnect } = require('../lib/dbConnect');
const User = require('../models/User');

async function updateUserRole() {
  try {
    await dbConnect();
    
    const email = 'z.anouar832@icloud.com';
    
    // Vérifier le rôle actuel
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Utilisateur non trouvé');
      return;
    }

    console.log('Rôle actuel:', user.role);

    // Mettre à jour le rôle en 'organisateur'
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { role: 'organisateur' } },
      { new: true }
    );

    console.log('Utilisateur mis à jour:', {
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name
    });

  } catch (error) {
    console.error('Erreur:', error);
  }
  process.exit(0);
}

updateUserRole(); 