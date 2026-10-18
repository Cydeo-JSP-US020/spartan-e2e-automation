import { test, expect } from '../../fixtures';
import { DataGenerator } from '../../utilities';
import { ApiMessages, ResponseWrapper, SpartanModel } from '../../test-data/spartanData';

test.describe('Spartan REST API - CRUD & Lifecycle Suite', () => {
  test('GET /api/v2/hello - should return 200 OK with greeting message', async ({
    spartanApiClient,
  }) => {
    const response = await spartanApiClient.getHello();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');
    const text = await response.text();
    expect(text).toBe(ApiMessages.HELLO_WORLD);
  });

  test('GET /api/v2/spartans - should return 200 OK with list of Spartans', async ({
    spartanApiClient,
  }) => {
    const response = await spartanApiClient.getAllSpartans();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await spartanApiClient.parseJson<ResponseWrapper<SpartanModel[]>>(response);
    expect(body.message).toBe(ApiMessages.RETRIEVED_ALL);
    expect(typeof body.totalElement).toBe('number');
    expect(body.totalElement).toBeGreaterThan(0);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    // Verify first item schema
    const firstSpartan = body.data[0];
    expect(firstSpartan).toHaveProperty('id');
    expect(firstSpartan).toHaveProperty('name');
    expect(firstSpartan).toHaveProperty('gender');
    expect(firstSpartan).toHaveProperty('phone');
  });

  test('Complete CRUD Lifecycle: POST -> GET -> PUT -> PATCH -> DELETE', async ({
    spartanApiClient,
  }) => {
    // Step 1: Create a new Spartan via POST
    const initialData = DataGenerator.generateSpartan();
    const createRes = await spartanApiClient.createSpartan(initialData);

    expect(createRes.status()).toBe(201);
    const createdBody =
      await spartanApiClient.parseJson<ResponseWrapper<SpartanModel>>(createRes);
    expect(createdBody.message).toBe(ApiMessages.CREATED);
    expect(createdBody.totalElement).toBe(1);
    expect(createdBody.data.id).toBeDefined();
    expect(createdBody.data.name).toBe(initialData.name);
    expect(createdBody.data.gender).toBe(initialData.gender);
    expect(createdBody.data.phone).toBe(initialData.phone);

    const spartanId = createdBody.data.id!;

    // Step 2: Retrieve the newly created Spartan by ID
    const getRes = await spartanApiClient.getSpartanById(spartanId);
    expect(getRes.status()).toBe(200);
    const getBody = await spartanApiClient.parseJson<ResponseWrapper<SpartanModel>>(getRes);
    expect(getBody.message).toBe(ApiMessages.RETRIEVED_SINGLE);
    expect(getBody.data.id).toBe(spartanId);
    expect(getBody.data.name).toBe(initialData.name);
    expect(getBody.data.gender).toBe(initialData.gender);
    expect(getBody.data.phone).toBe(initialData.phone);

    // Step 3: Fully update the Spartan via PUT
    const updatedData: SpartanModel = {
      name: DataGenerator.randomName('Female'),
      gender: 'Female',
      phone: DataGenerator.randomPhoneNumber(10),
    };
    const putRes = await spartanApiClient.updateSpartan(spartanId, updatedData);
    expect(putRes.status()).toBe(200);
    const putBody = await spartanApiClient.parseJson<ResponseWrapper<SpartanModel>>(putRes);
    expect(putBody.message).toBe(ApiMessages.UPDATED);
    expect(putBody.data.id).toBe(spartanId);
    expect(putBody.data.name).toBe(updatedData.name);
    expect(putBody.data.gender).toBe(updatedData.gender);
    expect(putBody.data.phone).toBe(updatedData.phone);

    // Step 4: Partially update Spartan via PATCH (e.g. name only)
    const patchedName = `Patched${DataGenerator.randomName()}`;
    const patchRes = await spartanApiClient.patchSpartan(spartanId, { name: patchedName });
    expect(patchRes.status()).toBe(200);
    const patchBody = await spartanApiClient.parseJson<ResponseWrapper<SpartanModel>>(patchRes);
    expect(patchBody.message).toBe(ApiMessages.UPDATED);
    expect(patchBody.data.name).toBe(patchedName);
    expect(patchBody.data.gender).toBe(updatedData.gender);
    expect(patchBody.data.phone).toBe(updatedData.phone);

    // Step 5: Delete the Spartan via DELETE
    const deleteRes = await spartanApiClient.deleteSpartan(spartanId);
    expect(deleteRes.status()).toBe(200);
    const deleteBody =
      await spartanApiClient.parseJson<ResponseWrapper<null>>(deleteRes);
    expect(deleteBody.message).toBe(ApiMessages.DELETED);

    // Step 6: Verify Spartan is deleted by asserting 404 Not Found
    const getDeletedRes = await spartanApiClient.getSpartanById(spartanId);
    expect(getDeletedRes.status()).toBe(404);
  });
});
