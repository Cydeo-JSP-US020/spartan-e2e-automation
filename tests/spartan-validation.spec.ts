import { test, expect } from '../fixtures/pageFixtures';
import { ValidationMessages } from '../test-data/spartanData';
import { DataGenerator } from '../utilities';

test.describe('Spartan Form Validation Tests', () => {
  test.beforeEach(async ({ addSpartanPage }) => {
    await addSpartanPage.goto();
  });

  test('should display validation errors when submitting empty form', async ({
    addSpartanPage,
  }) => {
    // Clear inputs and submit
    await addSpartanPage.nameInput.fill('');
    await addSpartanPage.phoneInput.fill('');
    await addSpartanPage.clickSave();

    // Verify errors
    const errors = await addSpartanPage.getErrorMessages();
    expect(errors).toContain(ValidationMessages.NAME_REQUIRED);
    expect(errors).toContain(ValidationMessages.PHONE_REQUIRED);
  });

  test('should validate phone number length and format (less than 10 digits)', async ({
    addSpartanPage,
  }) => {
    await addSpartanPage.fillName(DataGenerator.randomName('Male'));
    await addSpartanPage.selectGender('Male');
    await addSpartanPage.fillPhone(DataGenerator.invalidPhoneShort());
    await addSpartanPage.clickSave();

    const errors = await addSpartanPage.getErrorMessages();
    expect(errors).toContain(ValidationMessages.PHONE_FORMAT);
  });

  test('should validate phone number cannot contain letters', async ({ addSpartanPage }) => {
    await addSpartanPage.fillName(DataGenerator.randomName('Female'));
    await addSpartanPage.selectGender('Female');
    await addSpartanPage.fillPhone(DataGenerator.invalidPhoneAlpha());
    await addSpartanPage.clickSave();

    const errors = await addSpartanPage.getErrorMessages();
    expect(errors).toContain(ValidationMessages.PHONE_FORMAT);
  });

  test('should navigate back to list when Cancel button is clicked', async ({
    addSpartanPage,
    page,
  }) => {
    await addSpartanPage.fillName('UnsavedSpartan');
    await addSpartanPage.clickCancel();

    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);
  });
});
