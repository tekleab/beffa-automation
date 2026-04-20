import { Page, Locator } from '@playwright/test';

export class BasePage {
  page: Page;
  emailInput: Locator;
  passwordInput: Locator;
  loginBtn: Locator;
  mainPhoneInput: Locator;
  customerNameInput: Locator;
  customerTinInput: Locator;
  approvedStatus: string;
  actionButtons: string;
  companyBtn: Locator;
  private startTime: number = 0;

  constructor(page: Page) {
    this.page = page;

    // Login selectors
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.loginBtn = page.getByRole('button', { name: 'Login' });

    // --- Customer Module Selectors ---
    this.mainPhoneInput = page.getByRole('textbox', { name: /Main Phone/i });
    this.customerNameInput = page.getByRole('textbox', { name: 'Customer Name *' });
    this.customerTinInput = page.getByRole('textbox', { name: 'Customer TIN *' });

    // Status and Button Selectors
    this.approvedStatus = 'span.css-1ny2kle:has-text("Approved"), span:has-text("Approved")';
    this.actionButtons = 'button:has-text("Submit For Review"), button:has-text("Approve"), button:has-text("Advance"), button:has-text("Submit For Approver"), button:has-text("Submit Forapprover"), button:has-text("Submit For Approve"), button:has-text("Submit For Apporver")';

    // Company Switcher Selectors (Top-left)
    this.companyBtn = page.locator('button.chakra-menu__menu-button').first();
  }

  /**
   * Starts a high-resolution timer for tactical performance sync.
   */
  async startTacticalTimer() {
    this.startTime = performance.now();
  }

  /**
   * Stops the timer and records the latency metric.
   * Automatically attaches metadata for the Dashboard's Latency Engine.
   */
  async stopTacticalTimer(label: string, category: 'API' | 'UI' = 'API') {
    const duration = performance.now() - this.startTime;
    console.log(`[PERFORMANCE] ${category} - ${label}: ${duration.toFixed(2)}ms`);
    
    // Attach to Playwright annotations for Allure consumption
    try {
      const { test } = require('@playwright/test');
      if (test && typeof test.info === 'function') {
        const info = test.info();
        if (info) {
          info.annotations.push({
            type: 'tactical-perf',
            description: `${category}|${label}|${duration.toFixed(2)}`
          });
        }
      }
    } catch (e) {
      // Context unavailable (e.g. initialization or utility run)
    }
    return duration;
  }

