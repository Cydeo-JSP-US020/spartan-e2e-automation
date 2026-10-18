import { test, expect } from '../../fixtures';
import { DataGenerator } from '../../utilities';
import {
  ApiMessages,
  ExceptionWrapper,
  ResponseWrapper,
  SpartanModel,
} from '../../test-data/spartanData';

test.describe('Spartan REST API - Search Suite', () => {
  let createdSpartanId: number;
  const uniqueSearchPrefix = `SearchTest${Date.now()}`;
  const testSpartanData: SpartanModel = {
    name: uniqueSearchPrefix,
    gender: 'Male',
    phone: DataGenerator.randomPhoneNumber(10),
  };

  test.beforeAll(async ({ playwright }) => {
    // Seed a known unique Spartan to ensure predictable search results
    const apiContext = await playwright.request.newContext();
    const res = await apiContext.post('/api/v2/spartans', {
      data: testSpartanData,
      headers: { 'Content-Type': 'application/json' },
    });
    const body = (await res.json()) as ResponseWrapper<SpartanModel>;
    createdSpartanId = body.data.id!;
    await apiContext.dispose();
  });

  test.afterAll(async ({ playwright }) => {
    // Teardown created test Spartan
    if (createdSpartanId) {
      const apiContext = await playwright.request.newContext();
      await apiContext.delete(`/api/v2/spartans/${createdSpartanId}`);
      await apiContext.dispose();
    }
  });

  test('Search by nameContains - should return matching Spartans', async ({
    spartanApiClient,
  }) => {
    const response = await spartanApiClient.searchSpartans({
      nameContains: uniqueSearchPrefix,
    });

    expect(response.status()).toBe(200);
    const body = await spartanApiClient.parseJson<ResponseWrapper<SpartanModel[]>>(response);
    expect(body.message).toBe(ApiMessages.QUERIED_ALL);
    expect(body.totalElement).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(body.data)).toBe(true);

    const match = body.data.find((s) => s.id === createdSpartanId);
    expect(match).toBeDefined();
    expect(match?.name).toBe(uniqueSearchPrefix);
  });

  test('Search by gender - should return only Spartans with the specified gender', async ({
    spartanApiClient,
  }) => {
    const response = await spartanApiClient.searchSpartans({
      gender: 'Female',
    });

    expect(response.status()).toBe(200);
    const body = await spartanApiClient.parseJson<ResponseWrapper<SpartanModel[]>>(response);
    expect(body.message).toBe(ApiMessages.QUERIED_ALL);
    expect(body.totalElement).toBeGreaterThan(0);

    // Verify all returned records have Female gender
    for (const spartan of body.data) {
      expect(spartan.gender).toBe('Female');
    }
  });

  test('Search by both nameContains and gender - should satisfy both criteria', async ({
    spartanApiClient,
  }) => {
    const response = await spartanApiClient.searchSpartans({
      nameContains: uniqueSearchPrefix,
      gender: 'Male',
    });

    expect(response.status()).toBe(200);
    const body = await spartanApiClient.parseJson<ResponseWrapper<SpartanModel[]>>(response);
    expect(body.totalElement).toBeGreaterThanOrEqual(1);

    for (const spartan of body.data) {
      expect(spartan.name.toLowerCase()).toContain(uniqueSearchPrefix.toLowerCase());
      expect(spartan.gender).toBe('Male');
    }
  });

  test('Search with non-existent query - should return 200 with empty data array', async ({
    spartanApiClient,
  }) => {
    const response = await spartanApiClient.searchSpartans({
      nameContains: `NonExistent_${Date.now()}_ZXY`,
    });

    expect(response.status()).toBe(200);
    const body = await spartanApiClient.parseJson<ResponseWrapper<SpartanModel[]>>(response);
    expect(body.message).toBe(ApiMessages.QUERIED_ALL);
    expect(body.totalElement).toBe(0);
    expect(body.data).toEqual([]);
  });

  test('Search with invalid gender - should return 400 Bad Request with validation error', async ({
    spartanApiClient,
  }) => {
    const response = await spartanApiClient.searchSpartans({
      gender: 'InvalidGender',
    });

    expect(response.status()).toBe(400);
    const errorBody = await spartanApiClient.parseJson<ExceptionWrapper>(response);
    expect(errorBody.message).toBe(ApiMessages.INVALID_INPUT);
    expect(errorBody.httpStatus).toBe('BAD_REQUEST');
    expect(errorBody.validationExceptions).toBeDefined();

    const genderError = errorBody.validationExceptions?.find((e) => e.errorField === 'gender');
    expect(genderError).toBeDefined();
    expect(genderError?.reason).toContain("'Male' or 'Female'");
  });
});
