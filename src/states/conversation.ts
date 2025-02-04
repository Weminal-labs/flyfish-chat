import { create } from "zustand";

// Import types
import { ConversationType } from "src/objects/conversation/types";

type ConversationState = {
  conversation: ConversationType | null;
  history: Array<any> | null;
};

type ConversationActions = {
  setConversation(conversation: any): void;
  setDialogs(dialogs: Array<any>): void;
  setHistory(history: Array<any> | null): void;
};

export const useConversation = create<ConversationState & ConversationActions>(
  (set) => {
    return {
      conversation: null,
      history: [],
      setConversation(conversation: any) {
        set((state) => ({
          ...state,
          conversation,
        }));
      },
      setDialogs(dialogs: Array<any>) {
        set((state) => {
          const conversation = state.conversation || {};

          return {
            ...state,
            conversation: {
              ...conversation,
              dialogs,
            },
          };
        });
      },
      setHistory(history: Array<any> | null) {
        set((state) => ({
          ...state,
          history,
        }));
      },
    };
  }
);
