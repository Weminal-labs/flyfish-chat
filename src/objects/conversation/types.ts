export type UResponseStatus = "RESPONDING" | "WAITING" | "DONE";

export type ChatAIResponseDataType = {
  user: string;
  text: string;
  action?: string;
  params?: {
    amount: number;
    destination_token: {
      decimals: number;
      description: string;
      iconUrl: string;
      id: string;
      name: string;
      symbol: string;
    };
    from_token: {
      decimals: number;
      description: string;
      iconUrl: string;
      id: string;
      name: string;
      symbol: string;
    };
    txBytes: string;
  };
};

export type DialogType = {
  id: string;
  sender: string;
  text: string;
  action?: string;
  params?: {
    amount: string;
    destination_token: {
      decimals: number;
      description: string;
      iconUrl: string;
      id: string;
      name: string;
      symbol: string;
    };
    from_token: {
      decimals: number;
      description: string;
      iconUrl: string;
      id: string;
      name: string;
      symbol: string;
    };
    txBytes?: string;
  };
  isBeingGenerated?: boolean;
};

export type ConversationType = {
  agentId: string;
  doesFirstRender: boolean;
  doesFirstFetch: boolean;
  responseStatus: UResponseStatus;
  dialogs: Array<DialogType>;
};
