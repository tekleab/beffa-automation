import { Page } from '@playwright/test';
import { AuthManager } from '../lib/AuthManager';
import { BasePage } from '../lib/BasePage';
import { SalesAPI } from '../lib/api/SalesAPI';
import { PurchaseAPI } from '../lib/api/PurchaseAPI';
import { InventoryAPI } from '../lib/api/InventoryAPI';
import { SharedUI } from './components/SharedUI';
import { SalesPage } from './SalesPage';
import { PurchasePage } from './PurchasePage';
import { InventoryPage } from './InventoryPage';

export class AppManager {
  page: Page;
  emailInput: ReturnType<Page['getByRole']>;
  passwordInput: ReturnType<Page['getByRole']>;
  loginBtn: ReturnType<Page['getByRole']>;
  mainPhoneInput: ReturnType<Page['getByRole']>;
  customerNameInput: ReturnType<Page['getByRole']>;
  customerTinInput: ReturnType<Page['getByRole']>;
  approvedStatus: string;
  actionButtons: string;
  companyBtn: ReturnType<Page['locator']>;
  auth: AuthManager;
  base: BasePage;
  api: {
    sales: SalesAPI;
    purchase: PurchaseAPI;
    inventory: InventoryAPI;
    general: AppManager;
  };
  ui: {
    shared: SharedUI;
    sales: SalesPage;
    purchase: PurchasePage;
    inventory: InventoryPage;
  };

  constructor(page: Page) {
    this.page = page;

    // Login selectors
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.loginBtn = page.getByRole('button', { name: 'Login' });

    // --- Customer Module Selectors ---
    this.mainPhoneInput = page.getByRole('textbox', { name: /Main Phone/i });
    this.customerNameInput = page.getByRole('textbox', { name: 'Customer Name *' });
    this.customerTinInput = page.getByRole('textbox', { name: 'Customer TIN *' });

    // Status and Button Selectors
    this.approvedStatus = 'span.css-1ny2kle:has-text("Approved"), span:has-text("Approved")';
    this.actionButtons = 'button:has-text("Submit For Review"), button:has-text("Approve"), button:has-text("Advance"), button:has-text("Submit For Approver"), button:has-text("Submit Forapprover"), button:has-text("Submit For Approve"), button:has-text("Submit For Apporver")';

    // Company Switcher Selectors (Top-left Header)
    this.companyBtn = page.locator('header button.chakra-menu__menu-button, .chakra-stack button.chakra-menu__menu-button').first();

    // Module Mappings
    this.auth = new AuthManager(page);
    this.base = new BasePage(page);
    this.api = {
      sales: new SalesAPI(page),
      purchase: new PurchaseAPI(page),
      inventory: new InventoryAPI(page),
      general: this
    };
    this.ui = {
      shared: new SharedUI(page),
      sales: new SalesPage(page),
      purchase: new PurchasePage(page),
      inventory: new InventoryPage(page)
    };

    // Core Dependencies bindings
    this.api.sales._getAuthToken = this.auth._getAuthToken.bind(this.auth);
    this.api.purchase._getAuthToken = this.auth._getAuthToken.bind(this.auth);
    this.api.inventory._getAuthToken = this.auth._getAuthToken.bind(this.auth);

    this.ui.shared.smartSearch = this.base.smartSearch.bind(this.base);
    // this.ui.shared.smartApprove = this.base.smartApprove.bind(this.base);
    this.ui.purchase.smartSearch = this.base.smartSearch.bind(this.base);
    this.ui.sales.smartSearch = this.base.smartSearch.bind(this.base);
    this.ui.inventory.smartSearch = this.base.smartSearch.bind(this.base);

    // Bind date helpers
    this.ui.shared.fillDate = this.base.fillDate.bind(this.base);
    this.ui.purchase.fillDate = this.base.fillDate.bind(this.base);
    this.ui.sales.fillDate = this.base.fillDate.bind(this.base);
  }

