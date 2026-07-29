import { StructuredLogger, LogLevel } from './StructuredLogger';

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  signal?: AbortSignal;
}

export class RetryManager {
  static async retry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const { maxRetries = 3, initialDelay = 1000, signal } = options;
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (signal?.aborted) {
        throw new Error('Operation cancelled: Test ended or timed out.');
      }

      try {
        return await fn();
      } catch (error: any) {
        lastError = error;

        // Don't retry terminal errors (Auth/Permissions)
        if (error.status === 401 || error.status === 403) throw error;

        const delay = initialDelay * Math.pow(2, attempt);
        StructuredLogger.log(LogLevel.WARN, `Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, { 
          error: error.message 
        });

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(resolve, delay);
          if (signal) {
            signal.addEventListener('abort', () => {
              clearTimeout(timeout);
              reject(new Error('Retry aborted: Test runner stopped execution.'));
            }, { once: true });
          }
        });
      }
    }
    throw lastError;
  }
}