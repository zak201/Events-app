'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Elements } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ChevronRight, CreditCard, Ticket, User } from 'lucide-react';
import TicketSelection from './reservation/TicketSelection';
import UserDetails from './reservation/UserDetails';
import PaymentForm from './reservation/PaymentForm';
import ReservationSummary from './reservation/ReservationSummary';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const steps = [
  { id: 'tickets', title: 'Billets', icon: Ticket },
  { id: 'details', title: 'Coordonnées', icon: User },
  { id: 'payment', title: 'Paiement', icon: CreditCard },
];

export default function ReservationProcess({ event, userSession }) {
  const [currentStep, setCurrentStep] = useState('tickets');
  const [reservationData, setReservationData] = useState({
    tickets: 1,
    userDetails: {
      firstName: userSession?.user?.name?.split(' ')[0] || '',
      lastName: userSession?.user?.name?.split(' ')[1] || '',
      email: userSession?.user?.email || '',
      phone: ''
    },
    status: 'confirmed'
  });

  const updateReservationData = (step, data) => {
    setReservationData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 'tickets':
        return reservationData.tickets > 0 && 
               reservationData.tickets <= (event.totalSeats - event.reservedSeats);
      case 'details':
        return reservationData.userDetails.firstName && 
               reservationData.userDetails.lastName && 
               reservationData.userDetails.email;
      default:
        return true;
    }
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1 && validateStep(currentStep)) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Étapes du processus */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center ${
                currentStep === step.id 
                  ? 'text-primary-600' 
                  : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step.id 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <span className="ml-2 font-medium">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 mx-4 text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenu de l'étape courante */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 'tickets' && (
            <TicketSelection
              event={event}
              value={reservationData.tickets}
              onChange={(tickets) => updateReservationData('tickets', tickets)}
              onNext={nextStep}
            />
          )}

          {currentStep === 'details' && (
            <UserDetails
              value={reservationData.userDetails}
              onChange={(details) => updateReservationData('userDetails', details)}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {currentStep === 'payment' && (
            <Elements stripe={stripePromise}>
              <PaymentForm
                event={event}
                reservationData={reservationData}
                onBack={prevStep}
              />
            </Elements>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Résumé de la réservation */}
      <div className="mt-8">
        <ReservationSummary
          event={event}
          reservationData={reservationData}
        />
      </div>
    </div>
  );
} 