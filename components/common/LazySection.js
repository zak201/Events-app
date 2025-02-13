'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export default function LazySection({ 
  children,
  threshold = 0.1,
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    threshold 
  });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isInView && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isInView, hasLoaded]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={hasLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
      {...props}
    >
      {hasLoaded ? children : <div className="h-48 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl" />}
    </motion.div>
  );
} 