# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> SO-UI-03: Add both Item + Miscellaneous lines → totals shown in SO table
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:156:9

# Error details

```
Error: [pickDate] Could not find date trigger button for label "Sales Order Date"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e6]
      - img [ref=e8]
      - generic [ref=e11]:
        - heading "Welcome to, befa" [level=3] [ref=e12]
        - paragraph [ref=e13]: Empower Your Finances, Simplify Your Success
        - paragraph [ref=e14]: From meticulous bookkeeping to seamless inventory control, we've got your back.
    - generic [ref=e16]:
      - heading "Login To Your Account" [level=2] [ref=e17]
      - generic [ref=e18]:
        - text: Not a member?
        - link "Register" [ref=e19] [cursor=pointer]:
          - /url: /users/register
      - generic [ref=e20]:
        - generic [ref=e21]: You have been logged out because your session has expired!
        - generic [ref=e22]:
          - group [ref=e23]:
            - generic [ref=e24]: Email *
            - textbox "Email *" [ref=e26]:
              - /placeholder: Enter your email
          - group [ref=e27]:
            - generic [ref=e28]: Password *
            - generic [ref=e29]:
              - textbox "Password *" [ref=e30]:
                - /placeholder: Enter your password
              - button "Show password" [ref=e32] [cursor=pointer]:
                - img [ref=e33]
          - link "Forget Password?" [ref=e38] [cursor=pointer]:
            - /url: forget-password
          - button "Login" [ref=e40] [cursor=pointer]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```

# Test source

