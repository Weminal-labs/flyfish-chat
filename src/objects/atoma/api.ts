import { API } from "src/api";

// Import utils
import { APIUtils } from "src/utils/api";

// Import types
import type { AxiosHeaders } from "axios";

const api = new API({
  baseURL: import.meta.env.VITE_ATOMA_BASE_URL,
});

export class AtomaAPI {
  /**
   * Use to list supported models
   * @returns
   */
  static async listModels() {
    try {
      const url = "/v1/models";
      const headers = APIUtils.mergeHeaders(
        APIUtils.getBearerTokenHeader(import.meta.env.VITE_ATOMA_API_KEY),
        {
          "Content-Type": "application/json",
        }
      ) as unknown as AxiosHeaders;
      const response = await api.get(url, { headers });

      return response.data as any;
    } catch (error: any) {
      console.error(error.message);
    }
  }
}
