import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'organisateur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const events = await Event.find({ organizerId: session.user.id })
      .sort({ date: -1 });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Erreur récupération événements:', error);
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 