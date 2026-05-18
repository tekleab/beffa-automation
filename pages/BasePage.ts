import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async isElementVisible(selector: string) {
    return await this.page.isVisible(selector);
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async getText(selector: string) {
    return await this.page.textContent(selector);
  }

  async scrollToSection(sectionId: string) {
    await this.page.evaluate((id) => {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }, sectionId);
  }
}
