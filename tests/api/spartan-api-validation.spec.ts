import { test, expect } from '../../fixtures';
import { DataGenerator } from '../../utilities';
import {
  ApiMessages,
  ExceptionWrapper,
  ValidationMessages,
} from '../../test-data/spartanData';

test.describe('Spartan REST API - Validation & Error Handling Suite', () => {
  const nonExistentId = 99999999;

  test.describe('POST /api/v2/spartans - Input Validation', () => {
    test('should reject creation when name is empty', async ({ spartanApiClient }) => {
      const payload = {
        name: '',
        gender: 'Male',
        phone: DataGenerator.randomPhoneNumber(10),
      };

      const response = await spartanApiClient.createSpartan(payload);
      expect(response.status()).toBe(400);

      const error = await spartanApiClient.parseJson<ExceptionWrapper>(response);
      expect(error.message).toBe(ApiMessages.INVALID_INPUT);
      expect(error.httpStatus).toBe('BAD_REQUEST');

      const nameError = error.validationExceptions?.find((e) => e.errorField === 'name');
      expect(nameError).toBeDefined();
      expect(nameError?.reason).toBe(ValidationMessages.NAME_REQUIRED);
    });

    test('should reject creation when phone has fewer than 10 digits', async ({
      spartanApiClient,
    }) => {
      const payload = {
        name: DataGenerator.randomName(),
        gender: 'Female',
        phone: '12345',
      };

      const response = await spartanApiClient.createSpartan(payload);
      expect(response.status()).toBe(400);

      const error = await spartanApiClient.parseJson<ExceptionWrapper>(response);
      expect(error.message).toBe(ApiMessages.INVALID_INPUT);
      expect(error.httpStatus).toBe('BAD_REQUEST');

      const phoneError = error.validationExceptions?.find((e) => e.errorField === 'phone');
      expect(phoneError).toBeDefined();
      expect(phoneError?.reason).toBe(ValidationMessages.PHONE_FORMAT);
    });

    test('should reject creation when phone contains alphabetic characters', async ({
      spartanApiClient,
    }) => {
      const payload = {
        name: DataGenerator.randomName(),
        gender: 'Male',
        phone: '12345abcde',
      };

      const response = await spartanApiClient.createSpartan(payload);
      expect(response.status()).toBe(400);

      const error = await spartanApiClient.parseJson<ExceptionWrapper>(response);
      expect(error.message).toBe(ApiMessages.INVALID_INPUT);

      const phoneError = error.validationExceptions?.find((e) => e.errorField === 'phone');
      expect(phoneError).toBeDefined();
      expect(phoneError?.reason).toBe(ValidationMessages.PHONE_FORMAT);
    });
  });

  test.describe('Non-Existent ID Handling (404 Not Found)', () => {
    test('GET /api/v2/spartans/{id} - should return 404 for non-existent ID', async ({
      spartanApiClient,
    }) => {
      const response = await spartanApiClient.getSpartanById(nonExistentId);
      expect(response.status()).toBe(404);

      const error = await spartanApiClient.parseJson<ExceptionWrapper>(response);
      expect(error.message).toBe(ApiMessages.NOT_FOUND);
      expect(error.httpStatus).toBe('NOT_FOUND');
    });

    test('PUT /api/v2/spartans/{id} - should return 404 for non-existent ID', async ({
      spartanApiClient,
    }) => {
      const payload = DataGenerator.generateSpartan();
      const response = await spartanApiClient.updateSpartan(nonExistentId, payload);
      expect(response.status()).toBe(404);

      const error = await spartanApiClient.parseJson<ExceptionWrapper>(response);
      expect(error.message).toBe(ApiMessages.NOT_FOUND);
      expect(error.httpStatus).toBe('NOT_FOUND');
    });

    test('PATCH /api/v2/spartans/{id} - should return 404 for non-existent ID', async ({
      spartanApiClient,
    }) => {
      const response = await spartanApiClient.patchSpartan(nonExistentId, { name: 'Nobody' });
      expect(response.status()).toBe(404);

      const error = await spartanApiClient.parseJson<ExceptionWrapper>(response);
      expect(error.message).toBe(ApiMessages.NOT_FOUND);
      expect(error.httpStatus).toBe('NOT_FOUND');
    });

    test('DELETE /api/v2/spartans/{id} - should return 404 for non-existent ID', async ({
      spartanApiClient,
    }) => {
      const response = await spartanApiClient.deleteSpartan(nonExistentId);
      expect(response.status()).toBe(404);

      const error = await spartanApiClient.parseJson<ExceptionWrapper>(response);
      expect(error.message).toBe(ApiMessages.NOT_FOUND);
      expect(error.httpStatus).toBe('NOT_FOUND');
    });
  });
});
