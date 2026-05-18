# Portfolio Page Object Model (POM)

This directory contains a complete Page Object Model implementation for testing the Tekleab Hadush portfolio page using Playwright and TypeScript.

## Directory Structure

```
pages/
├── BasePage.ts                 # Base class with common page methods
├── PortfolioPage.ts           # Main portfolio page combining all sections
├── index.ts                   # Barrel export for all components
└── components/
    ├── Navigation.ts          # Navigation bar component
    ├── HeroSection.ts         # Hero/landing section
    ├── StatsSection.ts        # Statistics cards section
    ├── SkillsSection.ts       # Skills and toolset section
    ├── ExperienceSection.ts   # Work experience section
    ├── ModulesSection.ts      # ERP modules coverage section
    ├── PortfolioSection.ts    # Portfolio and projects section
    ├── ContactSection.ts      # Contact information section
    └── Footer.ts              # Footer component
```

## Architecture Overview

### BasePage.ts
Base class providing common functionality:
- Page navigation
- Element visibility checks
- Click and text retrieval actions
- Section scrolling

### Component Classes
Each page section has its own class with:
- **Selectors**: CSS selectors for all interactive elements
- **Methods**: Reusable actions and assertions specific to that section
- **Data Retrieval**: Methods to extract content like text, counts, or specific data

### PortfolioPage.ts
Main orchestrator class that:
- Initializes all component instances
- Provides unified access to all sections
- Implements page-level actions (navigation, meta information)
- Includes verification helpers for testing

## Usage Examples

### Basic Page Load Test
```typescript
import { PortfolioPage } from '../pages';
import { test, expect } from '@playwright/test';

test('portfolio page loads', async ({ page }) => {
  const portfolio = new PortfolioPage(page);
  await portfolio.navigateToPortfolio('https://example.com/portfolio');
  
  const sections = await portfolio.verifyAllSectionsPresent();
  expect(sections.hero).toBeTruthy();
});
```

### Component-Specific Testing
```typescript
// Test hero section
const title = await portfolio.hero.getHeroTitle();
const links = await portfolio.hero.getAllHeroLinks();

// Test skills section
const skillCards = await portfolio.skills.getSkillCardCount();
const skills = await portfolio.skills.getSkillsByCategory('Manual Testing');

// Test portfolio cards
const cards = await portfolio.portfolio.getPortfolioCardCount();
const dashCard = await portfolio.portfolio.getPortfolioCardByTitle('Live Test Dashboard');
```

### Navigation Testing
```typescript
// Get all navigation links
const links = await portfolio.navigation.getAllNavLinks();

// Click specific nav link
await portfolio.navigation.clickNavLink('#portfolio');
```

## Component Methods Reference

### Navigation
- `getNavLogo()` - Get navigation logo text
- `clickNavLink(href)` - Click a navigation link
- `isNavVisible()` - Check if nav is visible
- `getAllNavLinks()` - Get all nav link texts

### HeroSection
- `getHeroTitle()` - Get main heading
- `getHeroRole()` - Get role/subtitle
- `getHeroSubtitle()` - Get descriptive text
- `getBadgeText()` - Get status badge text
- `clickViewWorkButton()` - Click "View My Work" button
- `clickGetInTouchButton()` - Click "Get In Touch" button
- `getAllHeroLinks()` - Get all hero section links

### StatsSection
- `getStatCount()` - Get number of stats
- `getAllStatNumbers()` - Get all stat numbers
- `getAllStatLabels()` - Get all stat labels
- `getStatByLabel(label)` - Get specific stat by label

### SkillsSection
- `getSkillCardCount()` - Get number of skill cards
- `getSkillCardTitles()` - Get all skill category titles
- `getSkillsByCategory(category)` - Get skills for a category
- `getAllSkillTags()` - Get all individual skill tags

### ExperienceSection
- `getExpRole()` - Get job role
- `getExpDate()` - Get employment date range
- `getExpCompany()` - Get company name
- `getExpBulletPoints()` - Get all bullet points
- `getBulletPointCount()` - Get number of bullets

### ModulesSection
- `getModuleCount()` - Get number of modules
- `getAllModules()` - Get all module names
- `getModuleByName(name)` - Check if specific module exists

### PortfolioSection
- `getPortfolioCardCount()` - Get number of project cards
- `getPortfolioCardTitles()` - Get all project titles
- `getPortfolioCardDescriptions()` - Get all descriptions
- `clickPortfolioCard(title)` - Click specific project
- `getPortfolioCardByTitle(title)` - Get full card data

### ContactSection
- `getContactLinksCount()` - Get number of contact links
- `getAllContactLinks()` - Get all contact link texts
- `clickContactLink(text)` - Click specific contact link
- `getContactLinkHref(text)` - Get link URL

### Footer
- `getFooterText()` - Get footer content
- `footerContainsYear(year)` - Check for year in footer
- `footerContainsName(name)` - Check for name in footer

## Test Examples

See `tests/portfolio/portfolio-page.spec.ts` for comprehensive test examples covering:
- Section visibility verification
- Content validation
- Navigation testing
- Data extraction and assertion
- Cross-section integration tests

## Best Practices

1. **Use Component Methods**: Always use component methods instead of direct page selectors
2. **Meaningful Names**: Component selectors and methods clearly indicate their purpose
3. **Reusability**: Methods are designed to be used in multiple test scenarios
4. **Maintainability**: Changes to selectors only need to be made in one place
5. **Clear Assertions**: Test code focuses on business logic, not implementation details

## Running Tests

```bash
# Run all portfolio tests
npm run test tests/portfolio/

# Run with headed mode to see browser
npm run test:headed tests/portfolio/

# Run specific test
npm run test tests/portfolio/portfolio-page.spec.ts -g "hero section"
```

## Extending the POM

To add new components or methods:

1. **Add new selectors** to the appropriate component class
2. **Create methods** that interact with those selectors
3. **Export** the component from `index.ts`
4. **Add the component** to `PortfolioPage` constructor
5. **Update test examples** with usage of new methods

Example of adding a new component method:
```typescript
async getSkillLevel(skillName: string) {
  return await this.page
    .locator(`.tag:has-text("${skillName}")`)
    .getAttribute('data-level');
}
```

## Notes

- All selectors are CSS-based for consistency
- Methods return human-readable data (text, counts, boolean)
- Error handling is delegated to Playwright's assertions
- Page waits are handled by `waitForLoad()` in navigate methods
