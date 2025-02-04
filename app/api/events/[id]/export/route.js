import { dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import Reservation from '@/models/Reservation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateReservationsCSV } from '@/lib/csvUtils';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'organisateur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const reservations = await Reservation.find({ eventId: params.id })
      .sort({ createdAt: -1 });

    const csv = generateReservationsCSV(reservations);

    // Configurer les en-têtes pour le téléchargement
    const headers = new Headers();
    headers.append('Content-Type', 'text/csv');
    headers.append('Content-Disposition', 'attachment; filename=reservations.csv');

    return new NextResponse(csv, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Erreur lors de l\'export des réservations:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'export des réservations' },
      { status: 500 }
    );
  }
} 