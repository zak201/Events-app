import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  validated: {
    type: Boolean,
    default: false
  },
  validatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
reservationSchema.index({ eventId: 1, userId: 1 });

const Reservation = mongoose.models?.Reservation || mongoose.model('Reservation', reservationSchema);

export default Reservation; 