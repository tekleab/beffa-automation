import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class PortfolioSection extends BasePage {
  readonly portfolioSection = '#portfolio';
  readonly sectionTag = '#portfolio .section-tag';
  readonly sectionTitle = '#portfolio .section-title';
  readonly sectionSub = '#portfolio .section-sub';
  readonly pCard = '.p-card';
  readonly pCardH3 = '.p-card h3';
  readonly pCardP = '.p-card p';

  constructor(page: Page) {
    super(page);
  }

  async isPortfolioSectionVisible() {
    return await this.isElementVisible(this.portfolioSection);
  }

  async getSectionTag() {
    return await this.getText(this.sectionTag);
  }

  async getSectionTitle() {
    return await this.getText(this.sectionTitle);
  }

  async getSectionSubtitle() {
    return await this.getText(this.sectionSub);
  }

  async getPortfolioCardCount() {
    return await this.page.locator(this.pCard).count();
  }

  async getPortfolioCardTitles() {
    return await this.page.locator(this.pCardH3).allTextContents();
  }

  async getPortfolioCardDescriptions() {
    return await this.page.locator(this.pCardP).allTextContents();
  }

  async clickPortfolioCard(title: string) {
    await this.page.locator(`.p-card:has-text("${title}")`).click();
  }

  async getPortfolioCardByTitle(title: string) {
    const cards = await this.page.locator(this.pCard).all();
    for (const card of cards) {
      const cardTitle = await card.locator(this.pCardH3).textContent();
      if (cardTitle?.includes(title)) {
        return {
          title: cardTitle,
          description: await card.locator(this.pCardP).textContent(),
          href: await card.getAttribute('href'),
        };
      }
    }
    return null;
  }
}
