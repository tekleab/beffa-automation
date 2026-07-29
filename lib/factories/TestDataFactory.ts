import { StructuredLogger } from '../core/StructuredLogger';

export interface EntityConfig {
  prefix: string;
  suffix?: string;
  useWorkerId?: boolean;
  useTimestamp?: boolean;
}

export interface GeneratedEntity {
  id: string;
  name: string;
  code?: string;
  metadata: {
    workerId: number;
    timestamp: number;
    unique: boolean;
  };
}

export class TestDataFactory {
  private logger: StructuredLogger;
  private workerId: number;
  private usedNames: Set<string> = new Set();
  private usedCodes: Set<string> = new Set();

  constructor(workerId: number = 0) {
    this.logger = new StructuredLogger('TestDataFactory');
    this.workerId = workerId;
  }

  /**
   * Get worker ID from environment or parameter
   */
  static getWorkerId(): number {
    const workerIndex = process.env.TEST_WORKER_INDEX;
    if (workerIndex) {
      return parseInt(workerIndex, 10);
    }
    return 0;
  }

  /**
   * Generate a unique entity name with worker ID and timestamp
   */
  generateName(config: EntityConfig): string {
    const { prefix, suffix = '', useWorkerId = true, useTimestamp = true } = config;
    
    let name = prefix;
    
    if (useWorkerId) {
      name += `-W${this.workerId}`;
    }
    
    if (useTimestamp) {
      name += `-T${Date.now()}`;
    }
    
    if (suffix) {
      name += `-${suffix}`;
    }
    
    // Ensure uniqueness
    let finalName = name;
    let counter = 1;
    while (this.usedNames.has(finalName)) {
      finalName = `${name}-${counter}`;
      counter++;
    }
    
    this.usedNames.add(finalName);
    return finalName;
  }

  /**
   * Generate a unique entity code
   */
  generateCode(prefix: string): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `${prefix}-${this.workerId}-${timestamp}-${random}`;
    
    // Ensure uniqueness
    let finalCode = code;
    let counter = 1;
    while (this.usedCodes.has(finalCode)) {
      finalCode = `${code}-${counter}`;
      counter++;
    }
    
    this.usedCodes.add(finalCode);
    return finalCode;
  }

  /**
   * Generate a unique entity with both name and code
   */
  generateEntity(nameConfig: EntityConfig, codePrefix: string): GeneratedEntity {
    const name = this.generateName(nameConfig);
    const code = this.generateCode(codePrefix);
    
    return {
      id: this.generateUUID(),
      name,
      code,
      metadata: {
        workerId: this.workerId,
        timestamp: Date.now(),
        unique: true
      }
    };
  }

  /**
   * Generate a UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Generate a unique email address
   */
  generateEmail(prefix: string): string {
    const timestamp = Date.now();
    return `${prefix}-w${this.workerId}-${timestamp}@test.beffa.com`;
  }

  /**
   * Generate a unique phone number
   */
  generatePhone(): string {
    const timestamp = Date.now().toString().slice(-8);
    return `+2519${timestamp}`;
  }

  /**
   * Generate a unique TIN (Tax Identification Number)
   */
  generateTIN(): string {
    const timestamp = Date.now().toString().slice(-10);
    return timestamp;
  }

  /**
   * Generate a random number within range
   */
  generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a random decimal within range
   */
  generateRandomDecimal(min: number, max: number, decimals: number = 2): number {
    const value = Math.random() * (max - min) + min;
    return parseFloat(value.toFixed(decimals));
  }

  /**
   * Generate a random date within range
   */
  generateRandomDate(startDate: Date, endDate: Date): Date {
    const start = startDate.getTime();
    const end = endDate.getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime);
  }

  /**
   * Generate a random Ethiopian date
   */
  generateEthiopianDate(): string {
    const day = this.generateRandomNumber(1, 30);
    const month = this.generateRandomNumber(1, 13);
    const year = this.generateRandomNumber(2015, 2025);
    return `${day}/${month}/${year}`;
  }

  /**
   * Generate inventory item data
   */
  generateInventoryItem(): GeneratedEntity {
    const itemTypes = ['Raw Material', 'Finished Good', 'Semi-Finished', 'Service'];
    const itemType = itemTypes[this.generateRandomNumber(0, itemTypes.length - 1)];
    
    return this.generateEntity(
      { prefix: `INV-${itemType.replace(' ', '-')}`, useWorkerId: true, useTimestamp: true },
      'ITEM'
    );
  }

  /**
   * Generate customer data
   */
  generateCustomer(): GeneratedEntity {
    const customerTypes = ['Individual', 'Corporate', 'Government'];
    const customerType = customerTypes[this.generateRandomNumber(0, customerTypes.length - 1)];
    
    return this.generateEntity(
      { prefix: `CUST-${customerType}`, useWorkerId: true, useTimestamp: true },
      'CUST'
    );
  }

  /**
   * Generate supplier data
   */
  generateSupplier(): GeneratedEntity {
    return this.generateEntity(
      { prefix: 'SUPP', useWorkerId: true, useTimestamp: true },
      'SUPP'
    );
  }

  /**
   * Generate project data
   */
  generateProject(): GeneratedEntity {
    const projectTypes = ['Construction', 'Service', 'Consulting', 'Manufacturing'];
    const projectType = projectTypes[this.generateRandomNumber(0, projectTypes.length - 1)];
    
    return this.generateEntity(
      { prefix: `PROJ-${projectType}`, useWorkerId: true, useTimestamp: true },
      'PROJ'
    );
  }

  /**
   * Generate employee data
   */
  generateEmployee(): GeneratedEntity {
    const departments = ['Engineering', 'Sales', 'Finance', 'HR', 'Operations'];
    const department = departments[this.generateRandomNumber(0, departments.length - 1)];
    
    return this.generateEntity(
      { prefix: `EMP-${department}`, useWorkerId: true, useTimestamp: true },
      'EMP'
    );
  }

  /**
   * Clear used names and codes
   */
  clearCache(): void {
    this.usedNames.clear();
    this.usedCodes.clear();
    this.logger.info('Cleared test data cache');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { names: number; codes: number } {
    return {
      names: this.usedNames.size,
      codes: this.usedCodes.size
    };
  }
}

// Singleton instance per worker
let factoryInstance: TestDataFactory | null = null;

export function getTestDataFactory(): TestDataFactory {
  if (!factoryInstance) {
    const workerId = TestDataFactory.getWorkerId();
    factoryInstance = new TestDataFactory(workerId);
  }
  return factoryInstance;
}

export function resetTestDataFactory(): void {
  if (factoryInstance) {
    factoryInstance.clearCache();
  }
  factoryInstance = null;
}
