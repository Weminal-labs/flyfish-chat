import axios from 'axios';

const AI_API = 'http://54.179.136.249:3000/2cd8f9e3-d62e-0d8a-b20e-981b21e355c6/message';

export interface AIResponse {
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
}

export interface AIResponseSwapToken {
  content: {
    amount: number;
    from_token: string;
    destination_token: string;
  };
  params?: {
    txBytes: string;
  };
  text: string;
}

export const AIService = {
  async sendMessage(message: string): Promise<any[]> {
    try {
      const response = await axios.post(AI_API, {
        text: message,
        user: "user"
      });

      console.log("PHAP-AI-RESPONSE-MESSAGE", response);

      if (response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw error;
    }
  },

  // Kiểm tra xem response có phải là swap action không
  isSwapAction(response: any[]): boolean {
    return response.some(item => item.action === 'SWAP_TOKEN');
  },

  // Lấy thông tin swap từ response
  getSwapInfo(response: any[]): {
    fromSymbol: string;
    toSymbol: string;
    amount: number;
    txBytes?: string;
  } | null {
    const swapResponse = response.find(item => item.action === 'SWAP_TOKEN');
    console.log("PHAP-SWAP-RESPONSE", swapResponse);
    const txResponse = response.find(item => item.params?.txBytes);
    console.log("PHAP-TX-RESPONSE", txResponse);

    if (txResponse?.content) {
      return {
        fromSymbol: txResponse.content.from_token,
        toSymbol: txResponse.content.destination_token,
        amount: txResponse.content.amount,
        txBytes: txResponse?.params?.txBytes
      };
    }

    return null;
  }
};
