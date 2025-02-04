import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReservationConfirmation(reservation, event) {
  try {
    await resend.emails.send({
      from: 'EventsApp <noreply@votredomaine.com>',
      to: reservation.email,
      subject: `Réservation confirmée pour ${event.title}`,
      html: `
        <h1>Votre réservation est confirmée !</h1>
        <p>Bonjour ${reservation.firstName},</p>
        <p>Votre réservation pour <strong>${event.title}</strong> a été confirmée.</p>
        <p>Détails de la réservation :</p>
        <ul>
          <li>Date : ${new Date(event.date).toLocaleDateString('fr-FR')}</li>
          <li>Lieu : ${event.location}</li>
          <li>Nombre de places : ${reservation.seats}</li>
        </ul>
        <p>À bientôt !</p>
      `,
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
}

export async function sendReservationUpdate(reservation, event) {
  const statusMessages = {
    confirmed: 'confirmée',
    cancelled: 'annulée',
    pending: 'en attente'
  };

  try {
    await resend.emails.send({
      from: 'EventsApp <noreply@votredomaine.com>',
      to: reservation.email,
      subject: `Mise à jour de votre réservation pour ${event.title}`,
      html: `
        <h1>Mise à jour de votre réservation</h1>
        <p>Bonjour ${reservation.firstName},</p>
        <p>Votre réservation pour <strong>${event.title}</strong> est maintenant ${statusMessages[reservation.status]}.</p>
        <p>Détails de la réservation :</p>
        <ul>
          <li>Date : ${new Date(event.date).toLocaleDateString('fr-FR')}</li>
          <li>Lieu : ${event.location}</li>
          <li>Nombre de places : ${reservation.seats}</li>
          <li>Statut : ${statusMessages[reservation.status]}</li>
        </ul>
        <p>À bientôt !</p>
      `,
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
} 