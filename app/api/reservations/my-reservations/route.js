import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const reservations = await Reservation.find({ 
      userId: session.user.id 
    })
    .populate({
      path: 'eventId',
      model: Event
    })
    .sort({ createdAt: -1 })
    .lean();

    // Sérialiser les données pour éviter les erreurs de JSON
    const serializedReservations = reservations.map(reservation => ({
      ...reservation,
      _id: reservation._id.toString(),
      userId: reservation.userId.toString(),
      eventId: reservation.eventId ? {
        ...reservation.eventId,
        _id: reservation.eventId._id.toString(),
        organizerId: reservation.eventId.organizerId?.toString()
      } : null,
      createdAt: reservation.createdAt?.toISOString(),
      updatedAt: reservation.updatedAt?.toISOString(),
      validatedAt: reservation.validatedAt?.toISOString()
    }));

    return NextResponse.json(serializedReservations);
  } catch (error) {
    console.error('Erreur récupération réservations:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    );
  }
} 