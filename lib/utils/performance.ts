/**
 * Performance Analytics Utilities
 * Decoupled logic for testing averages and trends.
 */

export interface LatencyPoint {
  timestamp: number;
  apiLatency: number;
  uiLatency: number;
  avgLatency: number;
  totalTests: number;
  runId: string;
}

/**
 * Calculates current averages from raw Allure annotation data.
 */
export function calculateAverages(points: Array<{ category: string, value: number }>) {
  let totalApi = 0;
  let apiCount = 0;
  let totalUi = 0;
  let uiCount = 0;

  points.forEach(p => {
    if (p.category === 'API') {
      totalApi += p.value;
      apiCount++;
    } else if (p.category === 'UI') {
      totalUi += p.value;
      uiCount++;
    }
  });

  return {
    apiAvg: apiCount > 0 ? (totalApi / apiCount) : 0,
    uiAvg: uiCount > 0 ? (totalUi / uiCount) : 0
  };
}

/**
 * Maintains the circular history buffer (max 20 points).
 */
export function syncHistory(history: LatencyPoint[], newPoint: LatencyPoint, limit: number = 20): LatencyPoint[] {
  const updated = [newPoint, ...history];
  return updated.slice(0, limit);
}
