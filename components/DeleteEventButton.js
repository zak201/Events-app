'use client';

export default function DeleteEventButton({ eventId, onDelete }) {
  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          onDelete(eventId);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn btn-danger"
      aria-label="Supprimer l'événement"
    >
      Supprimer
    </button>
  );
} 