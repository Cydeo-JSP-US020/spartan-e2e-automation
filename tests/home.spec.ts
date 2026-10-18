import { test, expect } from '../fixtures/pageFixtures';

test.describe('Spartan Home Page Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('should display home page title and branding', async ({ homePage }) => {
    await expect(homePage.page).toHaveTitle('Spartan Home');
    await expect(homePage.pageHeading).toContainText('Home');
    await expect(homePage.spartanImage).toBeVisible();
    await expect(homePage.footerCopyright).toContainText('CYDEO');
  });

  test('should navigate to Spartan List page via Web Data link', async ({ homePage, page }) => {
    await homePage.clickWebData();
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);
    await expect(page).toHaveTitle('All Spartan');
  });

  test('should navigate to Add Spartan page via Add Spartan link', async ({ homePage, page }) => {
    await homePage.clickAddSpartan();
    await expect(page).toHaveURL(/\/web\/v2\/spartans\/add$/);
    await expect(page).toHaveTitle('Add New Spartan');
  });

  test('should have Swagger API Doc link pointing to /swagger-ui/index.html', async ({ homePage }) => {
    await expect(homePage.apiDocLink).toHaveAttribute('href', '/swagger-ui/index.html');
    await expect(homePage.apiDocLink).toHaveAttribute('target', '_blank');
  });
});
