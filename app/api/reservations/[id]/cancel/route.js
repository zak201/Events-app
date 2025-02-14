import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';
import Event from '@/models/Event';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const reservation = await Reservation.findOne({
      _id: params.id,
      userId: session.user.id,
      status: { $in: ['pending', 'confirmed'] }  // Permet l'annulation des réservations confirmées
    }).populate('eventId');

    if (!reservation) {
      return NextResponse.json(
        { message: 'Réservation non trouvée ou ne peut pas être annulée' },
        { status: 404 }
      );
    }

    // Vérifier si l'événement n'est pas déjà passé
    if (new Date(reservation.eventId.date) < new Date()) {
      return NextResponse.json(
        { message: 'Impossible d\'annuler une réservation pour un événement passé' },
        { status: 400 }
      );
    }

    // Mettre à jour le statut de la réservation
    reservation.status = 'cancelled';
    await reservation.save();

    // Mettre à jour le nombre de places disponibles
    await Event.findByIdAndUpdate(reservation.eventId._id, {
      $inc: { reservedSeats: -reservation.seats }
    });

    return NextResponse.json({
      message: 'Réservation annulée avec succès'
    });
  } catch (error) {
    console.error('Erreur annulation réservation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'annulation de la réservation' },
      { status: 500 }
    );
  }
} 