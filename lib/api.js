// Fonctions d'API pour les événements et réservations
export async function fetchEvents(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    
    if (filters.date) {
      queryParams.append('date', new Date(filters.date).toISOString());
    }

    const response = await fetch(`/api/events?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des événements');
    
    return response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

export async function createReservation(data) {
  const response = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la réservation');
  }
  
  return response.json();
}

export async function cancelReservation(reservationId) {
  const response = await fetch(`/api/reservations/${reservationId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de l\'annulation');
  }
  
  return response.json();
}

export async function updateProfile(data) {
  const response = await fetch('/api/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
  }
  
  return response.json();
}

export async function fetchUserReservations() {
  const response = await fetch('/api/reservations');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la récupération des réservations');
  }
  return response.json();
}

export async function createEvent(formData) {
  const response = await fetch('/api/events', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la création de l\'événement');
  }

  return response.json();
} 