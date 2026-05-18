import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class SkillsSection extends BasePage {
  readonly skillsSection = '#skills';
  readonly sectionTag = '#skills .section-tag';
  readonly sectionTitle = '#skills .section-title';
  readonly sectionSub = '#skills .section-sub';
  readonly skillCard = '.skill-card';
  readonly skillCardIcon = '.skill-card-icon';
  readonly skillCardH3 = '.skill-card h3';
  readonly skillTags = '.tag';

  constructor(page: Page) {
    super(page);
  }

  async isSkillsSectionVisible() {
    return await this.isElementVisible(this.skillsSection);
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

  async getSkillCardCount() {
    return await this.page.locator(this.skillCard).count();
  }

  async getSkillCardTitles() {
    return await this.page.locator(this.skillCardH3).allTextContents();
  }

  async getSkillsByCategory(category: string) {
    const cards = await this.page.locator(this.skillCard).all();
    for (const card of cards) {
      const title = await card.locator(this.skillCardH3).textContent();
      if (title?.includes(category)) {
        return await card.locator(this.skillTags).allTextContents();
      }
    }
    return [];
  }

  async getAllSkillTags() {
    return await this.page.locator(this.skillTags).allTextContents();
  }
}
