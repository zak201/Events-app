import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';
import Event from '@/models/Event';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'organisateur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    const reservation = await Reservation.findById(params.id)
      .populate('eventId');

    if (!reservation) {
      return NextResponse.json(
        { message: 'Billet non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'événement est passé
    if (new Date(reservation.eventId.date) < new Date()) {
      return NextResponse.json(
        { message: 'L\'événement est déjà passé' },
        { status: 400 }
      );
    }

    if (reservation.validated) {
      return NextResponse.json(
        { message: 'Ce billet a déjà été validé' },
        { status: 400 }
      );
    }

    if (reservation.status !== 'confirmed') {
      return NextResponse.json(
        { message: 'Ce billet n\'est pas confirmé' },
        { status: 400 }
      );
    }

    reservation.validated = true;
    reservation.validatedAt = new Date();
    await reservation.save();

    return NextResponse.json({
      message: 'Billet validé avec succès',
      validatedAt: reservation.validatedAt
    });
  } catch (error) {
    console.error('Erreur validation billet:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la validation du billet' },
      { status: 500 }
    );
  }
} 