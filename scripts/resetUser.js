const { dbConnect } = require('../lib/dbConnect');
const User = require('../models/User');

async function resetUser() {
  try {
    await dbConnect();
    
    const email = 'z.anouar832@gmail.com';
    const password = '123456'; // Mot de passe en clair
    
    // Mettre à jour ou créer l'utilisateur
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name: 'ANOUAR Zakaria',
          password: password, // Stockage en clair
          role: 'utilisateur'
        }
      },
      { upsert: true, new: true }
    );
    
    console.log('Utilisateur réinitialisé avec succès:', {
      id: user._id,
      email: user.email,
      password: user.password, // Pour vérification
      role: user.role
    });
    
  } catch (error) {
    console.error('Erreur:', error);
  }
  process.exit(0);
}

resetUser(); 