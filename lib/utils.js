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
  if (!doc) return null;
  
  const serialized = JSON.parse(JSON.stringify(doc));
  
  // Convertir _id en id string
  if (serialized._id) {
    serialized.id = serialized._id.toString();
    delete serialized._id;
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