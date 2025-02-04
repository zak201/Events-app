require('dotenv').config({ path: '.env.local' });
const { dbConnect } = require('../lib/dbConnect');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    await dbConnect();
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: 'z.anouar832@gmail.com' });
    if (existingUser) {
      console.log('Mise à jour du mot de passe de l\'utilisateur existant');
      const hashedPassword = await bcrypt.hash('test123', 10);
      await User.updateOne(
        { email: 'z.anouar832@gmail.com' },
        { $set: { password: hashedPassword } }
      );
    } else {
      console.log('Création d\'un nouvel utilisateur test');
      const hashedPassword = await bcrypt.hash('test123', 10);
      await User.create({
        name: 'ANOUAR Zakaria',
        email: 'z.anouar832@gmail.com',
        password: hashedPassword,
        role: 'utilisateur'
      });
    }
    
    // Vérifier l'utilisateur
    const user = await User.findOne({ email: 'z.anouar832@gmail.com' }).select('+password');
    console.log('Utilisateur:', {
      id: user._id,
      email: user.email,
      role: user.role,
      passwordHash: user.password
    });
  } catch (error) {
    console.error('Erreur:', error);
  }
  process.exit(0);
}

createTestUser(); 