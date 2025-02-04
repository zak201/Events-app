export function generateReservationsCSV(reservations) {
  // En-têtes du CSV
  const headers = [
    'Prénom',
    'Nom',
    'Email',
    'Places',
    'Statut',
    'Date de réservation'
  ].join(',');

  // Lignes de données
  const rows = reservations.map(reservation => {
    return [
      reservation.firstName,
      reservation.lastName,
      reservation.email,
      reservation.seats,
      reservation.status,
      new Date(reservation.createdAt).toLocaleString('fr-FR')
    ].map(field => `"${field}"`).join(',');
  });

  return [headers, ...rows].join('\n');
} 