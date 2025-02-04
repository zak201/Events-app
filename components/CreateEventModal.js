'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '@/lib/validations/event';
import { createEvent } from '@/lib/api';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import Image from 'next/image';
import { uploadImage } from '@/lib/uploadImage';

export default function CreateEventModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      capacity: 1
    },
    mode: 'onChange' // Validation en temps réel
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await createEvent({
        ...data,
        imageUrl,
      });

      toast.success('Événement créé avec succès');
      reset();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer un événement">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="label">Titre</label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className="input"
          />
          {errors.title && (
            <p className="error">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="label">Date</label>
          <input
            {...register('date')}
            type="datetime-local"
            id="date"
            className="input"
          />
          {errors.date && (
            <p className="error">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="label">Lieu</label>
          <input
            {...register('location')}
            type="text"
            id="location"
            className="input"
          />
          {errors.location && (
            <p className="error">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="capacity" className="label">Capacité</label>
          <input
            {...register('capacity')}
            type="number"
            id="capacity"
            min="1"
            className="input"
          />
          {errors.capacity && (
            <p className="error">{errors.capacity.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea
            {...register('description')}
            id="description"
            className="input"
            rows={4}
          />
          {errors.description && (
            <p className="error">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="label">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="input"
          />
          {imagePreview && (
            <div className="mt-2 relative h-40 w-full">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover rounded"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
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
            disabled={isSubmitting || !isValid}
            className="btn btn-primary relative"
          >
            {isSubmitting ? (
              <>
                <span className="opacity-0">Créer</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              </>
            ) : (
              'Créer'
            )}
          </button>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="text-red-500 text-sm mt-2">
            Veuillez corriger les erreurs dans le formulaire
          </div>
        )}
      </form>
    </Modal>
  );
} 