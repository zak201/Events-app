'use client';

import { useState, useEffect } from 'react';

export function useOptimizedImage(src, options = {}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    width = 800,
    quality = 75,
    format = 'webp'
  } = options;

  useEffect(() => {
    if (!src) return;

    const loadImage = async () => {
      try {
        setLoading(true);
        
        // Construire l'URL optimisée pour Cloudinary
        const optimizedSrc = src.includes('cloudinary') 
          ? src.replace('/upload/', `/upload/w_${width},q_${quality},f_${format}/`)
          : src;

        // Précharger l'image
        const img = new Image();
        img.src = optimizedSrc;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        setImageSrc(optimizedSrc);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [src, width, quality, format]);

  return { imageSrc, loading, error };
} 