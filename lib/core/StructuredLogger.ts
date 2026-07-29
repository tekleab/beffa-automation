export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  PERF = 'PERF',
  API = 'API'
}

export class StructuredLogger {
  private static colors = {
    INFO: '\x1b[36m',      // Cyan
    WARN: '\x1b[33m',      // Yellow
    ERROR: '\x1b[31m',     // Red
    PERF: '\x1b[35m',      // Magenta
    API: '\x1b[32m',       // Green
    reset: '\x1b[0m'
  };

  constructor(private context: string = 'Default', private minLevel: LogLevel = LogLevel.INFO) {}

  info(message: string, meta?: any) { StructuredLogger.log(LogLevel.INFO, message, { context: this.context, ...meta }); }
  warn(message: string, meta?: any) { StructuredLogger.log(LogLevel.WARN, message, { context: this.context, ...meta }); }
  error(message: string, meta?: any) { StructuredLogger.log(LogLevel.ERROR, message, { context: this.context, ...meta }); }
  perf(message: string, meta?: any) { StructuredLogger.log(LogLevel.PERF, message, { context: this.context, ...meta }); }

  /**
   * Logs a message with structured metadata.
   */
  static log(level: LogLevel, message: string, meta?: Record<string, any>) {
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0]; // YYYY-MM-DD HH:mm:ss
    const workerIndex = process.env.TEST_WORKER_INDEX || '0';
    const ctx = meta?.context || 'Default';
    const color = this.colors[level] || this.colors.reset;
    const workerPrefix = workerIndex !== '0' ? `[Worker ${workerIndex}] ` : '';
    
    let metaStr = '';
    if (meta) {
      const { context: _, ...rest } = meta;
      if (Object.keys(rest).length > 0) {
        metaStr = ` | ${JSON.stringify(rest)}`;
      }
    }

    const output = `${workerPrefix}${color}${timestamp} [${level}] [${ctx}]${this.colors.reset} ${message}${metaStr}`;

    if (level === LogLevel.ERROR) {
      console.error(output);
    } else {
      console.log(output);
    }
  }

  /**
   * Specialized logging for API performance tracking.
   */
  static api(method: string, url: string, status: number, duration: number) {
    this.log(LogLevel.API, `${method} ${url}`, { status, duration: `${duration}ms` });
    if (duration > 2000) this.log(LogLevel.WARN, `Slow API Detected: ${url}`, { duration });
  }
}