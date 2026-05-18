import { test, expect } from '@playwright/test';
import { PortfolioPage } from '../pages/PortfolioPage';

test.describe('Portfolio Page - POM Example Tests', () => {
  let portfolioPage: PortfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolioPage = new PortfolioPage(page);
    // Update URL to your portfolio URL
    await portfolioPage.navigateToPortfolio('https://tekleab.github.io/beffa-automation');
  });

  test('should load portfolio page and verify all sections are visible', async () => {
    const sections = await portfolioPage.verifyAllSectionsPresent();
    expect(sections.hero).toBeTruthy();
    expect(sections.stats).toBeTruthy();
    expect(sections.skills).toBeTruthy();
    expect(sections.experience).toBeTruthy();
    expect(sections.portfolio).toBeTruthy();
    expect(sections.contact).toBeTruthy();
    expect(sections.footer).toBeTruthy();
  });

  test('should verify hero section content', async () => {
    const title = await portfolioPage.hero.getHeroTitle();
    const role = await portfolioPage.hero.getHeroRole();

    expect(title).toContain('Tekleab');
    expect(role).toContain('QA');
  });

  test('should verify stats section data', async () => {
    const statCount = await portfolioPage.stats.getStatCount();
    const numbers = await portfolioPage.stats.getAllStatNumbers();

    expect(statCount).toBeGreaterThan(0);
    expect(numbers.length).toBe(statCount);
  });

  test('should verify skills section has all skill cards', async () => {
    const skillCount = await portfolioPage.skills.getSkillCardCount();
    const skillTitles = await portfolioPage.skills.getSkillCardTitles();

    expect(skillCount).toBeGreaterThan(0);
    expect(skillTitles).toContain('Manual Testing');
    expect(skillTitles).toContain('Test Automation');
    expect(skillTitles).toContain('DevOps & Tools');
  });

  test('should verify experience section', async () => {
    const expRole = await portfolioPage.experience.getExpRole();
    const bulletPoints = await portfolioPage.experience.getExpBulletPoints();

    expect(expRole).toContain('QA Automation Engineer');
    expect(bulletPoints.length).toBeGreaterThan(0);
  });

  test('should verify modules section lists all ERP modules', async () => {
    const modules = await portfolioPage.modules.getAllModules();
    const moduleCount = await portfolioPage.modules.getModuleCount();

    expect(moduleCount).toBeGreaterThan(0);
    expect(modules).toContain('Sales');
    expect(modules).toContain('Inventory');
    expect(modules).toContain('Purchase');
  });

  test('should verify portfolio section with project cards', async () => {
    const cardCount = await portfolioPage.portfolio.getPortfolioCardCount();
    const cardTitles = await portfolioPage.portfolio.getPortfolioCardTitles();

    expect(cardCount).toBeGreaterThan(0);
    expect(cardTitles).toContain('Live Test Dashboard');
  });

  test('should verify contact section with links', async () => {
    const linkCount = await portfolioPage.contact.getContactLinksCount();
    const links = await portfolioPage.contact.getAllContactLinks();

    expect(linkCount).toBeGreaterThan(0);
    expect(links.length).toBe(linkCount);
  });

  test('should verify footer content', async () => {
    const footerText = await portfolioPage.footer.getFooterText();

    expect(footerText).toContain('Tekleab');
    expect(footerText).toContain('2025');
  });

  test('should navigate through sections using nav links', async () => {
    const navLinks = await portfolioPage.navigation.getAllNavLinks();

    expect(navLinks.length).toBeGreaterThan(0);
    expect(navLinks).toContain('Skills');
    expect(navLinks).toContain('Experience');
    expect(navLinks).toContain('Portfolio');
    expect(navLinks).toContain('Contact');
  });

  test('should verify hero action buttons', async () => {
    const isBadgeVisible = await portfolioPage.page.isVisible('.hero-badge');
    const allHeroLinks = await portfolioPage.hero.getAllHeroLinks();

    expect(isBadgeVisible).toBeTruthy();
    expect(allHeroLinks.length).toBeGreaterThan(0);
  });

  test('should retrieve portfolio card details', async () => {
    const dashboardCard = await portfolioPage.portfolio.getPortfolioCardByTitle('Live Test Dashboard');

    expect(dashboardCard).toBeTruthy();
    expect(dashboardCard?.title).toContain('Live Test Dashboard');
    expect(dashboardCard?.href).toBeTruthy();
  });

  test('should verify responsive page load', async () => {
    const isResponsive = await portfolioPage.verifyResponsiveness();
    expect(isResponsive).toBeTruthy();
  });
});