```ts
  768 |     await this.page.waitForTimeout(1000);
  769 |     await this.stopTacticalTimer(`Fill Date: ${labelOrIndex}`, 'UI');
  770 |   }
  771 | 
  772 |   /**
  773 |    * Queries the API for the open fiscal period's end date (ISO string).
  774 |    * Used by pickDate to guarantee the selected date is within the legal period.
  775 |    */
  776 |   async getOpenPeriodEndDateAPI(): Promise<string | null> {
  777 |     const token = await this._getAuthToken();
  778 |     const year = process.env.BEFFA_YEAR || '2018';
  779 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  780 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  781 |     const company = process.env.BEFFA_COMPANY as string;
  782 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  783 |     const headers = {
  784 |       'Authorization': `Bearer ${token}`,
  785 |       'x-company': company,
  786 |       'x-role': 'IT Administrator / User Manager'
  787 |     };
  788 |     // Try /periods endpoint first, then /fiscal-periods
  789 |     for (const endpoint of ['periods', 'fiscal-periods', 'accounting-periods']) {
  790 |       const resp = await this.safeGet(`${this.apiBase}/${endpoint}?${params}`, { headers });
  791 |       if (!resp.ok()) continue;
  792 |       const data = await resp.json();
  793 |       const list: any[] = data.items || data.data || (Array.isArray(data) ? data : []);
  794 |       // Find the open/active period
  795 |       const open = list.find((p: any) =>
  796 |         (p.status?.toLowerCase() === 'open' || p.is_open === true || p.is_active === true) &&
  797 |         (p.end_date || p.period_end || p.to_date)
  798 |       );
  799 |       if (open) {
  800 |         const endDate = open.end_date || open.period_end || open.to_date;
  801 |         Logger.info(`Open period end date: ${Logger.sanitize(endDate)}`);
  802 |         return endDate;
  803 |       }
  804 |     }
  805 |     return null;
  806 |   }
  807 | 
  808 |   async pickDate(label: string, dayNum?: number): Promise<void> {
  809 |     const { DateHelper } = require('./utils/DateHelper');
  810 |     const resolved = await DateHelper.resolve(this.page);
  811 |     const targetDay = dayNum ?? resolved.dayNumber;
  812 |     const targetMonth = resolved.gcDate.getUTCMonth();
  813 |     const targetYear = resolved.gcDate.getUTCFullYear();
  814 | 
  815 |     Logger.info(`Picking date: "${Logger.sanitize(label)}" → target ${targetYear}-${targetMonth + 1}-${targetDay}`);
  816 |     await this.startTacticalTimer();
  817 | 
  818 |     // Strategy: find the label text, then locate the nearest date-trigger button.
  819 |     // The ERP renders date fields as: <label>Sale Order Date</label> + <button> (calendar icon)
  820 |     // We use a broad regex so "Sale Order Date" and "Sales Order Date" both match.
  821 |     const labelRegex = new RegExp(label.replace(/s?\s+/gi, '.?\\s*'), 'i');
  822 | 
  823 |     // Wait for the page to render the form (any input or button visible)
  824 |     const formReady = await this.page.locator('input, button').first().waitFor({ state: 'visible', timeout: 90000 }).then(() => true).catch(() => false);
  825 |     if (!formReady) {
  826 |       // SPA bundle still loading — wait for network idle then retry
  827 |       await this.page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  828 |       await this.page.locator('input, button').first().waitFor({ state: 'visible', timeout: 30000 });
  829 |     }
  830 | 
  831 |     // Try multiple selector strategies to find the date button
  832 |     let btn: Locator | null = null;
  833 | 
  834 |     // Strategy 1: container has label text + has button
  835 |     for (const containerSel of [
  836 |       '.chakra-form-control',
  837 |       '[role="group"]',
  838 |       '.flex-col',
  839 |       'div'
  840 |     ]) {
  841 |       const container = this.page.locator(containerSel)
  842 |         .filter({ has: this.page.getByText(labelRegex) })
  843 |         .filter({ has: this.page.locator('button') })
  844 |         .last();
  845 |       if (await container.isVisible({ timeout: 2000 }).catch(() => false)) {
  846 |         btn = container.locator('button').first();
  847 |         break;
  848 |       }
  849 |     }
  850 | 
  851 |     // Strategy 2: find label element, then look for adjacent button in parent
  852 |     if (!btn) {
  853 |       const labelEl = this.page.getByText(labelRegex).first();
  854 |       if (await labelEl.isVisible({ timeout: 3000 }).catch(() => false)) {
  855 |         // Walk up to find a parent that contains a button
  856 |         for (const ancestor of ['xpath=..', 'xpath=../..', 'xpath=../../..']) {
  857 |           const parent = labelEl.locator(ancestor);
  858 |           const parentBtn = parent.locator('button').first();
  859 |           if (await parentBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  860 |             btn = parentBtn;
  861 |             break;
  862 |           }
  863 |         }
  864 |       }
  865 |     }
  866 | 
  867 |     if (!btn) {
> 868 |       throw new Error(`[pickDate] Could not find date trigger button for label "${label}"`);
      |             ^ Error: [pickDate] Could not find date trigger button for label "Sales Order Date"
  869 |     }
  870 | 
  871 |     await btn.waitFor({ state: 'visible', timeout: 15000 });
  872 |     await btn.click({ force: true });
  873 |     await this.page.waitForTimeout(800);
  874 | 
  875 |     const popover = this.page.locator('[role="dialog"], [data-slot="popover-content"], [id^="radix-"], .chakra-popover__content').filter({ visible: true }).last();
  876 | 
  877 |     // Navigate the calendar to the correct month/year
  878 |     const headerBtns = popover.locator('button').filter({ hasNotText: /^\d{1,2}$/ });
  879 |     const prevBtn = headerBtns.first();
  880 |     const nextBtn = headerBtns.last();
  881 | 
  882 |     // Determine if the calendar is showing EC years (EC year = GC year - 7 or - 8)
  883 |     // Convert targetYear/targetMonth to the calendar's own coordinate system before navigating.
  884 |     const isEcCalendar = (process.env.BEFFA_CALENDAR || 'ec').toLowerCase() === 'ec';
  885 |     // EC year N starts ~Sep 11 of GC year N+7. A GC date in Jan–Sep of GC year Y maps to EC year Y-8;
  886 |     // Oct–Dec maps to EC year Y-7. Use the simpler constant offset of 7 for navigation purposes.
  887 |     const navTargetYear  = isEcCalendar ? targetYear - 7 : targetYear;
  888 |     // EC months are offset: EC month 1 (Meskerem) starts ~Sep 11 GC.
  889 |     // GC month index 0-11 → EC month index: (gcMonth + 4) % 13 (approx, good enough for nav).
  890 |     const navTargetMonth = isEcCalendar ? (targetMonth + 4) % 13 : targetMonth;
  891 | 
  892 |     const getDisplayedYearMonth = async (): Promise<{ year: number; month: number } | null> => {
  893 |       try {
  894 |         const headerText = await popover.evaluate((el: HTMLElement) => el.textContent || '').catch(() => '');
  895 |         const yearMatch = headerText.match(/(\d{4})/);
  896 |         if (!yearMatch) return null;
  897 |         const year = parseInt(yearMatch[1]);
  898 |         const monthNames = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec',
  899 |                             'መስ','ጥቅ','ህዳ','ታህ','ጥር','የካ','መጋ','ሚያ','ግን','ሰኔ','ሐም','ነሐ'];
  900 |         const lower = headerText.toLowerCase();
  901 |         const monthIdx = monthNames.findIndex(m => lower.includes(m));
  902 |         const month = monthIdx >= 12 ? monthIdx - 12 : monthIdx;
  903 |         return { year, month };
  904 |       } catch { return null; }
  905 |     };
  906 | 
  907 |     for (let step = 0; step < 24; step++) {
  908 |       const current = await getDisplayedYearMonth();
  909 |       if (current) {
  910 |         const monthDiff = (navTargetYear - current.year) * 12 + (navTargetMonth - current.month);
  911 |         if (monthDiff === 0) break;
  912 |         const navBtn = monthDiff > 0 ? nextBtn : prevBtn;
  913 |         if (!await navBtn.isVisible({ timeout: 500 }).catch(() => false)) break;
  914 |         await navBtn.click({ force: true });
  915 |         await this.page.waitForTimeout(300);
  916 |       } else {
  917 |         break;
  918 |       }
  919 |     }
  920 | 
  921 |     // Click the target day
  922 |     const enabledDays = popover.locator('button:not([disabled]):not([aria-disabled="true"])').filter({ hasText: new RegExp(`^${targetDay}$`) });
  923 |     if (await enabledDays.first().isVisible({ timeout: 2000 }).catch(() => false)) {
  924 |       await enabledDays.first().click({ force: true });
  925 |       Logger.pass(`"${Logger.sanitize(label)}" set to day ${targetDay}.`);
  926 |     } else {
  927 |       // Fallback: pick last enabled day in whatever month is showing
  928 |       const anyEnabled = popover.locator('button:not([disabled]):not([aria-disabled="true"])').filter({ hasText: /^\d{1,2}$/ });
  929 |       const count = await anyEnabled.count();
  930 |       if (count > 0) {
  931 |         const last = anyEnabled.nth(count - 1);
  932 |         const dayText = await last.textContent();
  933 |         await last.click({ force: true });
  934 |         Logger.warn(`"${Logger.sanitize(label)}" — target day ${targetDay} not found, picked last enabled: ${Logger.sanitize(dayText?.trim())}.`);
  935 |       } else {
  936 |         await this.page.keyboard.press('Enter');
  937 |         Logger.warn(`"${Logger.sanitize(label)}" — no enabled days found, pressed Enter.`);
  938 |       }
  939 |     }
  940 | 
  941 |     await this.page.waitForTimeout(800);
  942 |     await this.stopTacticalTimer(`Pick Date: ${label}`, 'UI');
  943 |   }
  944 | 
  945 |   async selectRandomOption(selector: Locator, labelName: string, isOptional: boolean = false): Promise<number> {
  946 |     const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], [role="menuitem"], .chakra-menu__menuitem';
  947 | 
  948 |     await this.startTacticalTimer(); // Start Tactical UI Timer
  949 | 
  950 |     for (let i = 0; i < 3; i++) {
  951 |       try {
  952 |         await selector.scrollIntoViewIfNeeded();
  953 |         await selector.click({ timeout: 5000 });
  954 |         await this.page.waitForTimeout(1500);
  955 |         const options = this.page.locator(optionSelector).filter({ visible: true });
  956 |         // Wait for at least one option to appear before counting
  957 |         await options.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  958 |         const count = await options.count();
  959 |         if (count > 0) {
  960 |           const randomIndex = Math.floor(Math.random() * count);
  961 |           const target = options.nth(randomIndex);
  962 |           await target.evaluate((node: HTMLElement) => node.click());
  963 |           await this.page.keyboard.press('Escape');
  964 |           await this.stopTacticalTimer(`Random Selection: ${labelName}`, 'UI');
  965 |           return count;
  966 |         } else {
  967 |           await this.page.keyboard.press('Escape');
  968 |           if (isOptional) return 0;
```