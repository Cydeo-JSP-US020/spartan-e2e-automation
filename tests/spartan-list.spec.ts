import { test, expect } from '../fixtures/pageFixtures';

test.describe('Spartan List Page - UI & Search/Filter Tests', () => {
  test.beforeEach(async ({ spartanListPage }) => {
    await spartanListPage.goto();
  });

  test('should display page title and table header elements', async ({ spartanListPage }) => {
    await expect(spartanListPage.page).toHaveTitle('All Spartan');
    await expect(spartanListPage.addSpartanBtn).toBeVisible();
    await expect(spartanListPage.backToHomeBtn).toBeVisible();
    await expect(spartanListPage.totalBadge).toBeVisible();
    await expect(spartanListPage.table).toBeVisible();

    // Verify table columns
    await expect(spartanListPage.tableHeaders).toHaveText([
      'ID',
      'Name',
      'Phone',
      'Gender',
      'View',
      'Edit',
      'Delete',
    ]);
  });

  test('should display total count matching initial filtered result count', async ({
    spartanListPage,
  }) => {
    const totalCount = await spartanListPage.getTotalCount();
    expect(totalCount).toBeGreaterThan(0);

    const filteredCount = await spartanListPage.getFilteredCount();
    expect(filteredCount).toBe(totalCount);
  });

  test('should filter table rows by Spartan name', async ({ spartanListPage }) => {
    // Search for a common name or character
    await spartanListPage.filterSpartans('a');
    const filteredCount = await spartanListPage.getFilteredCount();
    const visibleRows = await spartanListPage.getVisibleRowCount();

    expect(visibleRows).toBe(filteredCount);
  });

  test('should filter table rows by Gender', async ({ spartanListPage }) => {
    await spartanListPage.filterSpartans(undefined, 'Female');
    const filteredCount = await spartanListPage.getFilteredCount();
    const visibleRows = await spartanListPage.getVisibleRowCount();

    expect(visibleRows).toBe(filteredCount);

    // Verify all visible rows have FEMALE
    const visibleGenders = await spartanListPage.page
      .getByRole('row')
      .locator('td:nth-child(4):visible')
      .allInnerTexts();
    for (const gender of visibleGenders) {
      expect(gender.trim()).toBe('FEMALE');
    }
  });

  test('should reset filters when Clear button is clicked', async ({ spartanListPage }) => {
    const initialTotal = await spartanListPage.getTotalCount();

    // Apply filter
    await spartanListPage.filterSpartans('NonExistentSpartanNameZ999');
    expect(await spartanListPage.getFilteredCount()).toBe(0);
    expect(await spartanListPage.getVisibleRowCount()).toBe(0);

    // Reset filter
    await spartanListPage.resetFilter();
    expect(await spartanListPage.getFilteredCount()).toBe(initialTotal);
    expect(await spartanListPage.nameFilterInput).toHaveValue('');
  });
});
