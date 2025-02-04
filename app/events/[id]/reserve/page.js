'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ReservationForm from '@/components/ReservationForm';

export default function ReservePage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push(`/auth/login?callbackUrl=/events/${params.id}/reserve`);
      return;
    }

    if (session.user.role === 'organisateur') {
      router.push(`/events/${params.id}`);
    }
  }, [session, status, router, params.id]);

  if (status === 'loading' || !session || session.user.role === 'organisateur') {
    return <div>Chargement...</div>;
  }

  return (
    <ReservationForm 
      eventId={params.id}
      userEmail={session.user.email}
      userName={session.user.name}
    />
  );
} 