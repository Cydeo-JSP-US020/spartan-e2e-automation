import { APIRequestContext, APIResponse } from '@playwright/test';
import {
  SpartanModel,
  SpartanPartialUpdateDTO,
  SpartanSearchParams,
  ResponseWrapper,
} from '../test-data/spartanData';

/**
 * Service Object Model for interacting with the Spartan Backend REST API.
 * Encapsulates all HTTP operations using Playwright's APIRequestContext.
 */
export class SpartanApiClient {
  private readonly request: APIRequestContext;
  private readonly baseUrlPath = '/api/v2/spartans';
  private readonly helloPath = '/api/v2/hello';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Health / greeting endpoint GET /api/v2/hello.
   */
  public async getHello(): Promise<APIResponse> {
    return this.request.get(this.helloPath);
  }

  /**
   * Retrieves all Spartans: GET /api/v2/spartans.
   */
  public async getAllSpartans(): Promise<APIResponse> {
    return this.request.get(this.baseUrlPath);
  }

  /**
   * Retrieves a single Spartan by ID: GET /api/v2/spartans/{id}.
   */
  public async getSpartanById(id: number | string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrlPath}/${id}`);
  }

  /**
   * Creates a new Spartan: POST /api/v2/spartans.
   */
  public async createSpartan(
    payload: SpartanModel | Partial<SpartanModel> | Record<string, unknown>
  ): Promise<APIResponse> {
    return this.request.post(this.baseUrlPath, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fully updates an existing Spartan: PUT /api/v2/spartans/{id}.
   */
  public async updateSpartan(
    id: number | string,
    payload: SpartanModel | Partial<SpartanModel> | Record<string, unknown>
  ): Promise<APIResponse> {
    return this.request.put(`${this.baseUrlPath}/${id}`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Partially updates an existing Spartan: PATCH /api/v2/spartans/{id}.
   */
  public async patchSpartan(
    id: number | string,
    payload: SpartanPartialUpdateDTO | Record<string, unknown>
  ): Promise<APIResponse> {
    return this.request.patch(`${this.baseUrlPath}/${id}`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Deletes a Spartan by ID: DELETE /api/v2/spartans/{id}.
   */
  public async deleteSpartan(id: number | string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrlPath}/${id}`);
  }

  /**
   * Queries Spartans by name substring and/or gender: GET /api/v2/spartans/search.
   */
  public async searchSpartans(params: SpartanSearchParams): Promise<APIResponse> {
    const queryParams: Record<string, string> = {};
    if (params.nameContains !== undefined) {
      queryParams['nameContains'] = params.nameContains;
    }
    if (params.gender !== undefined) {
      queryParams['gender'] = params.gender;
    }

    return this.request.get(`${this.baseUrlPath}/search`, {
      params: queryParams,
    });
  }

  /**
   * Helper utility to safely parse JSON response into a typed object.
   */
  public async parseJson<T>(response: APIResponse): Promise<T> {
    return (await response.json()) as T;
  }
}
