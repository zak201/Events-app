import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'La date est requise'],
  },
  location: {
    type: String,
    required: [true, 'Le lieu est requis'],
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, 'La capacité est requise'],
    min: [1, 'La capacité minimum est de 1'],
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'organisateur est requis'],
  },
  reservedSeats: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  toJSON: { virtuals: true }, // Pour inclure les virtuals lors de la conversion en JSON
  toObject: { virtuals: true }
});

// Méthode pour vérifier la disponibilité
eventSchema.methods.hasAvailableSeats = function(requestedSeats) {
  return this.reservedSeats + requestedSeats <= this.capacity;
};

// Middleware pour mettre à jour le nombre de places réservées
eventSchema.statics.updateReservedSeats = async function(eventId) {
  const reservations = await mongoose.model('Reservation').find({
    eventId,
    status: 'confirmed'
  });
  
  const totalReservedSeats = reservations.reduce((sum, res) => sum + res.seats, 0);
  
  await this.findByIdAndUpdate(eventId, {
    reservedSeats: totalReservedSeats
  });
};

// Vérifier si le modèle existe déjà pour éviter l'erreur de compilation
const Event = mongoose.models?.Event || mongoose.model('Event', eventSchema);

export default Event; 