/** Build timestamp, fixed at module evaluation (build time for static routes). */
export const builtAt = new Date().toISOString().slice(0, 10);
