import { Page, Locator } from '@playwright/test';

/**
 * BasePage encapsulates common properties and behaviors across all Spartan application pages.
 * Implements Playwright's recommended user-facing locator standard (getByRole, getByText).
 */
export abstract class BasePage {
  readonly page: Page;
  readonly brandLogoLink: Locator;
  readonly footerCopyright: Locator;

  constructor(page: Page) {
    this.page = page;
    // Playwright recommended: locate by accessible role and name pattern
    this.brandLogoLink = page.getByRole('link', { name: /Spartan/i });
    this.footerCopyright = page.getByText('© CYDEO – All Rights Reserved.');
  }

  /**
   * Navigates directly to the specified path relative to baseURL.
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Returns current browser page title.
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Clicks the brand logo/title in the top navigation bar to return to Home.
   */
  async clickBrandLogo(): Promise<void> {
    await this.brandLogoLink.click();
  }

  /**
   * Returns footer copyright text content.
   */
  async getFooterText(): Promise<string> {
    return (await this.footerCopyright.textContent())?.trim() ?? '';
  }
}
