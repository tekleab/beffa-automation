const { AuthManager } = require('../lib/AuthManager');
const { BasePage } = require('../lib/BasePage');
const { SalesAPI } = require('../lib/api/SalesAPI');
const { PurchaseAPI } = require('../lib/api/PurchaseAPI');
const { InventoryAPI } = require('../lib/api/InventoryAPI');
const { SharedUI } = require('./components/SharedUI');
const { SalesPage } = require('./SalesPage');
const { PurchasePage } = require('./PurchasePage');
const { InventoryPage } = require('./InventoryPage');

class AppManager {
  constructor(page) {
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

    // Company Switcher Selectors (Top-left)
    this.companyBtn = page.locator('button.chakra-menu__menu-button').first();

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
    this.ui.sales._getAuthToken = this.auth._getAuthToken.bind(this.auth);
    
    this.ui.shared.smartSearch = this.base.smartSearch.bind(this.base);
    this.ui.purchase.smartSearch = this.base.smartSearch.bind(this.base);
    this.ui.sales.smartSearch = this.base.smartSearch.bind(this.base);
    this.ui.inventory.smartSearch = this.base.smartSearch.bind(this.base);

    // Bind date helpers
    this.ui.shared.fillDate = this.base.fillDate.bind(this.base);
    this.ui.purchase.fillDate = this.base.fillDate.bind(this.base);
    this.ui.sales.fillDate = this.base.fillDate.bind(this.base);
  }
  async login(...args) { return await this.auth.login(...args); }
  async switchCompany(...args) { return await this.auth.switchCompany(...args); }
  async smartSearch(...args) { return await this.base.smartSearch(...args); }
  async handleApprovalFlow(...args) { return await this.ui.shared.handleApprovalFlow(...args); }
  async _handleReviewerSelection(...args) { return await this.ui.shared._handleReviewerSelection(...args); }
  getTransactionDates(...args) { return this.base.getTransactionDates(...args); }
  async getActiveCalendarDay(...args) { return await this.base.getActiveCalendarDay(...args); }
  async fillDate(...args) { return await this.base.fillDate(...args); }
  async pickDate(...args) { return await this.base.pickDate(...args); }
  async selectRandomOption(...args) { return await this.base.selectRandomOption(...args); }
  async verifyDocInProfile(...args) { return await this.ui.shared.verifyDocInProfile(...args); }
  async findApprovedUnpaidBill(...args) { return await this.ui.purchase.findApprovedUnpaidBill(...args); }
  async findApprovedUnpaidInvoice(...args) { return await this.ui.sales.findApprovedUnpaidInvoice(...args); }
  async captureJournalEntries(...args) { return await this.ui.shared.captureJournalEntries(...args); }
  async handlePOReceiptTab(...args) { return await this.ui.purchase.handlePOReceiptTab(...args); }
  async handleSOReleasedTab(...args) { return await this.ui.sales.handleSOReleasedTab(...args); }
  getInvoiceDates(...args) { return this.base.getInvoiceDates(...args); }
  async captureRandomItemDataAPI(...args) { return await this.api.inventory.captureRandomItemDataAPI(...args); }
  async captureRandomItemDetails() {
    const target = await this.api.inventory.captureRandomItemDataAPI();
    console.log(`[OK] Discovered: "${target.itemName}" via API | Stock: ${target.currentStock}`);
    return target;
  }
  async extractDetailValue(...args) { return await this.base.extractDetailValue(...args); }
  async captureSODetailData(...args) { return await this.ui.sales.captureSODetailData(...args); }
  async getCustomerNameAPI(...args) { return await this.api.sales.getCustomerNameAPI(...args); }
  async captureRandomCustomerDetails(...args) { return await this.ui.sales.captureRandomCustomerDetails(...args); }
  async captureRandomVendorDetails(...args) { return await this.ui.purchase.captureRandomVendorDetails(...args); }
  async captureItemDetails(...args) { return await this.ui.inventory.captureItemDetails(...args); }
  async getItemDetailsAPI(...args) { return await this.api.inventory.getItemDetailsAPI(...args); }
  async _extractItemDetails(...args) { return await this.ui.inventory._extractItemDetails(...args); }
  async verifyLedgerImpact(...args) { return await this.ui.shared.verifyLedgerImpact(...args); }
  async verifyAllJournalEntries(...args) { return await this.ui.shared.verifyAllJournalEntries(...args); }
  async fillEthiopianAddress(...args) { return await this.ui.shared.fillEthiopianAddress(...args); }
  async _getAuthToken(...args) { return await this.auth._getAuthToken(...args); }
  async createSalesOrderAPI(...args) { return await this.api.sales.createSalesOrderAPI(...args); }
  async createInvoiceAPI(...args) { return await this.api.sales.createInvoiceAPI(...args); }
  async createStandaloneInvoiceAPI(...args) { return await this.api.sales.createStandaloneInvoiceAPI(...args); }
  async createPurchaseOrderAPI(...args) { return await this.api.purchase.createPurchaseOrderAPI(...args); }
  async createBillAPI(...args) { return await this.api.purchase.createBillAPI(...args); }
  async createInventoryAdjustmentUI(...args) { return await this.ui.inventory.createInventoryAdjustmentUI(...args); }
  async createInventoryAdjustmentAPI(...args) { return await this.api.inventory.createInventoryAdjustmentAPI(...args); }
  async createInvoiceReceiptAPI(...args) { return await this.api.sales.createInvoiceReceiptAPI(...args); }
  async getInvoiceAPI(...args) { return await this.api.sales.getInvoiceAPI(...args); }
  async createReceiptAPI(...args) { return await this.api.sales.createReceiptAPI(...args); }
  async getJournalEntriesAPI(...args) { return await this.api.inventory.getJournalEntriesAPI(...args); }
  async reverseInvoiceAPI(...args) { return await this.api.sales.reverseInvoiceAPI(...args); }
  async getBillAPI(...args) { return await this.api.purchase.getBillAPI(...args); }
  async approvePaymentAPI(...args) { return await this.api.purchase.approvePaymentAPI(...args); }
  async approveInvoiceAPI(...args) { return await this.api.sales.approveInvoiceAPI(...args); }
  async createBillPaymentAPI(...args) { return await this.api.purchase.createBillPaymentAPI(...args); }

}
module.exports = { AppManager };
