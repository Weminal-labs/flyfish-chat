import { ConversationConstants } from "./constant";

// Import types
import type { DialogType } from "./types";

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
      message: input,
    } as DialogType;
  }
}
