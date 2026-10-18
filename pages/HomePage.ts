import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage represents the landing page (/web/v2/home) of the Spartan application.
 * Uses Playwright's recommended user-facing locator standard (getByRole).
 */
export class HomePage extends BasePage {
  readonly pageHeading: Locator;
  readonly spartanImage: Locator;
  readonly webDataLink: Locator;
  readonly addSpartanLink: Locator;
  readonly apiDocLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /Home$/ });
    this.spartanImage = page.getByRole('img', { name: 'logo' });
    this.webDataLink = page.getByRole('link', { name: 'Web Data' });
    this.addSpartanLink = page.getByRole('link', { name: 'Add Spartan' });
    this.apiDocLink = page.getByRole('link', { name: 'API Doc' });
  }

  /**
   * Navigates directly to the Spartan Home Page.
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/v2/home');
  }

  /**
   * Clicks the 'Web Data' link to navigate to the Spartan list table.
   */
  async clickWebData(): Promise<void> {
    await this.webDataLink.click();
  }

  /**
   * Clicks the 'Add Spartan' link to navigate to the creation form.
   */
  async clickAddSpartan(): Promise<void> {
    await this.addSpartanLink.click();
  }

  /**
   * Clicks the 'API Doc' link (opens Swagger).
   */
  async clickApiDoc(): Promise<void> {
    await this.apiDocLink.click();
  }
}
