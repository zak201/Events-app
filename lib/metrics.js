export const PERFORMANCE_MARKS = {
  APP_START: 'app-start',
  HYDRATION_START: 'hydration-start',
  HYDRATION_END: 'hydration-end',
  ROUTE_CHANGE_START: 'route-change-start',
  ROUTE_CHANGE_END: 'route-change-end',
};

export function markPerformance(markName, data = {}) {
  if (typeof performance !== 'undefined') {
    performance.mark(markName, { detail: data });
  }
}

export function measurePerformance(startMark, endMark) {
  if (typeof performance !== 'undefined') {
    try {
      const measure = performance.measure(
        `${startMark} to ${endMark}`,
        startMark,
        endMark
      );
      return measure.duration;
    } catch (error) {
      console.error('Error measuring performance:', error);
      return null;
    }
  }
  return null;
} 