  async login(...args: Parameters<AuthManager['login']>) { return await this.auth.login(...args); }
  async switchCompany(...args: Parameters<AuthManager['switchCompany']>) { return await this.auth.switchCompany(...args); }
  async smartSearch(...args: Parameters<BasePage['smartSearch']>) { return await this.base.smartSearch(...args); }
  async handleApprovalFlow(...args: Parameters<SharedUI['handleApprovalFlow']>) { return await this.ui.shared.handleApprovalFlow(...args); }
  // smartApprove removed — approval is handled entirely by SharedUI.handleApprovalFlow
  async _handleReviewerSelection(...args: Parameters<SharedUI['_handleReviewerSelection']>) { return await this.ui.shared._handleReviewerSelection(...args); }
  getTransactionDates(...args: Parameters<BasePage['getTransactionDates']>) { return this.base.getTransactionDates(...args); }
  async getActiveCalendarDay(...args: Parameters<BasePage['getActiveCalendarDay']>) { return await this.base.getActiveCalendarDay(...args); }
  async fillDate(...args: Parameters<BasePage['fillDate']>) { return await this.base.fillDate(...args); }
  async pickDate(...args: Parameters<BasePage['pickDate']>) { return await this.base.pickDate(...args); }
  async selectRandomOption(...args: Parameters<BasePage['selectRandomOption']>) { return await this.base.selectRandomOption(...args); }
  async verifyDocInProfile(...args: Parameters<SharedUI['verifyDocInProfile']>) { return await this.ui.shared.verifyDocInProfile(...args); }
  async findApprovedUnpaidBill(...args: Parameters<PurchasePage['findApprovedUnpaidBill']>) { return await this.ui.purchase.findApprovedUnpaidBill(...args); }
  async findApprovedUnpaidInvoice(...args: Parameters<SalesPage['findApprovedUnpaidInvoice']>) { return await this.ui.sales.findApprovedUnpaidInvoice(...args); }
  async captureJournalEntries(...args: Parameters<SharedUI['captureJournalEntries']>) { return await this.ui.shared.captureJournalEntries(...args); }
  async handlePOReceiptTab(...args: Parameters<PurchasePage['handlePOReceiptTab']>) { return await this.ui.purchase.handlePOReceiptTab(...args); }
  async handleSOReleasedTab(...args: Parameters<SalesPage['handleSOReleasedTab']>) { return await this.ui.sales.handleSOReleasedTab(...args); }
  getInvoiceDates(...args: Parameters<BasePage['getInvoiceDates']>) { return this.base.getInvoiceDates(...args); }
  async captureRandomItemDataAPI(...args: Parameters<InventoryAPI['captureRandomItemDataAPI']>) { return await this.api.inventory.captureRandomItemDataAPI(...args); }
  async captureRandomItemDetails() {
    const target = await this.api.inventory.captureRandomItemDataAPI();
    console.log(`[OK] Discovered: "${target.itemName}" via API | Stock: ${target.currentStock}`);
    return target;
  }
  async extractDetailValue(...args: Parameters<BasePage['extractDetailValue']>) { return await this.base.extractDetailValue(...args); }
  async captureSODetailData(...args: Parameters<SalesPage['captureSODetailData']>) { return await this.ui.sales.captureSODetailData(...args); }
  async getCustomerNameAPI(...args: Parameters<SalesAPI['getCustomerNameAPI']>) { return await this.api.sales.getCustomerNameAPI(...args); }
  async captureRandomCustomerDetails(...args: Parameters<SalesPage['captureRandomCustomerDetails']>) { return await this.ui.sales.captureRandomCustomerDetails(...args); }
  async captureRandomVendorDetails(...args: Parameters<PurchasePage['captureRandomVendorDetails']>) { return await this.ui.purchase.captureRandomVendorDetails(...args); }
  async captureItemDetails(...args: Parameters<InventoryPage['captureItemDetails']>) { return await this.ui.inventory.captureItemDetails(...args); }
  async getItemDetailsAPI(...args: Parameters<InventoryAPI['getItemDetailsAPI']>) { return await this.api.inventory.getItemDetailsAPI(...args); }
  async _extractItemDetails(...args: Parameters<InventoryPage['_extractItemDetails']>) { return await this.ui.inventory._extractItemDetails(...args); }
  async verifyLedgerImpact(...args: Parameters<SharedUI['verifyLedgerImpact']>) { return await this.ui.shared.verifyLedgerImpact(...args); }
  async verifyAllJournalEntries(...args: Parameters<SharedUI['verifyAllJournalEntries']>) { return await this.ui.shared.verifyAllJournalEntries(...args); }
  async fillEthiopianAddress(...args: Parameters<SharedUI['fillEthiopianAddress']>) { return await this.ui.shared.fillEthiopianAddress(...args); }
  async _getAuthToken(...args: Parameters<AuthManager['_getAuthToken']>) { return await this.auth._getAuthToken(...args); }
  async createSalesOrderAPI(...args: Parameters<SalesAPI['createSalesOrderAPI']>) { return await this.api.sales.createSalesOrderAPI(...args); }
  async createInvoiceAPI(...args: Parameters<SalesAPI['createInvoiceAPI']>) { return await this.api.sales.createInvoiceAPI(...args); }
  async createStandaloneInvoiceAPI(...args: Parameters<SalesAPI['createStandaloneInvoiceAPI']>) { return await this.api.sales.createStandaloneInvoiceAPI(...args); }
  async createPurchaseOrderAPI(...args: Parameters<PurchaseAPI['createPurchaseOrderAPI']>) { return await this.api.purchase.createPurchaseOrderAPI(...args); }
  async createBillAPI(...args: Parameters<PurchaseAPI['createBillAPI']>) { return await this.api.purchase.createBillAPI(...args); }
  async createBillFromPoAPI(...args: Parameters<PurchaseAPI['createBillFromPoAPI']>) { return await this.api.purchase.createBillFromPoAPI(...args); }
  async verifyBillInVendorAPI(...args: Parameters<PurchaseAPI['verifyBillInVendorAPI']>) { return await this.api.purchase.verifyBillInVendorAPI(...args); }
  async createInventoryAdjustmentUI(...args: Parameters<InventoryPage['createInventoryAdjustmentUI']>) { return await this.ui.inventory.createInventoryAdjustmentUI(...args); }
  async createInventoryAdjustmentAPI(...args: Parameters<InventoryAPI['createInventoryAdjustmentAPI']>) { return await this.api.inventory.createInventoryAdjustmentAPI(...args); }
  async createInvoiceReceiptAPI(...args: Parameters<SalesAPI['createInvoiceReceiptAPI']>) { return await this.api.sales.createInvoiceReceiptAPI(...args); }
  async getInvoiceAPI(...args: Parameters<SalesAPI['getInvoiceAPI']>) { return await this.api.sales.getInvoiceAPI(...args); }
  async createReceiptAPI(...args: Parameters<SalesAPI['createReceiptAPI']>) { return await this.api.sales.createReceiptAPI(...args); }
  async getJournalEntriesAPI(...args: Parameters<InventoryAPI['getJournalEntriesAPI']>) { return await this.api.inventory.getJournalEntriesAPI(...args); }
  async reverseInvoiceAPI(...args: Parameters<SalesAPI['reverseInvoiceAPI']>) { return await this.api.sales.reverseInvoiceAPI(...args); }
  async getBillAPI(...args: Parameters<PurchaseAPI['getBillAPI']>) { return await this.api.purchase.getBillAPI(...args); }
  async approvePaymentAPI(...args: Parameters<PurchaseAPI['approvePaymentAPI']>) { return await this.api.purchase.approvePaymentAPI(...args); }
  async approveInvoiceAPI(...args: Parameters<SalesAPI['approveInvoiceAPI']>) { return await this.api.sales.approveInvoiceAPI(...args); }
  async createBillPaymentAPI(...args: Parameters<PurchaseAPI['createBillPaymentAPI']>) { return await this.api.purchase.createBillPaymentAPI(...args); }
  async reverseBillAPI(...args: Parameters<PurchaseAPI['reverseBillAPI']>) { return await this.api.purchase.reverseBillAPI(...args); }
  async getPaymentAPI(...args: Parameters<PurchaseAPI['getPaymentAPI']>) { return await this.api.purchase.getPaymentAPI(...args); }
  async extractIdFromUrl(...args: Parameters<BasePage['extractIdFromUrl']>) { return await this.base.extractIdFromUrl(...args); }
  async advanceDocumentAPI(...args: Parameters<BasePage['advanceDocumentAPI']>) { return await this.base.advanceDocumentAPI(...args); }
  async captureRandomItemDataAPI(params?: any) { return await this.api.inventory.captureRandomItemDataAPI(params); }
  async getItemDetailsAPI(...args: Parameters<InventoryAPI['getItemDetailsAPI']>) { return await this.api.inventory.getItemDetailsAPI(...args); }
  async pollStockAPI(...args: Parameters<InventoryAPI['pollStockAPI']>) { return await this.api.inventory.pollStockAPI(...args); }
  async getAccountBalancesAPI() { return await this.base.getAllAccountsAPI(); }
  async getMultiAccountBalancesAPI(...args: Parameters<BasePage['getMultiAccountBalancesAPI']>) { return await this.base.getMultiAccountBalancesAPI(...args); }
  async getAccountBalanceAPI(...args: Parameters<BasePage['getAccountBalanceAPI']>) { return await this.base.getAccountBalanceAPI(...args); }
  async getBillJournalEntriesAPI(...args: Parameters<PurchaseAPI['getBillJournalEntriesAPI']>) { return await this.api.purchase.getBillJournalEntriesAPI(...args); }
}
