import { API } from "src/api";

// Import utils
// import { APIUtils } from "src/utils/api";
import { OtherUtils } from "src/utils/other";
import { TuskyUtils } from "src/utils/tusky";

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

  static async getKnowledge(address: string) {
    try {
      const data = await TuskyUtils.getFolderByUserAddress(address); // input the user wallet address

      if (!data) return;

      if (typeof data != "string") {
        console.log(data);
        const dataList = data.map((item: any) => {
          if (!item.data.msg) {
            // @ts-ignore
            return item.data.map((i) => {
              return {
                ...i,
                uploadInfo: item,
              };
            });
          } else {
            console.log("item", item);
          }
        });
        console.log(dataList.filter((i) => i));
        return dataList.filter((i) => i) as any;
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }
}
