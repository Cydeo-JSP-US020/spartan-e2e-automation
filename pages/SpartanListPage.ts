import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SpartanGender, SpartanModel } from '../test-data/spartanData';

/**
 * SpartanListPage represents the main data table view (/web/v2/spartans).
 * Uses Playwright's recommended user-facing locator standard:
 * - getByRole() for buttons, links, tables, and rows
 * - getByLabel() / getByPlaceholder() for form filter controls
 */
export class SpartanListPage extends BasePage {
  readonly addSpartanBtn: Locator;
  readonly backToHomeBtn: Locator;
  readonly totalBadge: Locator;
  readonly filteredCountSpan: Locator;
  readonly nameFilterInput: Locator;
  readonly genderFilterSelect: Locator;
  readonly searchBtn: Locator;
  readonly clearBtn: Locator;
  readonly table: Locator;
  readonly tableHeaders: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);
    // User-facing locators
    this.addSpartanBtn = page.getByRole('link', { name: 'Add Spartan' });
    this.backToHomeBtn = page.getByRole('link', { name: 'Back to Home' });
    this.totalBadge = page.getByText(/Total:\s*\d+/);
    this.filteredCountSpan = page.locator('#total_up_count');
    this.nameFilterInput = page.getByPlaceholder('Name Contains...');
    this.genderFilterSelect = page.getByLabel('Gender:');
    this.searchBtn = page.getByRole('button', { name: 'Search' });
    this.clearBtn = page.getByRole('button', { name: 'Clear' });
    this.table = page.getByRole('table');
    this.tableHeaders = page.getByRole('columnheader');
    this.tableRows = page.getByRole('table').locator('tbody tr');
  }

  /**
   * Navigates directly to the Spartan List Page.
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/v2/spartans');
  }

  /**
   * Clicks 'Add Spartan' button to go to the creation form.
   */
  async clickAddSpartan(): Promise<void> {
    await this.addSpartanBtn.click();
  }

  /**
   * Clicks 'Back to Home' button to return to home view.
   */
  async clickBackToHome(): Promise<void> {
    await this.backToHomeBtn.click();
  }

  /**
   * Applies client-side search/filter by name and/or gender.
   */
  async filterSpartans(name?: string, gender?: SpartanGender): Promise<void> {
    if (name !== undefined) {
      await this.nameFilterInput.fill(name);
    }
    if (gender !== undefined) {
      await this.genderFilterSelect.selectOption(gender);
    }
    await this.searchBtn.click();
  }

  /**
   * Resets the search/filter criteria by clicking Clear.
   */
  async resetFilter(): Promise<void> {
    await this.clearBtn.click();
  }

  /**
   * Returns the count displayed in the 'Filtered Result Number' indicator.
   */
  async getFilteredCount(): Promise<number> {
    const text = (await this.filteredCountSpan.textContent())?.trim() ?? '0';
    return parseInt(text, 10) || 0;
  }

  /**
   * Returns the total count parsed from the green Total badge (e.g. 'Total: 959').
   */
  async getTotalCount(): Promise<number> {
    const text = (await this.totalBadge.textContent())?.trim() ?? '0';
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   * Returns the count of currently visible table rows.
   */
  async getVisibleRowCount(): Promise<number> {
    return this.page.locator('#myTable tbody tr:visible').count();
  }

  /**
   * Returns the table row locator for a given Spartan name using Playwright locator chaining.
   */
  getRowBySpartanName(name: string): Locator {
    return this.page.getByRole('row', { name: name });
  }

  /**
   * Returns the table row locator for a given Spartan ID.
   */
  getRowBySpartanId(id: number | string): Locator {
    return this.page.getByRole('row').filter({ hasText: String(id) });
  }

  /**
   * Returns the View action link for a given Spartan ID.
   */
  getViewButton(id: number | string): Locator {
    return this.page.locator(`a#view_spartan_${id}`);
  }

  /**
   * Returns the Edit action link for a given Spartan ID.
   */
  getEditButton(id: number | string): Locator {
    return this.page.locator(`a#edit_spartan_${id}`);
  }

  /**
   * Returns the Delete action link for a given Spartan ID.
   */
  getDeleteButton(id: number | string): Locator {
    return this.page.locator(`a#delete_spartan_${id}`);
  }

  /**
   * Clicks the View action button for a Spartan ID.
   */
  async clickViewSpartan(id: number | string): Promise<void> {
    await this.getViewButton(id).click();
  }

  /**
   * Clicks the Edit action button for a Spartan ID.
   */
  async clickEditSpartan(id: number | string): Promise<void> {
    await this.getEditButton(id).click();
  }

  /**
   * Clicks the Delete action button for a Spartan ID.
   */
  async clickDeleteSpartan(id: number | string): Promise<void> {
    await this.getDeleteButton(id).click();
  }

  /**
   * Extracts data from a table row for a given Spartan ID.
   */
  async getSpartanRowData(id: number | string): Promise<SpartanModel> {
    const row = this.getRowBySpartanId(id);
    const cells = row.getByRole('cell');
    return {
      id: Number((await cells.nth(0).textContent())?.trim()),
      name: (await cells.nth(1).textContent())?.trim() ?? '',
      phone: (await cells.nth(2).textContent())?.trim() ?? '',
      gender: ((await cells.nth(3).textContent())?.trim() as SpartanGender) ?? 'Male',
    };
  }
}
