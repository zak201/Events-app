'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CardElement, useStripe, useElements } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast';

export default function PaymentForm({ event, reservationData, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Créer l'intention de paiement
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event._id,
          tickets: reservationData.tickets,
          userDetails: reservationData.userDetails
        }),
      });

      const { clientSecret } = await response.json();

      // Confirmer le paiement
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${reservationData.userDetails.firstName} ${reservationData.userDetails.lastName}`,
            email: reservationData.userDetails.email,
            phone: reservationData.userDetails.phone,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Créer la réservation
        const reservationResponse = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: event._id,
            ...reservationData,
            paymentIntentId: paymentIntent.id,
          }),
        });

        if (reservationResponse.ok) {
          toast.success('Réservation confirmée !');
          window.location.href = `/events/${event._id}/confirmation`;
        } else {
          toast.error('Erreur lors de la création de la réservation');
        }
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Paiement</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        <div className="flex gap-4">
          <motion.button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            Retour
          </motion.button>

          <motion.button
            type="submit"
            disabled={!stripe || isProcessing}
            className="flex-1 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:bg-gray-400"
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? 'Traitement...' : `Payer ${event.price * reservationData.tickets}€`}
          </motion.button>
        </div>
      </form>
    </div>
  );
} 