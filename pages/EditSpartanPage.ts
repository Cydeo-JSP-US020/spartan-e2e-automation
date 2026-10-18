import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SpartanModel } from '../test-data/spartanData';

/**
 * EditSpartanPage represents the Spartan edit form (/web/v2/spartans/edit/{id}).
 * Uses Playwright's recommended user-facing locator standard:
 * - getByRole() for buttons, links, headings
 * - getByLabel() for accessible inputs
 */
export class EditSpartanPage extends BasePage {
  readonly pageHeading: Locator;
  readonly nameInput: Locator;
  readonly genderSelect: Locator;
  readonly phoneInput: Locator;
  readonly updateBtn: Locator;
  readonly cancelBtn: Locator;
  readonly backToListLink: Locator;
  readonly backToHomeLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Edit Spartan' });
    this.nameInput = page.getByLabel('Name:');
    this.genderSelect = page.getByLabel('Gender:');
    this.phoneInput = page.getByLabel('Phone Number:');
    this.updateBtn = page.getByRole('button', { name: 'Update' });
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    this.backToListLink = page.getByRole('link', { name: 'Back to the List' });
    this.backToHomeLink = page.getByRole('link', { name: 'Back to Home' });
  }

  /**
   * Navigates directly to the Edit page for a specific Spartan ID.
   */
  async goto(id: number | string): Promise<void> {
    await this.navigateTo(`/web/v2/spartans/edit/${id}`);
  }

  /**
   * Retrieves the currently pre-populated form values.
   */
  async getFormData(): Promise<{ name: string; gender: string; phone: string }> {
    return {
      name: await this.nameInput.inputValue(),
      gender: await this.genderSelect.inputValue(),
      phone: await this.phoneInput.inputValue(),
    };
  }

  /**
   * Fills in new values for any provided fields and clicks Update.
   */
  async updateSpartan(updates: Partial<SpartanModel>): Promise<void> {
    if (updates.name !== undefined) {
      await this.nameInput.fill(updates.name);
    }
    if (updates.gender !== undefined) {
      await this.genderSelect.selectOption(updates.gender.toUpperCase());
    }
    if (updates.phone !== undefined) {
      await this.phoneInput.fill(updates.phone);
    }
    await this.updateBtn.click();
  }

  /**
   * Clicks Cancel to return to the Spartan list.
   */
  async clickCancel(): Promise<void> {
    await this.cancelBtn.click();
  }
}
