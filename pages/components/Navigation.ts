import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class Navigation extends BasePage {
  readonly navLogo = 'nav .nav-logo';
  readonly navLinks = 'nav .nav-links';
  readonly navLink = (href: string) => `nav .nav-links a[href="${href}"]`;

  constructor(page: Page) {
    super(page);
  }

  async getNavLogo() {
    return await this.getText(this.navLogo);
  }

  async clickNavLink(href: string) {
    await this.click(this.navLink(href));
  }

  async isNavVisible() {
    return await this.isElementVisible('nav');
  }

  async getAllNavLinks() {
    return await this.page.locator('nav .nav-links a').allTextContents();
  }
}
