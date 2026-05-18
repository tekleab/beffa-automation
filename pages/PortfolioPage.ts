import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ModulesSection } from './components/ModulesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export class PortfolioPage extends BasePage {
  readonly navigation: Navigation;
  readonly hero: HeroSection;
  readonly stats: StatsSection;
  readonly skills: SkillsSection;
  readonly experience: ExperienceSection;
  readonly modules: ModulesSection;
  readonly portfolio: PortfolioSection;
  readonly contact: ContactSection;
  readonly footer: Footer;

  constructor(page: Page) {
    super(page);
    this.navigation = new Navigation(page);
    this.hero = new HeroSection(page);
    this.stats = new StatsSection(page);
    this.skills = new SkillsSection(page);
    this.experience = new ExperienceSection(page);
    this.modules = new ModulesSection(page);
    this.portfolio = new PortfolioSection(page);
    this.contact = new ContactSection(page);
    this.footer = new Footer(page);
  }

  async navigateToPortfolio(url: string) {
    await this.goto(url);
    await this.waitForLoad();
  }

  async navigateToSection(sectionId: string) {
    await this.scrollToSection(`#${sectionId}`);
  }

  async getPageMeta() {
    return {
      title: await this.getPageTitle(),
      heroTitle: await this.hero.getHeroTitle(),
      heroRole: await this.hero.getHeroRole(),
      heroSubtitle: await this.hero.getHeroSubtitle(),
    };
  }

  async verifyAllSectionsPresent() {
    return {
      hero: await this.hero.isHeroVisible(),
      stats: await this.stats.isStatsVisible(),
      skills: await this.skills.isSkillsSectionVisible(),
      experience: await this.experience.isExperienceSectionVisible(),
      modules: await this.modules.isSectionVisible(),
      portfolio: await this.portfolio.isPortfolioSectionVisible(),
      contact: await this.contact.isContactSectionVisible(),
      footer: await this.footer.isFooterVisible(),
    };
  }

  async verifyNavigation() {
    const navLinks = await this.navigation.getAllNavLinks();
    return navLinks.length > 0;
  }

  async verifyResponsiveness() {
    const viewportSize = this.page.viewportSize();
    return viewportSize !== null;
  }
}
