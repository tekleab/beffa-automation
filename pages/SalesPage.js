const { BasePage } = require('../lib/BasePage');
const { expect } = require('@playwright/test');

class SalesPage extends BasePage {
  constructor(page) {
    super(page);
  }
}

module.exports = { SalesPage };
