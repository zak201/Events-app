const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  seats: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
reservationSchema.index({ eventId: 1, userId: 1 });

module.exports = mongoose.models?.Reservation || mongoose.model('Reservation', reservationSchema); 