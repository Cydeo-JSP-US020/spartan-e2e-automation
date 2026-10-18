import { test, expect } from '../fixtures/pageFixtures';
import { DataGenerator } from '../utilities';

test.describe('Spartan Full Lifecycle (CRUD) End-to-End Tests', () => {
  test('should create, read, update, and delete a Spartan record', async ({
    addSpartanPage,
    spartanListPage,
    spartanDetailsPage,
    editSpartanPage,
    page,
  }) => {
    // 1. Generate unique dynamic test data
    const initialSpartan = DataGenerator.generateSpartan('Male');
    const updatedSpartan = DataGenerator.generateSpartan('Female');

    // 2. CREATE: Navigate to Add Spartan form and create new Spartan
    await addSpartanPage.goto();
    await addSpartanPage.createSpartan(initialSpartan);

    // Verify redirected back to the Spartan list
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // 3. READ (List): Filter table by newly created Spartan name
    await spartanListPage.filterSpartans(initialSpartan.name);
    await expect(spartanListPage.filteredCountSpan).toHaveText('1');

    const createdRow = spartanListPage.getRowBySpartanName(initialSpartan.name);
    await expect(createdRow).toBeVisible();

    // Extract the generated ID from the first cell of the row
    const idCellText = await createdRow.getByRole('cell').first().textContent();
    const spartanId = idCellText?.trim() || '';
    expect(Number(spartanId)).toBeGreaterThan(0);

    // Verify list row data
    const rowData = await spartanListPage.getSpartanRowData(spartanId);
    expect(rowData.name).toBe(initialSpartan.name);
    expect(rowData.phone).toBe(initialSpartan.phone);
    expect(rowData.gender.toUpperCase()).toBe(initialSpartan.gender.toUpperCase());

    // 4. READ (Details): Click View button and verify details page
    await spartanListPage.clickViewSpartan(spartanId);
    await expect(page).toHaveURL(new RegExp(`/web/v2/spartans/${spartanId}$`));

    const detailsData = await spartanDetailsPage.getSpartanDetails();
    expect(detailsData.name).toBe(initialSpartan.name);
    expect(detailsData.phone).toBe(initialSpartan.phone);
    expect(detailsData.gender.toUpperCase()).toBe(initialSpartan.gender.toUpperCase());

    // Return to the list page
    await spartanDetailsPage.clickBackToList();
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // 5. UPDATE: Click Edit button and modify name and phone
    await spartanListPage.filterSpartans(initialSpartan.name);
    await spartanListPage.clickEditSpartan(spartanId);
    await expect(page).toHaveURL(new RegExp(`/web/v2/spartans/edit/${spartanId}$`));

    // Update with new data
    await editSpartanPage.updateSpartan({
      name: updatedSpartan.name,
      phone: updatedSpartan.phone,
      gender: updatedSpartan.gender,
    });

    // Verify redirected back to list after update
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // Verify updated values persist in table
    await spartanListPage.filterSpartans(updatedSpartan.name);
    await expect(spartanListPage.filteredCountSpan).toHaveText('1');
    const updatedRowData = await spartanListPage.getSpartanRowData(spartanId);
    expect(updatedRowData.name).toBe(updatedSpartan.name);
    expect(updatedRowData.phone).toBe(updatedSpartan.phone);
    expect(updatedRowData.gender.toUpperCase()).toBe(updatedSpartan.gender.toUpperCase());

    // 6. DELETE: Click Delete button and verify removal
    await spartanListPage.clickDeleteSpartan(spartanId);
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // Verify Spartan is no longer in the table
    await spartanListPage.filterSpartans(updatedSpartan.name);
    await expect(spartanListPage.filteredCountSpan).toHaveText('0');
    expect(await spartanListPage.getVisibleRowCount()).toBe(0);
  });
});
