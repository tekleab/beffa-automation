import { describe, it, expect } from 'vitest';
import { calculateAverages, syncHistory, LatencyPoint } from '../../lib/utils/performance';

describe('Performance Utils', () => {
  describe('calculateAverages', () => {
    it('should correctly average API and UI latency', () => {
      const data = [
        { category: 'API', value: 100 },
        { category: 'API', value: 200 },
        { category: 'UI', value: 500 },
      ];
      const result = calculateAverages(data);
      expect(result.apiAvg).toBe(150);
      expect(result.uiAvg).toBe(500);
    });

    it('should handle empty categories', () => {
      const result = calculateAverages([]);
      expect(result.apiAvg).toBe(0);
      expect(result.uiAvg).toBe(0);
    });
  });

  describe('syncHistory', () => {
    it('should maintain a max limit of history points', () => {
      const history: LatencyPoint[] = Array(20).fill({ avgLatency: 100 } as LatencyPoint);
      const newPoint = { avgLatency: 200 } as LatencyPoint;
      
      const result = syncHistory(history, newPoint, 20);
      
      expect(result.length).toBe(20);
      expect(result[0].avgLatency).toBe(200);
    });

    it('should prepend new points to the history', () => {
      const history = [{ avgLatency: 50 } as LatencyPoint];
      const newPoint = { avgLatency: 100 } as LatencyPoint;
      
      const result = syncHistory(history, newPoint);
      
      expect(result[0].avgLatency).toBe(100);
      expect(result[1].avgLatency).toBe(50);
    });
  });
});
