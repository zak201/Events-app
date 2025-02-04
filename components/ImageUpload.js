'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function ImageUpload({ onUpload, defaultImage }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(defaultImage);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      setPreview(data.secure_url);
      onUpload(data.secure_url);
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-48 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
            <button
              onClick={() => {
                setPreview('');
                onUpload('');
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">
              {uploading ? 'Téléchargement...' : 'Cliquez pour télécharger'}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  );
} 