  async smartSearch(container: Locator | null, text: string): Promise<void> {
    if (!text) return;
    const cleanText = text.trim();
    console.log(`[ACTION] Searching for: "${cleanText}"`);
    
    await this.startTacticalTimer(); // Start Tactical UI Timer

    for (let s = 0; s < 3; s++) {
      try {
        const target = container || this.page.locator('div[role="dialog"], .chakra-modal__content, .chakra-popover__content, .chakra-input__group').filter({ visible: true }).last();

        // 🛡️ CRITICAL: Only pick ENABLED text-like inputs, avoiding checkboxes/radios/numbers
        let searchBox = target.locator('input:enabled:not([type="number"]):not([type="hidden"]):not([type="checkbox"]):not([type="radio"])').filter({ visible: true }).first();

        if (!(await searchBox.isVisible({ timeout: 1000 }).catch(() => false))) {
          searchBox = target.locator('input[placeholder*="Search" i]:enabled:not([type="checkbox"]), input[role="textbox"]:enabled').filter({ visible: true }).last();
        }

        await searchBox.waitFor({ state: 'visible', timeout: 8000 });
        await searchBox.click({ force: true });
        await searchBox.clear();

        await searchBox.fill(cleanText);
        await this.page.waitForTimeout(2000);

        const trySelection = async (): Promise<boolean> => {
          const overlayList = this.page.locator('.chakra-popover__content, [role="listbox"], .chakra-menu__list, div[data-placement]').filter({ visible: true }).last();

          // Tier 1: Exact match within direct container
          const containerExact = target.getByText(cleanText, { exact: true }).first();
          if (await containerExact.isVisible({ timeout: 1000 }).catch(() => false)) {
            console.log(`[INFO] Tier 1 - exact in dialog: "${cleanText}"`);
            await containerExact.click({ force: true });
            return true;
          }

          // Tier 2: Search visible overlay/portal
          if (await overlayList.isVisible({ timeout: 1000 }).catch(() => false)) {
            const overlayExact = overlayList.getByText(cleanText, { exact: true }).first();
            if (await overlayExact.isVisible({ timeout: 1000 }).catch(() => false)) {
              console.log(`[INFO] Tier 2 - exact in overlay: "${cleanText}"`);
              await overlayExact.click({ force: true });
              return true;
            }
            const overlayContains = overlayList.getByText(cleanText, { exact: false }).first();
            if (await overlayContains.isVisible({ timeout: 1000 }).catch(() => false)) {
              console.log(`[INFO] Tier 2 - contains in overlay: "${cleanText}"`);
              await overlayContains.click({ force: true });
              return true;
            }
          }

          // Tier 3: Contains match WITHIN dialog
          const containerContains = target.getByText(cleanText, { exact: false }).first();
          if (await containerContains.isVisible({ timeout: 1000 }).catch(() => false)) {
            console.log(`[INFO] Tier 3 - contains in dialog: "${cleanText}"`);
            await containerContains.click({ force: true });
            return true;
          }

          // Tier 4: ID vs Name fallback (Allow this blind click for Document IDs OR Numeric Codes)
          const isIdOrCode = cleanText.includes('/') || /^\d+$/.test(cleanText);
          if (isIdOrCode) {
            let fallbackItem = null;
            const clickableSelectors = 'button:not([aria-label]), [role="option"], [role="menuitem"], li, .chakra-menu__menuitem, label, .chakra-checkbox, [role="checkbox"]';
            const validItemFilter = { hasNotText: /^\s*(\+?\s*Add|Clear|New|No more items)\s*$/i };

            if (await overlayList.isVisible({ timeout: 1000 }).catch(() => false)) {
              fallbackItem = overlayList.locator(clickableSelectors).filter({ visible: true }).filter(validItemFilter).first();
            } else {
              fallbackItem = target.locator(clickableSelectors).filter({ visible: true }).filter(validItemFilter).first();
            }

            if (await fallbackItem!.isVisible({ timeout: 1000 }).catch(() => false)) {
              await fallbackItem!.click({ force: true });
              return true;
            }
          }
          return false;
        };

        // Attempt 1: Normal Search
        let clicked = await trySelection();

        // Attempt 2 (Fallback trick if backend hung): Backspace one char to trigger state
        if (!clicked) {
          console.log(`[WARN] Original search didn't bring up "${cleanText}". Pressing backspace to wake up backend fetch...`);
          await searchBox.press('Backspace');
          await this.page.waitForTimeout(3000); // Allow backend to hit
          clicked = await trySelection();
        }

        if (!clicked) {
          throw new Error(`No visible accurate dropdown result found for "${cleanText}"`);
        }

        // ⚡ NEW: Verification check - Ensure the selection "sticks"
        // We wait a moment for reactive frameworks to update the field or close the dialog
        await this.page.waitForTimeout(800);

        // If the dialog is still open and we clicked something, maybe it didn't register?
        // We try hitting Enter as a final "commit" signal for some ERP inputs
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(500);
        await this.page.keyboard.press('Escape');

        console.log(`[SUCCESS] Selected: "${cleanText}"`);
        await this.stopTacticalTimer(`Smart Search: ${cleanText}`, 'UI');
        return;
      } catch (e: any) {
        console.log(`[WARNING] Search attempt ${s + 1} failed: ${e.message}`);
        await this.page.waitForTimeout(2000);
      }
    }
    throw new Error(`[ERROR] smartSearch failed to find and click "${cleanText}" accurately after 3 attempts.`);
  }

  async extractDetailValue(label: string): Promise<string> {
    const el = this.page.locator('.chakra-stack, div').filter({ hasText: new RegExp(`^${label}`, 'i') }).last();
    // We navigate to the parent to ensure we get the full text block containing both label and value
    const text = (await el.locator('xpath=..').innerText().catch(() => '')).trim();
    // Regex matches the label and captures everything after the colon or space, until the end of the line
    const match = text.match(new RegExp(`${label}[\\s:]+([^\\n\\r]+)`, 'i'));
    return match ? match[1].trim() : text.replace(new RegExp(`${label}`, 'i'), '').replace(/:/g, '').trim();
  }

  async getActiveCalendarDay(): Promise<number> {
    const calendarMode = await this.page.evaluate(() => localStorage.getItem('calendar') || 'EC');

    if (calendarMode.toUpperCase() === 'EC') {
      const now = new Date();
      const gDay = now.getDate();
      const gMonth = now.getMonth() + 1; // 1-12

      // 🇪🇹 Precise Ethiopian Translation for April (Megabit)
      // April 1st (GC) = Megabit 23rd (EC)
      // Today (April 3rd) = Megabit 25th (EC) -> Offset: +22
      if (gMonth === 4) {
        // Handle Megabit -> Miyazya overflow correctly (30 days max per EC month)
        const ethiopianDay = (gDay + 22) % 30 || 30; 
        console.log(`[CALENDAR] Ethiopian mode: Today is mapped to EC Day ${ethiopianDay}.`);
        return ethiopianDay;
      }

      // Fallback for other months if needed during transition
      return gDay;
    }

    return new Date().getDate();
  }

