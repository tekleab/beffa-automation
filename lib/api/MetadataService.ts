import { BasePage } from '../base-page';
import { StructuredLogger } from '../core/StructuredLogger';

export class MetadataService {
  private logger = new StructuredLogger('MetadataService');
  constructor(private apiClient: BasePage) {}

  private get params() {
    return `year=${process.env.BEFFA_YEAR || '2019'}&period=yearly&calendar=ec`;
  }

  async getAccounts(): Promise<any[]> {
    const data = await this.apiClient.safeGet(`/accounts?page=1&pageSize=500&${this.params}`, undefined, 60000);
    const arr = data.items || data.data || data || [];
    return Array.isArray(arr) ? arr : [];
  }

  async findAccountByCriteria(accounts: any[], keywords: string[], type?: string): Promise<string | undefined> {
    return accounts.find(a =>
      keywords.some(k => a.name?.toLowerCase().includes(k)) ||
      (type && a.account_type?.toLowerCase() === type.toLowerCase())
    )?.id;
  }

  async discoverStandardAccounts() {
    const accounts = await this.getAccounts();
    return {
      sales: await this.findAccountByCriteria(accounts, ['sales'], 'income'),
      cogs: await this.findAccountByCriteria(accounts, ['cogs', 'cost of goods'], 'expense'),
      inventory: await this.findAccountByCriteria(accounts, ['inventory'], 'asset'),
      payable: await this.findAccountByCriteria(accounts, ['payable'], 'liability'),
      receivable: await this.findAccountByCriteria(accounts, ['receivable'], 'asset'),
      cash: await this.findAccountByCriteria(accounts, ['cash', 'bank'])
    };
  }

  async getLocations(): Promise<any[]> {
    const data = await this.apiClient.safeGet(`/locations?page=1&pageSize=100&${this.params}`, undefined, 120000);
    const arr = data.items || data.data || data || [];
    return Array.isArray(arr) ? arr : [];
  }

  async getDefaultLocation() {
    const locs = await this.getLocations();
    const loc = locs.find((l: any) => l.warehouse_id || l.warehouse?.id) || locs[0];
    const warehouseId = loc ? await this.apiClient.resolveWarehouseIdFromLocation(loc) : undefined;
    return {
      locationId: loc?.id,
      warehouseId
    };
  }
}
