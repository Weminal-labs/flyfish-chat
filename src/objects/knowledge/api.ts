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
          if (dataList.length <= 0) {
            return [
              {
                text: "Blockchain technology is transforming industries by enabling decentralized and trustless transactions.",
                authorFullname: "Satoshi Nakamoto",
                authorUsername: "satoshi_n",
                authorImg: "https://example.com/images/satoshi.png",
                url: "https://example.com/blockchain-intro",
              },
              {
                text: "Artificial Intelligence is revolutionizing automation, enhancing efficiency, and driving innovation in various fields.",
                authorFullname: "Alan Turing",
                authorUsername: "turing_ai",
                authorImg: "https://example.com/images/turing.png",
                url: "https://example.com/ai-innovation",
              },
              {
                text: "DeFi (Decentralized Finance) removes intermediaries, allowing users to manage their assets in a trustless ecosystem.",
                authorFullname: "Vitalik Buterin",
                authorUsername: "vitalik_b",
                authorImg: "https://example.com/images/vitalik.png",
                url: "https://www.cetus.zone/",
              },
            ];
          }
          return dataList as any;
        }
      const response = await api.get("/knowledge/many.json");
      return response.data as any;
    } catch (error: any) {
      console.error(error.message);
      return [
        [
          {
            text: "Blockchain technology is transforming industries by enabling decentralized and trustless transactions.",
            authorFullname: "Satoshi Nakamoto",
            authorUsername: "satoshi_n",
            authorImg:
              "https://pbs.twimg.com/profile_images/1838951371988733953/yWJCUzef_400x400.png",
            url: "https://example.com/blockchain-intro",
          },
          {
            text: "Artificial Intelligence is revolutionizing automation, enhancing efficiency, and driving innovation in various fields.",
            authorFullname: "Alan Turing",
            authorUsername: "turing_ai",
            authorImg:
              "chrome-extension://difoiogjjojoaoomphldepapgpbgkhkb/assets/logo-OYJ34ERC.png",
            url: "https://example.com/ai-innovation",
          },
          {
            text: "DeFi (Decentralized Finance) removes intermediaries, allowing users to manage their assets in a trustless ecosystem.",
            authorFullname: "Vitalik Buterin",
            authorUsername: "vitalik_b",
            authorImg:
              "https://pbs.twimg.com/profile_images/1838951371988733953/yWJCUzef_400x400.png",
            url: "https://www.cetus.zone/",
          },
        ],
      ];
    }
  }
}