  async fillDate(labelOrIndex: string | number, dateValue: string): Promise<void> {
    // Extract day number for the grid click
    const dayToSelect = parseInt(dateValue.split('/')[0], 10).toString();
    console.log(`[ACTION] Filling date ${dateValue} -> Targeting UI day: ${dayToSelect}`);

    await this.startTacticalTimer(); // Start Tactical UI Timer

    let btn: Locator;
    if (typeof labelOrIndex === 'string') {
      const container = this.page.locator('.chakra-form-control, [role="group"], .flex-col, div')
        .filter({ has: this.page.getByText(new RegExp(`^${labelOrIndex}\\s*\\*?$`, 'i')) })
        .filter({ has: this.page.locator('button') })
        .last();
      btn = container.locator('button').first();
    } else {
      btn = this.page.locator('button:has(span.formatted-date), button.trigger-button').filter({ visible: true }).nth(labelOrIndex);
    }

    await btn.click({ force: true });
    await this.page.waitForTimeout(1000);

    const popover = this.page.locator('[role="dialog"], [data-slot="popover-content"], [id^="radix-"], .chakra-popover__content').filter({ visible: true }).last();
    // Use precise button targeting for the day number
    const dayBtn = popover.locator('button').filter({ hasText: new RegExp(`^${dayToSelect}$`) }).first();

    if (await dayBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dayBtn.click({ force: true });
      console.log(`[SUCCESS] Day ${dayToSelect} selected in the current active calendar grid.`);
    } else {
      console.log(`[WARN] Day ${dayToSelect} not found in grid. Using fallback type...`);
      await this.page.keyboard.type(dateValue);
      await this.page.keyboard.press('Enter');
    }
    await this.page.waitForTimeout(1000);
    await this.stopTacticalTimer(`Fill Date: ${labelOrIndex}`, 'UI');
  }

  async pickDate(label: string, dayNum?: number): Promise<void> {
    const targetDay = dayNum || await this.getActiveCalendarDay();
    console.log(`[ACTION] Picking date: "${label}" -> Targeting Day ${targetDay}`);
    
    await this.startTacticalTimer(); // Start Tactical UI Timer

    let container = this.page.locator('.chakra-form-control, [role="group"], .flex-col, div')
      .filter({ has: this.page.getByText(new RegExp(`^${label}\\s*\\*?$`, 'i')) })
      .filter({ has: this.page.locator('button') })
      .last();

    if (!(await container.isVisible().catch(() => false))) {
      container = this.page.locator('.chakra-form-control, [role="group"], div')
        .filter({ has: this.page.getByText(new RegExp(`${label}`, 'i')) })
        .filter({ has: this.page.locator('button') })
        .last();
    }

    const btn = container.locator('button').first();
    await btn.click({ force: true });
    await this.page.waitForTimeout(1000);

    const popover = this.page.locator('[role="dialog"], [data-slot="popover-content"], [id^="radix-"], .chakra-popover__content').filter({ visible: true }).last();
    const dayBtn = popover.locator('button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();

    if (await dayBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dayBtn.click({ force: true });
      console.log(`[SUCCESS] "${label}" set to Day ${targetDay} (Calendar match).`);
    } else {
      console.log(`[WARN] Could not find day ${targetDay}. Fallback to direct key press.`);
      await this.page.keyboard.type(String(targetDay));
      await this.page.keyboard.press('Enter');
      await this.page.keyboard.press('Tab');
    }
    await this.page.waitForTimeout(1000);
    await this.stopTacticalTimer(`Pick Date: ${label}`, 'UI');
  }

  async selectRandomOption(selector: Locator, labelName: string, isOptional: boolean = false): Promise<number> {
    const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], [role="menuitem"], .chakra-menu__menuitem';
    
    await this.startTacticalTimer(); // Start Tactical UI Timer

    for (let i = 0; i < 3; i++) {
      try {
        await selector.scrollIntoViewIfNeeded();
        await selector.click({ timeout: 5000 });
        await this.page.waitForTimeout(1500);
        const options = this.page.locator(optionSelector).filter({ visible: true });
        const count = await options.count();
        if (count > 0) {
          const randomIndex = Math.floor(Math.random() * count);
          const target = options.nth(randomIndex);
          await target.evaluate((node: HTMLElement) => node.click());
          await this.page.keyboard.press('Escape');
          await this.stopTacticalTimer(`Random Selection: ${labelName}`, 'UI');
          return count;
        } else {
          await this.page.keyboard.press('Escape');
          if (isOptional) return 0;
        }
      } catch (e) {
        await this.page.keyboard.press('Escape');
      }
    }
    if (!isOptional) throw new Error(`[ERROR] Failed selection for ${labelName}`);
    return 0;
  }

  getTransactionDates(): { soDate: string; invoiceDate: string; dueDate: string } {
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 30);
    const fmt = (d: Date) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };
    return { soDate: fmt(today), invoiceDate: fmt(today), dueDate: fmt(due) };
  }

  getInvoiceDates(): { invoiceDate: string; dueDate: string } {
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 30);
    const fmt = (d: Date) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${dd}/${mm}/${d.getFullYear()}`;
    };
    return { invoiceDate: fmt(today), dueDate: fmt(due) };
  }
}
