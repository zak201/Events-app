'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { toast } from 'react-hot-toast';

const eventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  date: z.string().min(1, 'La date est requise'),
  location: z.string().min(1, 'Le lieu est requis'),
  description: z.string().min(1, 'La description est requise'),
  capacity: z.preprocess(
    (val) => parseInt(val, 10), 
    z.number().min(1, 'La capacité doit être d\'au moins 1 personne')
  ),
});

export default function EditEventModal({ event, isOpen, onClose, onEventUpdated }) {
  const modalRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(event.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useOnClickOutside(modalRef, onClose);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location,
      description: event.description,
      capacity: event.capacity,
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`/api/events/${event._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          imageUrl,
        }),
      });

      if (response.ok) {
        onEventUpdated();
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="modal-overlay" />
      <div className="modal-container">
        <div ref={modalRef} className="modal-content">
          <button 
            onClick={onClose}
            className="modal-close-button"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="modal-header">
            <h2 className="text-xl font-semibold">Modifier l'événement</h2>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 
                          text-red-600 dark:text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Titre</label>
              <input
                {...register('title')}
                className="form-input"
                placeholder="Nom de l'événement"
              />
              {errors.title && (
                <p className="form-error">{errors.title.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Date et heure</label>
              <input
                type="datetime-local"
                {...register('date')}
                className="form-input"
              />
              {errors.date && (
                <p className="form-error">{errors.date.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Lieu</label>
              <input
                {...register('location')}
                className="form-input"
              />
              {errors.location && (
                <p className="form-error">{errors.location.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Nombre de places</label>
              <input
                type="number"
                min="1"
                {...register('capacity')}
                className="form-input"
              />
              {errors.capacity && (
                <p className="form-error">{errors.capacity.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                {...register('description')}
                className="form-input"
                rows="4"
              />
              {errors.description && (
                <p className="form-error">{errors.description.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Image</label>
              <CldUploadWidget
                uploadPreset="events_preset"
                onSuccess={(result) => setImageUrl(result.info.secure_url)}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={open}
                    className="btn btn-secondary"
                  >
                    Modifier l'image
                  </button>
                )}
              </CldUploadWidget>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="mt-2 h-32 object-cover rounded"
                />
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Modification...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 