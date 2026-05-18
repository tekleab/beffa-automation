import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class StatsSection extends BasePage {
  readonly statsContainer = '.stats';
  readonly statNumber = '.stat-number';
  readonly statLabel = '.stat-label';
  readonly stat = '.stat';

  constructor(page: Page) {
    super(page);
  }

  async isStatsVisible() {
    return await this.isElementVisible(this.statsContainer);
  }

  async getStatCount() {
    return await this.page.locator(this.stat).count();
  }

  async getAllStatNumbers() {
    return await this.page.locator(this.statNumber).allTextContents();
  }

  async getAllStatLabels() {
    return await this.page.locator(this.statLabel).allTextContents();
  }

  async getStatByLabel(label: string) {
    const statElements = await this.page.locator(this.stat).all();
    for (const stat of statElements) {
      const text = await stat.locator(this.statLabel).textContent();
      if (text?.includes(label)) {
        return {
          number: await stat.locator(this.statNumber).textContent(),
          label: text,
        };
      }
    }
    return null;
  }
}
