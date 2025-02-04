import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';
import Event from '@/models/Event';
import { authOptions } from '../../auth/[...nextauth]/route';
import { updateReservationSchema } from '@/lib/validations/reservation';

export async function PUT(request, { params }) {
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
    const validatedData = updateReservationSchema.parse(data);

    const reservation = await Reservation.findOneAndUpdate(
      {
        _id: params.id,
        userId: session.user.id,
      },
      { status: validatedData.status },
      { new: true }
    );

    if (!reservation) {
      return NextResponse.json(
        { message: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour le nombre de places réservées de l'événement
    await Event.updateReservedSeats(reservation.eventId);

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la réservation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    const reservation = await Reservation.findOneAndUpdate(
      {
        _id: params.id,
        userId: session.user.id,
        status: 'confirmed'
      },
      { status: 'cancelled' },
      { new: true }
    );

    if (!reservation) {
      return NextResponse.json(
        { message: 'Réservation non trouvée ou déjà annulée' },
        { status: 404 }
      );
    }

    await Event.updateReservedSeats(reservation.eventId);

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de l\'annulation de la réservation' },
      { status: 500 }
    );
  }
} 