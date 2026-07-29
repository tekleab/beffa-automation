import { StructuredLogger } from './StructuredLogger';
import { MetricsCollector } from './MetricsCollector';
import * as fs from 'fs';
import * as path from 'path';

export interface TelemetryConfig {
  enabled: boolean;
  exportPath: string;
  exportFormat: 'json' | 'csv';
  autoExport: boolean;
}

export interface TestSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  workerId: number;
  testCount: number;
  passCount: number;
  failCount: number;
  metrics: any;
}

export class TelemetryManager {
  private logger: StructuredLogger;
  private metrics: MetricsCollector;
  private config: TelemetryConfig;
  private session: TestSession | null = null;
  private exportPath: string;

  constructor(config?: Partial<TelemetryConfig>) {
    this.logger = new StructuredLogger('TelemetryManager');
    this.metrics = new MetricsCollector();
    this.config = {
      enabled: config?.enabled ?? true,
      exportPath: config?.exportPath ?? '.telemetry',
      exportFormat: config?.exportFormat ?? 'json',
      autoExport: config?.autoExport ?? true
    };
    this.exportPath = path.join(process.cwd(), this.config.exportPath);
  }

  /**
   * Start a new test session
   */
  startSession(workerId: number = 0): string {
    const sessionId = `session-${Date.now()}-${workerId}`;
    this.session = {
      sessionId,
      startTime: Date.now(),
      workerId,
      testCount: 0,
      passCount: 0,
      failCount: 0,
      metrics: {}
    };
    this.logger.info(`Started telemetry session: ${sessionId}`);
    return sessionId;
  }

  /**
   * End the current test session
   */
  endSession(): void {
    if (!this.session) return;
    
    this.session.endTime = Date.now();
    this.session.metrics = this.metrics.getSummary();
    
    if (this.config.autoExport) {
      this.exportSession();
    }
    
    this.logger.info(`Ended telemetry session: ${this.session.sessionId}`);
  }

  /**
   * Record a test result
   */
  recordTest(passed: boolean): void {
    if (!this.session) return;
    
    this.session.testCount++;
    if (passed) {
      this.session.passCount++;
    } else {
      this.session.failCount++;
    }
  }

  /**
   * Get current session
   */
  getSession(): TestSession | null {
    return this.session;
  }

  /**
   * Get metrics collector
   */
  getMetrics(): MetricsCollector {
    return this.metrics;
  }

  /**
   * Export session data to file
   */
  exportSession(): void {
    if (!this.session || !this.config.enabled) return;
    
    try {
      // Ensure export directory exists
      fs.mkdirSync(this.exportPath, { recursive: true });
      
      const filename = `${this.session.sessionId}.${this.config.exportFormat}`;
      const filepath = path.join(this.exportPath, filename);
      
      if (this.config.exportFormat === 'json') {
        fs.writeFileSync(filepath, JSON.stringify(this.session, null, 2));
      } else if (this.config.exportFormat === 'csv') {
        const csv = this.sessionToCsv(this.session);
        fs.writeFileSync(filepath, csv);
      }
      
      this.logger.info(`Exported telemetry to: ${filepath}`);
    } catch (error) {
      this.logger.error('Failed to export telemetry', error);
    }
  }

  /**
   * Convert session to CSV format
   */
  private sessionToCsv(session: TestSession): string {
    const summary = session.metrics;
    const duration = (session.endTime || Date.now()) - session.startTime;
    
    const headers = [
      'sessionId',
      'workerId',
      'duration',
      'testCount',
      'passCount',
      'failCount',
      'passRate',
      'totalRequests',
      'successfulRequests',
      'failedRequests',
      'avgDuration',
      'p95Duration',
      'p99Duration'
    ];
    
    const values = [
      session.sessionId,
      session.workerId,
      duration,
      session.testCount,
      session.passCount,
      session.failCount,
      session.testCount > 0 ? (session.passCount / session.testCount * 100).toFixed(2) : 0,
      summary.totalRequests,
      summary.successfulRequests,
      summary.failedRequests,
      summary.averageDuration.toFixed(2),
      summary.p95Duration,
      summary.p99Duration
    ];
    
    return [
      headers.join(','),
      values.join(',')
    ].join('\n');
  }

