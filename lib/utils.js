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