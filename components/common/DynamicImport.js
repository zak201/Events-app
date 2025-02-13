'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const defaultLoadingComponent = (
  <div className="w-full h-48 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl" />
);

export function createDynamicComponent(importFn, options = {}) {
  const {
    ssr = false,
    loading = defaultLoadingComponent,
    ...dynamicOptions
  } = options;

  const DynamicComponent = dynamic(importFn, {
    ssr,
    loading: () => loading,
    ...dynamicOptions
  });

  return function DynamicWrapper(props) {
    return (
      <Suspense fallback={loading}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DynamicComponent {...props} />
        </motion.div>
      </Suspense>
    );
  };
} 