import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SpartanModel } from '../test-data/spartanData';

/**
 * AddSpartanPage represents the Spartan creation form (/web/v2/spartans/add).
 * Uses Playwright's recommended user-facing locator standard:
 * - getByRole() for buttons, links, headings
 * - getByLabel() for accessible form inputs
 */
export class AddSpartanPage extends BasePage {
  readonly pageHeading: Locator;
  readonly nameInput: Locator;
  readonly genderSelect: Locator;
  readonly phoneInput: Locator;
  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;
  readonly backToListLink: Locator;
  readonly backToHomeLink: Locator;
  readonly errorItems: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Add Spartan' });
    this.nameInput = page.getByLabel('Name:');
    this.genderSelect = page.getByLabel('Gender:');
    this.phoneInput = page.getByLabel('Phone');
    this.saveBtn = page.getByRole('button', { name: 'Save' });
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    this.backToListLink = page.getByRole('link', { name: 'Back to the List' });
    this.backToHomeLink = page.getByRole('link', { name: 'Back to Home' });
    this.errorItems = page.locator('.invalid-feedback li');
  }

  /**
   * Navigates directly to the Add Spartan page.
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/v2/spartans/add');
  }

  /**
   * Fills the Name field.
   */
  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  /**
   * Selects the Gender dropdown value ('MALE' or 'FEMALE').
   */
  async selectGender(gender: 'MALE' | 'FEMALE' | 'Male' | 'Female'): Promise<void> {
    const value = gender.toUpperCase();
    await this.genderSelect.selectOption(value);
  }

  /**
   * Fills the Phone field.
   */
  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  /**
   * Clicks the Save button to submit the form.
   */
  async clickSave(): Promise<void> {
    await this.saveBtn.click();
  }

  /**
   * Clicks the Cancel button to abort creation and return to the list.
   */
  async clickCancel(): Promise<void> {
    await this.cancelBtn.click();
  }

  /**
   * Complete form submission helper for a Spartan entity.
   */
  async createSpartan(spartan: SpartanModel): Promise<void> {
    if (spartan.name) {
      await this.fillName(spartan.name);
    }
    if (spartan.gender) {
      await this.selectGender(spartan.gender);
    }
    if (spartan.phone) {
      await this.fillPhone(spartan.phone);
    }
    await this.clickSave();
  }

  /**
   * Retrieves all currently displayed validation error messages.
   */
  async getErrorMessages(): Promise<string[]> {
    return this.errorItems.allInnerTexts();
  }
}
