import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { eventId, tickets, userDetails } = await request.json();

    await dbConnect();
    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json(
        { message: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier la disponibilité
    const availableSeats = event.capacity - event.reservedSeats;
    if (tickets > availableSeats) {
      return NextResponse.json(
        { message: 'Plus assez de places disponibles' },
        { status: 400 }
      );
    }

    // Créer l'intention de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: event.price * tickets * 100, // Stripe utilise les centimes
      currency: 'eur',
      metadata: {
        eventId: event._id.toString(),
        tickets: tickets.toString(),
        userId: session.user.id,
      },
      receipt_email: userDetails.email,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Erreur création payment intent:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
} 