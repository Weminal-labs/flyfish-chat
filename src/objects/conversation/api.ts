import { API } from "src/api";

// Import utils
// import { APIUtils } from "src/utils/api";
import { OtherUtils } from "src/utils/other";

// Import types
// import type { AxiosHeaders } from "axios";
import type { ChatBotResponseDataType } from "./types";

const api = new API({
  baseURL: import.meta.env.VITE_FLYFISH_BASE_URL,
});

export class ConversationAPI {
  /**
   * Use to get conversation dialogs
   * @returns
   */
  static async getConversationDialogs() {
    try {
      const response = await api.get("/conversations/many.json");
      return response.data as any;
    } catch (error: any) {
      console.error(error.message);
    }
  }

  /**
   * Use to list supported models
   * @returns
   */
  static async askBot(input: string) {
    try {
      const url = "/conversations/one.json";
      const response = await api.post<any, ChatBotResponseDataType>(url, {
        text: input,
      });

      // Simulate delay of response
      await OtherUtils.wait(1000);

      return response.data;
    } catch (error: any) {
      console.error(error.message);
    }
  }
}
