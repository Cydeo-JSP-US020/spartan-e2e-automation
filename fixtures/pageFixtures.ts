import { test as baseTest, expect } from '@playwright/test';
import {
  HomePage,
  SpartanListPage,
  AddSpartanPage,
  EditSpartanPage,
  SpartanDetailsPage,
} from '../pages';
import { SpartanApiClient } from '../services';

/**
 * Declares the fixture types for all Page Object Models and API clients.
 */
type SpartanFixtures = {
  homePage: HomePage;
  spartanListPage: SpartanListPage;
  addSpartanPage: AddSpartanPage;
  editSpartanPage: EditSpartanPage;
  spartanDetailsPage: SpartanDetailsPage;
  spartanApiClient: SpartanApiClient;
};

/**
 * Custom Playwright test fixture extending base test with instantiated Page Objects
 * and SpartanApiClient service.
 */
export const test = baseTest.extend<SpartanFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  spartanListPage: async ({ page }, use) => {
    await use(new SpartanListPage(page));
  },
  addSpartanPage: async ({ page }, use) => {
    await use(new AddSpartanPage(page));
  },
  editSpartanPage: async ({ page }, use) => {
    await use(new EditSpartanPage(page));
  },
  spartanDetailsPage: async ({ page }, use) => {
    await use(new SpartanDetailsPage(page));
  },
  spartanApiClient: async ({ request }, use) => {
    await use(new SpartanApiClient(request));
  },
});

export { expect };

