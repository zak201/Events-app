import { dbConnect } from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';
import Event from '@/models/Event';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { reservationSchema } from '@/lib/validations/reservation';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    const reservations = await Reservation.find({ userId: session.user.id })
      .populate('eventId')
      .sort({ createdAt: -1 });

    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    const data = await request.json();
    
    // Valider les données
    const validatedData = reservationSchema.parse(data);

    // Vérifier l'événement et la disponibilité
    const event = await Event.findById(validatedData.eventId);
    if (!event) {
      return NextResponse.json(
        { message: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    const availableSeats = event.capacity - event.reservedSeats;
    if (validatedData.seats > availableSeats) {
      return NextResponse.json(
        { message: 'Plus assez de places disponibles' },
        { status: 400 }
      );
    }

    // Créer la réservation
    const reservation = await Reservation.create({
      ...validatedData,
      userId: session.user.id,
      status: 'confirmed'
    });

    // Mettre à jour le nombre de places réservées
    await Event.findByIdAndUpdate(validatedData.eventId, {
      $inc: { reservedSeats: validatedData.seats }
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('Erreur création réservation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de la réservation' },
      { status: 500 }
    );
  }
} 