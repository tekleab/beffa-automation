import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ExperienceSection extends BasePage {
  readonly experienceSection = '#experience';
  readonly sectionTag = '#experience .section-tag';
  readonly sectionTitle = '#experience .section-title';
  readonly sectionSub = '#experience .section-sub';
  readonly expCard = '.exp-card';
  readonly expRole = '.exp-role';
  readonly expDate = '.exp-date';
  readonly expCompany = '.exp-company';
  readonly expBullets = '.exp-bullets li';

  constructor(page: Page) {
    super(page);
  }

  async isExperienceSectionVisible() {
    return await this.isElementVisible(this.experienceSection);
  }

  async getSectionTag() {
    return await this.getText(this.sectionTag);
  }

  async getSectionTitle() {
    return await this.getText(this.sectionTitle);
  }

  async getExpCardCount() {
    return await this.page.locator(this.expCard).count();
  }

  async getExpRole() {
    return await this.getText(this.expRole);
  }

  async getExpDate() {
    return await this.getText(this.expDate);
  }

  async getExpCompany() {
    return await this.getText(this.expCompany);
  }

  async getExpBulletPoints() {
    return await this.page.locator(this.expBullets).allTextContents();
  }

  async getBulletPointCount() {
    return await this.page.locator(this.expBullets).count();
  }
}
