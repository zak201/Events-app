import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    select: false,
  },
  role: {
    type: String,
    enum: ['utilisateur', 'organisateur'],
    default: 'utilisateur',
  },
}, {
  timestamps: true,
});

// Méthode simplifiée pour comparer les mots de passe (comparaison directe)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return this.password === candidatePassword;
};

const User = mongoose.models?.User || mongoose.model('User', userSchema);
export default User; 