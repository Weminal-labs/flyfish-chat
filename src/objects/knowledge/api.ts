import { API } from "src/api";

// Import utils
// import { APIUtils } from "src/utils/api";
import { OtherUtils } from "src/utils/other";
import { getFolderByUserAddress } from "src/utils/tusky";

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
      const data = await getFolderByUserAddress("0xetstssss");
      if (data != "TUS_API or TUSKY_API_KEY is not set")
        if (typeof data != "string") {
          const dataList = data.map((item: any) => item.data);
          return dataList as any;
        }
      const response = await api.get("/knowledge/many.json");
      return response.data as any;
    } catch (error: any) {
      console.error(error.message);
    }
  }
}
