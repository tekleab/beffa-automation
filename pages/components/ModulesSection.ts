import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ModulesSection extends BasePage {
  readonly sectionTag = 'section:has-text("Coverage") .section-tag';
  readonly sectionTitle = 'section:has-text("Coverage") .section-title';
  readonly modulePill = '.module-pill';

  constructor(page: Page) {
    super(page);
  }

  async isSectionVisible() {
    return await this.isElementVisible(this.modulePill);
  }

  async getModuleCount() {
    return await this.page.locator(this.modulePill).count();
  }

  async getAllModules() {
    return await this.page.locator(this.modulePill).allTextContents();
  }

  async getModuleByName(moduleName: string) {
    return await this.page.locator(`.module-pill:has-text("${moduleName}")`).isVisible();
  }

  async getSectionTitle() {
    return await this.getText(this.sectionTitle);
  }

  async getSectionTag() {
    return await this.getText(this.sectionTag);
  }
}
