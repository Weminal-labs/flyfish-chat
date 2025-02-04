import { API } from "src/api";

const api = new API({
  baseURL: "",
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
    } catch (error) {
      throw error;
    }
  }
}
