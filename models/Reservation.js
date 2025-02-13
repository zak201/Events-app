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
  paymentIntentId: String,
  validated: {
    type: Boolean,
    default: false
  },
  validatedAt: Date,
  userDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour améliorer les performances des requêtes
reservationSchema.index({ eventId: 1, userId: 1 });

export default mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema); 