import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Event from '@/models/Event';
import Reservation from '@/models/Reservation';
import Stripe from 'stripe';
import { sendReservationConfirmation } from '@/lib/emailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Erreur webhook:', err.message);
      return NextResponse.json(
        { message: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Gérer les différents types d'événements
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook:', error);
    return NextResponse.json(
      { message: 'Erreur lors du traitement du webhook' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent) {
  await dbConnect();

  const { eventId, tickets, userId } = paymentIntent.metadata;

  // Mettre à jour l'événement
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Événement non trouvé');

  // Créer la réservation
  const reservation = await Reservation.create({
    eventId,
    userId,
    seats: parseInt(tickets),
    status: 'confirmed',
    paymentIntentId: paymentIntent.id,
  });

  // Mettre à jour le nombre de places réservées
  await Event.findByIdAndUpdate(eventId, {
    $inc: { reservedSeats: parseInt(tickets) }
  });

  // Envoyer l'email de confirmation
  await sendReservationConfirmation(reservation, event);
}

async function handlePaymentFailure(paymentIntent) {
  // Gérer l'échec du paiement si nécessaire
  console.log('Échec du paiement:', paymentIntent.id);
} 