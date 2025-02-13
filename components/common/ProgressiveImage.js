'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';

export default function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { imageSrc, loading, error } = useOptimizedImage(src, {
    width: width || 800
  });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (error) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-800 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Erreur de chargement
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Image de faible qualité en placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}

      <AnimatePresence>
        {imageSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={imageSrc}
              alt={alt}
              width={width}
              height={height}
              onLoad={handleLoad}
              priority={priority}
              {...props}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 