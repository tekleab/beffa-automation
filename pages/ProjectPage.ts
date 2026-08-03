import { Page, expect } from '@playwright/test';
import { BasePage } from '../lib/base-page';

export class ProjectPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToProjects() {
    await this.page.goto('/project-management/projects');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickAddProject() {
    const addBtn = this.page.getByRole('link', { name: /Add Project/i })
      .or(this.page.getByRole('button', { name: /Add Project/i })).first();
    await addBtn.waitFor({ state: 'visible', timeout: 10000 });
    await addBtn.click();
    await this.page.waitForURL('**/projects/new', { timeout: 10000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Popover structure (confirmed from browser console):
  //   POPOVER[6] customer: [0]=Clear btn, [1]=input#customer_id, [2][4][6]...=option buttons (no class)
  //   POPOVER[7] workspace: [0]=Clear btn, [1]=input#workspace_id, [2]=option button (no class)
  private async selectPopoverField(inputId: 'customer_id' | 'workspace_id', value: string) {
    // Click the trigger button (same id as the input, overlays it)
    await this.page.locator(`button#${inputId}`).click();
    await this.page.waitForTimeout(600);

    // Type in the search input inside the popover
    const searchInput = this.page.locator(`.chakra-popover__content input#${inputId}`);
    await searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await searchInput.fill(value);
    await this.page.waitForTimeout(800);

    // Options are plain <button> elements (no class) inside the popover, skip Clear (index 0)
    const option = this.page.locator('.chakra-popover__content button')
      .filter({ hasText: value }).first();
    if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
      await option.click();
    } else {
      // fallback: click first real option (index 1 = skip Clear)
      await this.page.locator('.chakra-popover__content button').nth(1)
        .waitFor({ state: 'visible', timeout: 3000 });
      await this.page.locator('.chakra-popover__content button').nth(1).click();
    }
    await this.page.waitForTimeout(400);
  }

  async fillProjectForm(data: {
    name: string;
    customerName?: string;
    workspaceName?: string;
    status?: string;
    completionMethod?: string;
    percentComplete?: number;
    estimatedRevenue?: number;
    estimatedExpense?: number;
    startDate?: string;
    endDate?: string;
    description?: string;
  }) {
    // Project ID * — not auto-generated
    const refVal = await this.page.locator('input#ref').inputValue();
    if (!refVal) {
      await this.page.locator('input#ref').fill(`PRJ-${Date.now()}`);
    }

    // Project Name *
    await this.page.locator('input#project_name').fill(data.name);

    // Project Status * — default "pending" already set, override if needed
    if (data.status) {
      await this.page.locator('select#project_status').selectOption({ label: data.status });
    }

    // Completion Method * — default "manual" already set, override if needed
    if (data.completionMethod) {
      await this.page.locator('select#completion_method').selectOption({ label: data.completionMethod });
    }

    // Project Owner Customer * — popover
    if (data.customerName) {
      await this.selectPopoverField('customer_id', data.customerName);
    }

    // Project Workspace * — popover
    if (data.workspaceName) {
      await this.selectPopoverField('workspace_id', data.workspaceName);
    }

    // workflow_set_id appears after workspace is selected — pick first available
    const wfSelect = this.page.locator('select#workflow_set_id');
    if (await wfSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      const optCount = await wfSelect.locator('option').count();
      if (optCount > 1) {
        await wfSelect.selectOption({ index: 1 });
      }
    }

    // Optional fields
    if (data.percentComplete !== undefined) {
      await this.page.locator('input#percent_complete').fill(String(data.percentComplete));
    }
    if (data.description) {
      await this.page.locator('textarea#description').fill(data.description);
    }
    if (data.estimatedRevenue !== undefined) {
      await this.page.locator('input#estimated_revenue').fill(String(data.estimatedRevenue));
    }
    if (data.estimatedExpense !== undefined) {
      await this.page.locator('input#estimated_expense').fill(String(data.estimatedExpense));
    }
    if (data.startDate) {
      await this.page.locator('input#project_start_date').fill(data.startDate);
    }
    if (data.endDate) {
      await this.page.locator('input[name="estimated_end_date"]').fill(data.endDate);
    }
  }

  async clickSave() {
    const saveBtn = this.page.locator('button[type="submit"]').filter({ hasText: /Create project/i });
    await saveBtn.waitFor({ state: 'visible', timeout: 10000 });
    await expect(saveBtn).toBeEnabled({ timeout: 10000 });
    await saveBtn.click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  }

  async verifySuccess() {
    const toast = this.page.locator('#chakra-toast-manager-top-right, [class*="success"], .chakra-alert').first();
    await expect(toast).toBeVisible({ timeout: 10000 });
  }

  async verifyInList(identifier: string) {
    await expect(this.page.getByText(identifier, { exact: false }).first()).toBeVisible({ timeout: 15000 });
  }

  async filterByStatus(status: string) {
    const statusBtn = this.page.getByRole('button', { name: /Status/i }).first();
    await statusBtn.waitFor({ state: 'visible', timeout: 5000 });
    await statusBtn.click();
    await this.page.waitForTimeout(800);
    await this.page.locator('[role="option"], [role="menuitem"], li, button')
      .filter({ hasText: new RegExp(status, 'i') }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
