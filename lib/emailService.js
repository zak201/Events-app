import { Resend } from 'resend';
import { formatDate } from './utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReservationConfirmation(reservation, event) {
  try {
    await resend.emails.send({
      from: 'Events App <noreply@votredomaine.com>',
      to: reservation.email,
      subject: `Confirmation de réservation - ${event.title}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .event-details { background: #f8f9fa; padding: 20px; border-radius: 8px; }
              .qr-code { text-align: center; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #6c757d; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Réservation confirmée !</h1>
                <p>Merci d'avoir réservé pour ${event.title}</p>
              </div>

              <div class="event-details">
                <h2>Détails de l'événement</h2>
                <p><strong>Date :</strong> ${formatDate(event.date)}</p>
                <p><strong>Lieu :</strong> ${event.location}</p>
                <p><strong>Nombre de places :</strong> ${reservation.seats}</p>
              </div>

              <div class="qr-code">
                <p>Votre QR Code de réservation :</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
                  process.env.NEXT_PUBLIC_APP_URL
                }/verify-ticket/${reservation._id}" alt="QR Code" />
              </div>

              <div class="footer">
                <p>À bientôt sur Events App !</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('Email de confirmation envoyé');
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