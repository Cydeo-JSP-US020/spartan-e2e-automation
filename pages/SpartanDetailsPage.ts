import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SpartanGender, SpartanModel } from '../test-data/spartanData';

/**
 * SpartanDetailsPage represents the read-only view (/web/v2/spartans/{id}).
 * Uses Playwright's recommended user-facing locator standard (getByRole, getByLabel).
 */
export class SpartanDetailsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly nameField: Locator;
  readonly genderField: Locator;
  readonly phoneField: Locator;
  readonly backToListLink: Locator;
  readonly backToHomeLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Spartan Details' });
    this.nameField = page.getByLabel('Name:');
    this.genderField = page.getByLabel('Gender:');
    this.phoneField = page.getByLabel('Phone Number:');
    this.backToListLink = page.getByRole('link', { name: 'Back to the List' });
    this.backToHomeLink = page.getByRole('link', { name: 'Back to Home' });
  }

  /**
   * Navigates directly to the Details page for a specific Spartan ID.
   */
  async goto(id: number | string): Promise<void> {
    await this.navigateTo(`/web/v2/spartans/${id}`);
  }

  /**
   * Reads all displayed details fields.
   */
  async getSpartanDetails(): Promise<SpartanModel> {
    return {
      name: (await this.nameField.inputValue()).trim(),
      gender: (await this.genderField.inputValue()).trim() as SpartanGender,
      phone: (await this.phoneField.inputValue()).trim(),
    };
  }

  /**
   * Clicks 'Back to the List' link.
   */
  async clickBackToList(): Promise<void> {
    await this.backToListLink.click();
  }

  /**
   * Clicks 'Back to Home' link.
   */
  async clickBackToHome(): Promise<void> {
    await this.backToHomeLink.click();
  }
}