  /**
   * Export all historical sessions
   */
  exportAllSessions(): void {
    if (!this.config.enabled) return;
    
    try {
      const files = fs.readdirSync(this.exportPath);
      const sessions = files
        .filter(f => f.startsWith('session-') && f.endsWith('.json'))
        .map(f => {
          const data = fs.readFileSync(path.join(this.exportPath, f), 'utf-8');
          return JSON.parse(data);
        });
      
      const aggregated = this.aggregateSessions(sessions);
      const filepath = path.join(this.exportPath, 'aggregated.json');
      fs.writeFileSync(filepath, JSON.stringify(aggregated, null, 2));
      
      this.logger.info(`Exported aggregated telemetry for ${sessions.length} sessions`);
    } catch (error) {
      this.logger.error('Failed to export aggregated telemetry', error);
    }
  }

  /**
   * Aggregate multiple sessions
   */
  private aggregateSessions(sessions: TestSession[]): any {
    const totalTests = sessions.reduce((sum, s) => sum + s.testCount, 0);
    const totalPasses = sessions.reduce((sum, s) => sum + s.passCount, 0);
    const totalFails = sessions.reduce((sum, s) => sum + s.failCount, 0);
    
    const allMetrics = sessions.map(s => s.metrics);
    const avgDuration = allMetrics.reduce((sum, m) => sum + m.averageDuration, 0) / allMetrics.length;
    const p95Duration = allMetrics.reduce((sum, m) => sum + m.p95Duration, 0) / allMetrics.length;
    const p99Duration = allMetrics.reduce((sum, m) => sum + m.p99Duration, 0) / allMetrics.length;
    
    return {
      totalSessions: sessions.length,
      totalTests,
      totalPasses,
      totalFails,
      passRate: totalTests > 0 ? (totalPasses / totalTests * 100).toFixed(2) : 0,
      avgDuration: avgDuration.toFixed(2),
      p95Duration: p95Duration.toFixed(2),
      p99Duration: p99Duration.toFixed(2),
      sessions
    };
  }

  /**
   * Get real-time session statistics
   */
  getSessionStats(): any {
    if (!this.session) return null;
    
    const summary = this.metrics.getSummary();
    const duration = Date.now() - this.session.startTime;
    
    return {
      sessionId: this.session.sessionId,
      workerId: this.session.workerId,
      duration,
      testCount: this.session.testCount,
      passCount: this.session.passCount,
      failCount: this.session.failCount,
      passRate: this.session.testCount > 0 ? (this.session.passCount / this.session.testCount * 100).toFixed(2) : 0,
      metrics: summary
    };
  }

  /**
   * Print session statistics to console
   */
  printSessionStats(): void {
    const stats = this.getSessionStats();
    if (!stats) return;
    
    console.log('\n=== Telemetry Session Stats ===');
    console.log(`Session ID: ${stats.sessionId}`);
    console.log(`Worker ID: ${stats.workerId}`);
    console.log(`Duration: ${stats.duration}ms`);
    console.log(`Tests: ${stats.testCount} (Pass: ${stats.passCount}, Fail: ${stats.failCount})`);
    console.log(`Pass Rate: ${stats.passRate}%`);
    console.log(`Total Requests: ${stats.metrics.totalRequests}`);
    console.log(`Avg Duration: ${stats.metrics.averageDuration.toFixed(2)}ms`);
    console.log(`P95 Duration: ${stats.metrics.p95Duration}ms`);
    console.log('=============================\n');
  }

  /**
   * Cleanup old telemetry files
   */
  cleanupOldFiles(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): number {
    if (!this.config.enabled) return 0;
    
    try {
      const files = fs.readdirSync(this.exportPath);
      const now = Date.now();
      let deletedCount = 0;
      
      for (const file of files) {
        const filepath = path.join(this.exportPath, file);
        const stats = fs.statSync(filepath);
        
        if (now - stats.mtimeMs > maxAgeMs) {
          fs.unlinkSync(filepath);
          deletedCount++;
        }
      }
      
      if (deletedCount > 0) {
        this.logger.info(`Cleaned up ${deletedCount} old telemetry files`);
      }
      
      return deletedCount;
    } catch (error) {
      this.logger.error('Failed to cleanup old telemetry files', error);
      return 0;
    }
  }
}

// Singleton instance
let telemetryInstance: TelemetryManager | null = null;

export function getTelemetryManager(config?: Partial<TelemetryConfig>): TelemetryManager {
  if (!telemetryInstance) {
    telemetryInstance = new TelemetryManager(config);
  }
  return telemetryInstance;
}

export function resetTelemetryManager(): void {
  if (telemetryInstance) {
    telemetryInstance.endSession();
  }
  telemetryInstance = null;
}
