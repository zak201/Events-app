import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  seats: { 
    type: Number, 
    required: true,
    min: 1
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

export default mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema); 