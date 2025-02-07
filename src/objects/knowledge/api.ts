import { API } from "src/api";

// Import utils
// import { APIUtils } from "src/utils/api";
import { OtherUtils } from "src/utils/other";

// Import types
// import type { AxiosHeaders } from "axios";
// import type { ChatBotResponseDataType } from "./types";

const api = new API({
  baseURL: import.meta.env.VITE_FLYFISH_BASE_URL,
});

export class KnowledgeAPI {
  /**
   * Use to get conversation dialogs
   * @returns
   */
  static async getKnowledge() {
    try {
      const response = await api.get("/knowledge/many.json");
      return response.data as any;
    } catch (error: any) {
      console.error(error.message);
    }
  }
}
