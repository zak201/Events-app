export function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function catchErrors(error) {
  console.error('Error:', error);
  return {
    message: error?.response?.data?.message || error.message || 'Une erreur est survenue'
  };
}

export function serializeDocument(doc) {
  const serialized = JSON.parse(JSON.stringify(doc));
  
  // S'assurer que l'ID est disponible dans les deux formats
  if (serialized._id) {
    serialized.id = serialized._id.toString();
  }
  
  // Convertir les dates en strings
  if (serialized.date) {
    serialized.date = new Date(serialized.date).toISOString();
  }
  if (serialized.createdAt) {
    serialized.createdAt = new Date(serialized.createdAt).toISOString();
  }
  if (serialized.updatedAt) {
    serialized.updatedAt = new Date(serialized.updatedAt).toISOString();
  }
  
  return serialized;
}

export function formatEventDate(date) {
  return format(new Date(date), 'EEEE d MMMM yyyy à HH:mm', { locale: fr });
} 