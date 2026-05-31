/**
 * Standard Logging Utility for Playwright Tests
 * Provides colored, structured logs with timestamps
 * Supports gating DEBUG logs behind DEBUG=true env variable
 */

export enum LogLevel {
  STEP = 'STEP',
  ATTACK = 'ATTACK',
  PASS = 'PASS',
  FAIL = 'FAIL',
  PERFORMANCE = 'PERFORMANCE',
  SNAPSHOT = 'SNAPSHOT',
  SECONDARY_BUG = 'SECONDARY_BUG',
  DEBUG = 'DEBUG',
  WARN = 'WARN',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

export class Logger {
  private static isDebugEnabled = process.env.DEBUG === 'true';

  private static colors = {
    STEP: '\x1b[36m',      // Cyan
    ATTACK: '\x1b[35m',    // Magenta
    PASS: '\x1b[32m',      // Green
    FAIL: '\x1b[31m',      // Red
    PERFORMANCE: '\x1b[33m', // Yellow
    SNAPSHOT: '\x1b[34m',   // Blue
    SECONDARY_BUG: '\x1b[33m', // Yellow
    DEBUG: '\x1b[90m',     // Gray
    WARN: '\x1b[33m',      // Yellow
    ERROR: '\x1b[31m',     // Red
    INFO: '\x1b[36m',      // Cyan
    reset: '\x1b[0m'
  };

  private static getTimestamp(): string {
    const now = new Date();
    return now.toISOString().split('T')[1].split('.')[0]; // HH:MM:SS
  }

  private static log(level: LogLevel, message: string, data?: any): void {
    // Gate DEBUG logs unless DEBUG=true is set
    if (level === LogLevel.DEBUG && !this.isDebugEnabled) {
      return;
    }

    const color = this.colors[level] || this.colors.INFO;
    const timestamp = this.getTimestamp();
    const prefix = `[${level}]`;
    
    const logMessage = `${color}${timestamp} ${prefix}${this.colors.reset} ${message}`;
    
    if (data !== undefined) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }

  static step(message: string, data?: any): void {
    this.log(LogLevel.STEP, message, data);
  }

  static attack(message: string, data?: any): void {
    this.log(LogLevel.ATTACK, message, data);
  }

  static pass(message: string, data?: any): void {
    this.log(LogLevel.PASS, message, data);
  }

  static fail(message: string, data?: any): void {
    this.log(LogLevel.FAIL, message, data);
  }

  static performance(message: string, data?: any): void {
    this.log(LogLevel.PERFORMANCE, message, data);
  }

  static snapshot(message: string, data?: any): void {
    this.log(LogLevel.SNAPSHOT, message, data);
  }

  static secondaryBug(message: string, data?: any): void {
    this.log(LogLevel.SECONDARY_BUG, message, data);
  }

  static debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  static warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  static error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  static info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }
}

// Export convenience functions for direct import
export const log = Logger;
export const { step, attack, pass, fail, performance, snapshot, secondaryBug, debug, warn, error, info } = Logger;
