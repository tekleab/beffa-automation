import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class HeroSection extends BasePage {
  readonly heroBadge = '.hero-badge';
  readonly h1Name = '.h1-name';
  readonly h1Role = '.h1-role';
  readonly heroSub = '.hero-sub';
  readonly btnPrimary = '.btn-primary';
  readonly btnOutline = '.btn-outline';
  readonly heroLink = (text: string) => `.hero-link:has-text("${text}")`;
  readonly heroSection = '.hero';

  constructor(page: Page) {
    super(page);
  }

  async isHeroVisible() {
    return await this.isElementVisible(this.heroSection);
  }

  async getHeroTitle() {
    return await this.getText(this.h1Name);
  }

  async getHeroRole() {
    return await this.getText(this.h1Role);
  }

  async getHeroSubtitle() {
    return await this.getText(this.heroSub);
  }

  async getBadgeText() {
    return await this.getText(this.heroBadge);
  }

  async clickViewWorkButton() {
    await this.click(this.btnPrimary);
  }

  async clickGetInTouchButton() {
    await this.click(this.btnOutline);
  }

  async clickHeroLink(linkText: string) {
    await this.click(this.heroLink(linkText));
  }

  async getAllHeroLinks() {
    return await this.page.locator('.hero-link').allTextContents();
  }
}
