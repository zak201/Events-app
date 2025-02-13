export const measurePerformance = (name) => {
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    console.log(`${name} took ${duration}ms`);
    
    // Envoyer les métriques à un service de monitoring
    if (process.env.NODE_ENV === 'production') {
      // sendMetrics({ name, duration });
    }
  };
};

export const withPerformanceTracking = (handler) => {
  return async (...args) => {
    const end = measurePerformance(`${handler.name}`);
    try {
      const result = await handler(...args);
      end();
      return result;
    } catch (error) {
      end();
      throw error;
    }
  };
}; 