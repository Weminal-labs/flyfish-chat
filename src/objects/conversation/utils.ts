import { ConversationConstants } from "./constant";

// Import types
import type { DialogType, ChatAIResponseDataType } from "./types";

export class ConversationUtils {
  /**
   * Use to create default dialog
   * @param input
   * @returns
   */
  static createDialog(
    input: string,
    sender: string = ConversationConstants.Senders.User
  ) {
    return {
      id: "dialog-",
      sender,
      text: input,
    } as DialogType;
  }

  /**
   * Use to transform AI response to dialog
   * @param dataResponse
   */
  static createDialogFromResponse(dataResponse: ChatAIResponseDataType) {
    delete (dataResponse as any).user;

    return {
      ...dataResponse,
      id: "dialog-",
      sender: ConversationConstants.Senders.AI,
    } as DialogType;
  }

  /**
   * Use to check if response(s) have/has `SWAP_TOKEN` action
   * @param response
   * @returns
   */
  static isSwapAction(...responses: any[]): boolean {
    return responses.some((response) => response.action === "SWAP_TOKEN");
  }

  /**
   * Use to get swap information from response(s)
   * @param responses
   * @returns
   */
  static getSwapInfo(...responses: any[]): {
    fromSymbol: string;
    toSymbol: string;
    amount: number;
    txBytes?: string;
  } | null {
    const swapResponse = responses.find(
      (response) => response.action === "SWAP_TOKEN"
    );
    console.log("PHAP-SWAP-RESPONSE", swapResponse);
    const txResponse = responses.find((response) => response.params?.txBytes);
    console.log("PHAP-TX-RESPONSE", txResponse);

    if (txResponse?.content) {
      return {
        fromSymbol: txResponse.content.from_token,
        toSymbol: txResponse.content.destination_token,
        amount: txResponse.content.amount,
        txBytes: txResponse?.params?.txBytes,
      };
    }

    return null;
  }
}
