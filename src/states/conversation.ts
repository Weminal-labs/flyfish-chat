import { create } from "zustand";

// Import types
import type {
  UResponseStatus,
  DialogType,
  ConversationType,
} from "src/objects/conversation/types";

type ConversationState = {
  conversation: ConversationType;
  history: Array<any>;
};

type ConversationActions = {
  setConversation(conversation: ConversationType): void;
  setDoesFirstFetch(status?: boolean): void;
  setDoesFirstRender(status?: boolean): void;
  setDialogs(dialogs: Array<DialogType>): void;
  setHistory(history: Array<any> | null): void;
  setAgentId(agentId: string): void;
  addDialog(dialog: DialogType): void;
  addDialogs(dialogs: Array<DialogType>): void;
  removeLastDialog(): void;
  setConversationResponseStatus(status: UResponseStatus): void;
  reset(): void;
};

const initialState: ConversationState = {
  conversation: {
    agentId: "",
    doesFirstRender: false,
    doesFirstFetch: false,
    responseStatus: "WAITING",
    dialogs: [],
  },
  history: [],
};

export const useConversationState = create<
  ConversationState & ConversationActions
>((set) => {
  return {
    ...initialState,
    setDoesFirstFetch(status?: boolean) {
      set((state) => {
        const conversation = state.conversation || {
          ...initialState.conversation,
        };

        return {
          ...state,
          conversation: {
            ...conversation,
            doesFirstFetch: Boolean(status),
          },
        };
      });
    },
    setDoesFirstRender(status?: boolean) {
      set((state) => {
        const conversation = state.conversation || {
          ...initialState.conversation,
        };

        return {
          ...state,
          conversation: {
            ...conversation,
            doesFirstRender: Boolean(status),
          },
        };
      });
    },
    setConversation(conversation: ConversationType) {
      set((state) => ({
        ...state,
        conversation,
      }));
    },
    setDialogs(dialogs: Array<DialogType>) {
      set((state) => {
        const conversation = state.conversation || {
          ...initialState.conversation,
        };

        return {
          ...state,
          conversation: {
            ...conversation,
            dialogs,
          },
        };
      });
    },
    setAgentId(agentId: string) {
      set((state) => {
        const conversation = state.conversation || {
          ...initialState.conversation,
        };

        return {
          ...state,
          conversation: {
            ...conversation,
            agentId,
          },
        };
      });
    },
    addDialog(dialog: DialogType) {
      set((state) => {
        const conversation = state.conversation || {
          ...initialState.conversation,
        };

        return {
          ...state,
          conversation: {
            ...conversation,
            dialogs: conversation.dialogs.concat(dialog),
          },
        };
      });
    },
    addDialogs(dialogs: Array<DialogType>) {
      set((state) => {
        const conversation = state.conversation || {
          ...initialState.conversation,
        };

        return {
          ...state,
          conversation: {
            ...conversation,
            dialogs: conversation.dialogs.concat(dialogs),
          },
        };
      });
    },
    removeLastDialog() {
      set((state) => {
        if (!state.conversation) return { ...state };

        const dialogs = state.conversation.dialogs;

        // If dialogs aren't null
        if (dialogs.length > 0) {
          dialogs.pop();
        }

        return {
          ...state,
          conversation: {
            ...state.conversation,
            dialogs: dialogs,
          },
        };
      });
    },
    setConversationResponseStatus(status: UResponseStatus) {
      set((state) => {
        if (!state.conversation) return { ...state };

        return {
          ...state,
          conversation: {
            ...state.conversation,
            responseStatus: status,
          },
        };
      });
    },
    setHistory(history: Array<any>) {
      set((state) => ({
        ...state,
        history,
      }));
    },
    reset() {
      set(() => ({
        ...initialState,
      }));
    },
  };
});
