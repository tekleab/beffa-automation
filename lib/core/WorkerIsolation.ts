import { StructuredLogger } from './StructuredLogger';

export interface WorkerConfig {
  workerId: number;
  parallelIndex: number;
  projectId: string;
}

export interface WorkerState {
  workerId: number;
  assignedResources: Set<string>;
  lastActivity: number;
  isIdle: boolean;
}

export class WorkerIsolation {
  private logger: StructuredLogger;
  private workerId: number;
  private assignedResources: Set<string> = new Set();
  private resourceLocks: Map<string, number> = new Map(); // resource -> workerId
  private lockTimeout: number = 30000; // 30 seconds

  constructor(workerId: number = 0) {
    this.logger = new StructuredLogger('WorkerIsolation');
    this.workerId = workerId;
  }

  /**
   * Get worker ID from environment
   */
  static getWorkerId(): number {
    const workerIndex = process.env.TEST_WORKER_INDEX;
    if (workerIndex) {
      return parseInt(workerIndex, 10);
    }
    return 0;
  }

  /**
   * Get parallel index from environment
   */
  static getParallelIndex(): number {
    const parallelIndex = process.env.TEST_PARALLEL_INDEX;
    if (parallelIndex) {
      return parseInt(parallelIndex, 10);
    }
    return 0;
  }

  /**
   * Get worker configuration
   */
  static getWorkerConfig(): WorkerConfig {
    return {
      workerId: WorkerIsolation.getWorkerId(),
      parallelIndex: WorkerIsolation.getParallelIndex(),
      projectId: process.env.PROJECT_ID || 'default'
    };
  }

  /**
   * Acquire a resource lock for this worker
   */
  async acquireLock(resourceId: string, timeoutMs: number = this.lockTimeout): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const currentOwner = this.resourceLocks.get(resourceId);
      
      // Resource is free or already owned by this worker
      if (!currentOwner || currentOwner === this.workerId) {
        this.resourceLocks.set(resourceId, this.workerId);
        this.assignedResources.add(resourceId);
        this.logger.info(`Worker ${this.workerId} acquired lock on ${resourceId}`);
        return true;
      }
      
      // Resource is owned by another worker, wait and retry
      await this.sleep(100);
    }
    
    this.logger.warn(`Worker ${this.workerId} failed to acquire lock on ${resourceId} after ${timeoutMs}ms`);
    return false;
  }

  /**
   * Release a resource lock
   */
  releaseLock(resourceId: string): void {
    const currentOwner = this.resourceLocks.get(resourceId);
    
    if (currentOwner === this.workerId) {
      this.resourceLocks.delete(resourceId);
      this.assignedResources.delete(resourceId);
      this.logger.info(`Worker ${this.workerId} released lock on ${resourceId}`);
    } else {
      this.logger.warn(`Worker ${this.workerId} attempted to release lock owned by worker ${currentOwner} on ${resourceId}`);
    }
  }

  /**
   * Release all locks held by this worker
   */
  releaseAllLocks(): void {
    for (const resourceId of this.assignedResources) {
      this.releaseLock(resourceId);
    }
    this.logger.info(`Worker ${this.workerId} released all locks`);
  }

  /**
   * Check if a resource is locked
   */
  isLocked(resourceId: string): boolean {
    return this.resourceLocks.has(resourceId);
  }

  /**
   * Check if a resource is owned by this worker
   */
  ownsResource(resourceId: string): boolean {
    return this.resourceLocks.get(resourceId) === this.workerId;
  }

  /**
   * Get all resources owned by this worker
   */
  getOwnedResources(): string[] {
    return Array.from(this.assignedResources);
  }

  /**
   * Generate a worker-specific resource ID
   */
  generateResourceId(baseId: string): string {
    return `${baseId}-w${this.workerId}`;
  }

  /**
   * Generate a worker-specific entity name
   */
  generateEntityName(prefix: string): string {
    const timestamp = Date.now();
    return `${prefix}-w${this.workerId}-t${timestamp}`;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.releaseAllLocks();
    this.resourceLocks.clear();
    this.assignedResources.clear();
  }
}

// Singleton instance per worker
let workerIsolationInstance: WorkerIsolation | null = null;

export function getWorkerIsolation(): WorkerIsolation {
  if (!workerIsolationInstance) {
    const workerId = WorkerIsolation.getWorkerId();
    workerIsolationInstance = new WorkerIsolation(workerId);
  }
  return workerIsolationInstance;
}

export function resetWorkerIsolation(): void {
  if (workerIsolationInstance) {
    workerIsolationInstance.dispose();
  }
  workerIsolationInstance = null;
}
