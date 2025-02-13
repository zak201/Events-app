'use client';

import { useEffect } from 'react';
import FontFaceObserver from 'fontfaceobserver';

const fontConfig = [
  { family: 'Inter', weight: 400, url: '/fonts/Inter-Regular.ttf' },
  { family: 'Inter', weight: 500, url: '/fonts/Inter-Medium.ttf' },
  { family: 'Inter', weight: 700, url: '/fonts/Inter-Bold.ttf' },
];

export default function FontLoader() {
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const observers = fontConfig.map(({ family, weight }) => {
          const font = new FontFaceObserver(family, { weight });
          return font.load();
        });

        await Promise.all(observers);
        document.documentElement.classList.add('fonts-loaded');
      } catch (error) {
        console.error('Erreur chargement polices:', error);
      }
    };

    loadFonts();
  }, []);

  return null;
} 