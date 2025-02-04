const { dbConnect } = require('../lib/dbConnect');
const User = require('../models/User');

async function checkUser() {
  try {
    await dbConnect();
    const user = await User.findOne({ email: 'z.anouar832@gmail.com' });
    console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');
    if (user) {
      console.log('Détails:', {
        id: user._id,
        email: user.email,
        role: user.role
      });
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
  process.exit(0);
}

checkUser(); 