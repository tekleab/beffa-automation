import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class Footer extends BasePage {
  readonly footer = 'footer';
  readonly footerText = 'footer p';

  constructor(page: Page) {
    super(page);
  }

  async isFooterVisible() {
    return await this.isElementVisible(this.footer);
  }

  async getFooterText() {
    return await this.getText(this.footerText);
  }

  async footerContainsYear(year: string) {
    const text = await this.getText(this.footerText);
    return text?.includes(year) || false;
  }

  async footerContainsName(name: string) {
    const text = await this.getText(this.footerText);
    return text?.includes(name) || false;
  }
}
