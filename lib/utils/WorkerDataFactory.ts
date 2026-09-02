export class WorkerDataFactory {
  /**
   * Creates an item payload guaranteed to be unique across workers.
   */
  static createItemPayload(workerIndex: number) {
    const timestamp = Date.now();
    const suffix = `${workerIndex}-${timestamp}`;
    return {
      itemName: `Item-${suffix}`,
      sku: `SKU-${suffix}`,
      cost_method_code: 'FIFO'
    };
  }
}