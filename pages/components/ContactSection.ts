import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ContactSection extends BasePage {
  readonly contactSection = '#contact';
  readonly contactBox = '.contact-box';
  readonly sectionTag = '#contact .section-tag';
  readonly sectionTitle = '#contact .section-title';
  readonly contactSub = '.contact-box p';
  readonly contactLink = '.c-link';

  constructor(page: Page) {
    super(page);
  }

  async isContactSectionVisible() {
    return await this.isElementVisible(this.contactSection);
  }

  async getSectionTag() {
    return await this.getText(this.sectionTag);
  }

  async getSectionTitle() {
    return await this.getText(this.sectionTitle);
  }

  async getContactMessage() {
    return await this.getText(this.contactSub);
  }

  async getContactLinksCount() {
    return await this.page.locator(this.contactLink).count();
  }

  async getAllContactLinks() {
    return await this.page.locator(this.contactLink).allTextContents();
  }

  async clickContactLink(linkText: string) {
    await this.click(`.c-link:has-text("${linkText}")`);
  }

  async getContactLinkHref(linkText: string) {
    return await this.page
      .locator(`.c-link:has-text("${linkText}")`)
      .getAttribute('href');
  }
}
