export type UResponseStatus = "RESPONDING" | "WAITING" | "DONE";

export type ChatAIResponseDataType = {
  user: string;
  text: string;
  action?: string;
  content?: {
    from_token: string;
    destination_token: string;
    amount: number;
  };
  params?: {
    txBytes: string;
  };
};

export type DialogType = {
  id: string;
  sender: string;
  text: string;
  action?: string;
  isBeingGenerated?: boolean;
};

export type ConversationType = {
  agentId: string;
  doesFirstRender: boolean;
  doesFirstFetch: boolean;
  responseStatus: UResponseStatus;
  dialogs: Array<DialogType>;
};
