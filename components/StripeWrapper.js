'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ReservationForm from './ReservationForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#0570de',
    colorBackground: '#ffffff',
    colorText: '#30313d',
    colorDanger: '#df1b41',
    fontFamily: 'system-ui, sans-serif',
    borderRadius: '4px',
  }
};

export default function StripeWrapper({ event, userSession }) {
  const options = {
    mode: 'payment',
    amount: event.price * 100,
    currency: 'eur',
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <ReservationForm event={event} userSession={userSession} />
    </Elements>
  );
} 