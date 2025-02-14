import { dbConnect } from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';
import Event from '@/models/Event';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { reservationSchema } from '@/lib/validations/reservation';
import mongoose from 'mongoose';

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
    const searchParams = new URL(request.url).searchParams;
    let query = {};

    // Filtres selon le rôle et les paramètres
    if (session.user.role === 'organisateur') {
      if (searchParams.has('eventId')) {
        query.eventId = searchParams.get('eventId');
      } else {
        const userEvents = await Event.find({ organizerId: session.user.id });
        const eventIds = userEvents.map(event => event._id);
        query.eventId = { $in: eventIds };
      }
    } else {
      query.userId = session.user.id;
    }

    const reservations = await Reservation.find(query)
      .populate('eventId')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Erreur récupération réservations:', error);
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
    const body = await request.json();
    const validatedData = reservationSchema.parse(body);

    const event = await Event.findById(validatedData.eventId);
    if (!event) {
      return NextResponse.json(
        { message: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier la disponibilité
    if (event.reservedSeats + validatedData.seats > event.totalSeats) {
      return NextResponse.json(
        { message: 'Plus de places disponibles' },
        { status: 400 }
      );
    }

    const reservation = new Reservation({
      ...validatedData,
      userId: session.user.id,
      status: 'confirmed'
    });

    await reservation.save();
    await Event.findByIdAndUpdate(event._id, {
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