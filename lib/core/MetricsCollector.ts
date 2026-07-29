export interface RequestMetric {
  method: string;
  endpoint: string;
  duration: number;
  status: number;
  timestamp: number;
  success: boolean;
  retryCount?: number;
}

export interface MetricSummary {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  p50Duration: number;
  p95Duration: number;
  p99Duration: number;
  slowEndpoints: Array<{ endpoint: string; avgDuration: number; count: number }>;
}

export class MetricsCollector {
  private metrics: RequestMetric[] = [];
  private maxMetrics: number = 10000;
  private slowThreshold: number = 5000; // 5 seconds

  /**
   * Track a request with timing
   */
  async trackRequest<T>(
    method: string,
    endpoint: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    let status = 0;
    let success = false;
    let retryCount = 0;

    try {
      const result = await fn();
      success = true;
      status = 200; // Default success status
      return result;
    } catch (error: any) {
      success = false;
      status = error?.status || error?.response?.status || 0;
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      
      const metric: RequestMetric = {
        method,
        endpoint,
        duration,
        status,
        timestamp: Date.now(),
        success,
        retryCount
      };

      this.addMetric(metric);
    }
  }

  /**
   * Add a metric directly
   */
  addMetric(metric: RequestMetric): void {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): RequestMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Get summary statistics
   */
  getSummary(): MetricSummary {
    if (this.metrics.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        p50Duration: 0,
        p95Duration: 0,
        p99Duration: 0,
        slowEndpoints: []
      };
    }

    const durations = this.metrics.map(m => m.duration).sort((a, b) => a - b);
    const successful = this.metrics.filter(m => m.success);
    const failed = this.metrics.filter(m => !m.success);

    // Calculate percentiles
    const p50Index = Math.floor(durations.length * 0.5);
    const p95Index = Math.floor(durations.length * 0.95);
    const p99Index = Math.floor(durations.length * 0.99);

    // Group by endpoint for slow endpoint detection
    const endpointGroups = new Map<string, { durations: number[]; count: number }>();
    this.metrics.forEach(m => {
      if (!endpointGroups.has(m.endpoint)) {
        endpointGroups.set(m.endpoint, { durations: [], count: 0 });
      }
      const group = endpointGroups.get(m.endpoint)!;
      group.durations.push(m.duration);
      group.count++;
    });

    const slowEndpoints = Array.from(endpointGroups.entries())
      .map(([endpoint, data]) => ({
        endpoint,
        avgDuration: data.durations.reduce((a, b) => a + b, 0) / data.durations.length,
        count: data.count
      }))
      .filter(e => e.avgDuration > this.slowThreshold)
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 10);

    return {
      totalRequests: this.metrics.length,
      successfulRequests: successful.length,
      failedRequests: failed.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: durations[0],
      maxDuration: durations[durations.length - 1],
      p50Duration: durations[p50Index],
      p95Duration: durations[p95Index],
      p99Duration: durations[p99Index],
      slowEndpoints
    };
  }

  /**
   * Get metrics by endpoint
   */
  getMetricsByEndpoint(endpoint: string): RequestMetric[] {
    return this.metrics.filter(m => m.endpoint === endpoint);
  }

  /**
   * Get metrics by HTTP method
   */
  getMetricsByMethod(method: string): RequestMetric[] {
    return this.metrics.filter(m => m.method.toUpperCase() === method.toUpperCase());
  }

  /**
   * Get failed requests
   */
  getFailedRequests(): RequestMetric[] {
    return this.metrics.filter(m => !m.success);
  }

  /**
   * Get slow requests (above threshold)
   */
  getSlowRequests(threshold?: number): RequestMetric[] {
    const thresh = threshold || this.slowThreshold;
    return this.metrics.filter(m => m.duration > thresh);
  }

  /**
   * Set slow request threshold
   */
  setSlowThreshold(ms: number): void {
    this.slowThreshold = ms;
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify({
      summary: this.getSummary(),
      metrics: this.metrics
    }, null, 2);
  }

  /**
   * Print summary to console
   */
  printSummary(): void {
    const summary = this.getSummary();
    console.log('\n=== Metrics Summary ===');
    console.log(`Total Requests: ${summary.totalRequests}`);
    console.log(`Successful: ${summary.successfulRequests}`);
    console.log(`Failed: ${summary.failedRequests}`);
    console.log(`Avg Duration: ${summary.averageDuration.toFixed(2)}ms`);
    console.log(`Min Duration: ${summary.minDuration}ms`);
    console.log(`Max Duration: ${summary.maxDuration}ms`);
    console.log(`P50 Duration: ${summary.p50Duration}ms`);
    console.log(`P95 Duration: ${summary.p95Duration}ms`);
    console.log(`P99 Duration: ${summary.p99Duration}ms`);
    
    if (summary.slowEndpoints.length > 0) {
      console.log('\n--- Slow Endpoints ---');
      summary.slowEndpoints.forEach(e => {
        console.log(`${e.endpoint}: ${e.avgDuration.toFixed(2)}ms avg (${e.count} requests)`);
      });
    }
    console.log('======================\n');
  }
}
