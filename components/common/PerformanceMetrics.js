'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        
        setMetrics((prev) => ({
          ...prev,
          lcp: lcpEntry.startTime,
        }));
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Mesurer le FCP
      const fcpObserver = new PerformanceObserver((list) => {
        const entry = list.getEntries()[0];
        setMetrics((prev) => ({
          ...prev,
          fcp: entry.startTime,
        }));
      });

      fcpObserver.observe({ entryTypes: ['paint'] });

      return () => {
        observer.disconnect();
        fcpObserver.disconnect();
      };
    }
  }, []);

  if (!metrics || process.env.NODE_ENV !== 'development') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-sm"
    >
      <div>FCP: {Math.round(metrics.fcp)}ms</div>
      <div>LCP: {Math.round(metrics.lcp)}ms</div>
    </motion.div>
  );
} 