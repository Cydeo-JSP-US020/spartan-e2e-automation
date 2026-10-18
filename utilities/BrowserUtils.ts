import { Page, Locator } from '@playwright/test';

/**
 * Reusable utility methods for browser interactions, table operations, and timing helpers.
 */
export class BrowserUtils {
  /**
   * Waits for a table's visible row count to equal an expected number.
   */
  public static async waitForRowCount(
    rowsLocator: Locator,
    expectedCount: number,
    timeoutMs: number = 10000
  ): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      const count = await rowsLocator.count();
      if (count === expectedCount) {
        return;
      }
      await rowsLocator.first().page().waitForTimeout(200);
    }
  }

  /**
   * Scrolls the window smoothly to the given locator.
   */
  public static async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Checks if an element is currently in the DOM and visible.
   */
  public static async isVisibleQuick(locator: Locator, timeoutMs: number = 2000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  }
}
