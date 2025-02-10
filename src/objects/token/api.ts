import { API } from "src/api";

// Import utils
// import { APIUtils } from "src/utils/api";
import { OtherUtils } from "src/utils/other";

// Import types
// import type { AxiosHeaders } from "axios";
import type { TokenData } from "./types";

const api = new API();
let tokenPricesCache: TokenData[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 90000; // 90 giây

export class TokenAPI {
  static async getTokenPrices(): Promise<TokenData[]> {
    const url = `${import.meta.env.VITE_SUICETUS_URL}/sui/coins_info`;
    const params = new URLSearchParams({ is_verified_coin: "true" });

    // Kiểm tra cache
    const now = Date.now();
    // lưu cached 30s
    if (tokenPricesCache && now - lastFetchTime < CACHE_DURATION) {
      return tokenPricesCache;
    }

    try {
      // Lấy SUI và mSEND token trước
      const [suiToken, suilendToken] = await Promise.all([
        TokenAPI.getTokenSui(),
        TokenAPI.getTokenSuilend(),
      ]);

      // Lấy danh sách các token khác
      const coinsResponse = await api.get<any>(url, { params });
      const tokens = coinsResponse.data.data.list;

      // Tạo Set để theo dõi các coin_type đã xử lý
      const processedCoinTypes = new Set([
        suiToken.coin_type,
        suilendToken.coin_type,
      ]);

      // Lấy giá cho tất cả token cùng lúc
      const tokenPromises = tokens.map(async (token: any) => {
        if (processedCoinTypes.has(token.coin_type)) {
          return null;
        }
        // Thêm coin_type vào Set( mục đích để tránh việc lấy giá token trùng lặp)
        processedCoinTypes.add(token.coin_type);
        return TokenAPI.getTokenPrice(token);
      });

      // Đảm bảo tất cả các token được lấy giá
      const tokensWithPrices = await Promise.all(tokenPromises);

      // Lọc và sắp xếp tokens
      const filteredTokens = tokensWithPrices
        .filter((token): token is TokenData => token !== null)
        .sort((a, b) => a.symbol.localeCompare(b.symbol));

      // Thêm SUI và mSEND vào đầu danh sách
      tokenPricesCache = [suiToken, suilendToken, ...filteredTokens];
      // Cập nhật thời gian lấy giá ( để cache )
      lastFetchTime = now;

      return tokenPricesCache;
    } catch (error) {
      console.error("Error fetching token data:", error);
      return tokenPricesCache || []; // Trả về cache cũ nếu có lỗi
    }
  }

  // Xóa cache khi cần
  static clearCache() {
    tokenPricesCache = null;
    lastFetchTime = 0;
  }

  // Cập nhật hàm lấy balance
  static async getTokenBalance(
    address: string,
    coinType: string
  ): Promise<string> {
    const url = `${import.meta.env.VITE_SWAP_SERVER_URL}/allTokens`;
    const params = new URLSearchParams({ address });

    try {
      const response = await api.get<any>(url, { params });

      if (response.data.status === false) {
        console.error("Error fetching balance:", response.data.data);
        return "0";
      }

      // Tìm token balance trong danh sách trả về
      const tokenBalance = response.data.data.find(
        (token: any) => token.coin_type === coinType
      );

      if (tokenBalance && tokenBalance.balance) {
        return tokenBalance.balance.toString();
      }

      return "0";
    } catch (error) {
      console.error("Error fetching token balance:", error);
      return "0";
    }
  }

  static async getTokenPriceByCoinType(coinType: string) {
    const url = `${import.meta.env.VITE_SUILEND_URL}/price`;
    const params = new URLSearchParams({ address: coinType });

    try {
      const priceResponse = await api.get<any>(url, { params });
      const priceData = priceResponse.data.data;

      return priceData?.value;
    } catch (error) {
      console.error(`Error fetching price for ${coinType}:`, error);
      return null;
    }
  }

  static async getTokenPrice(token: any): Promise<TokenData | null> {
    const url = `${import.meta.env.VITE_SUILEND_URL}/price`;
    const params = new URLSearchParams({ address: token.coin_type });

    try {
      const priceResponse = await api.get<any>(url, { params });
      const priceData = priceResponse.data.data;

      return {
        symbol: token.symbol.toUpperCase(),
        name: token.name,
        logo: token.logo_url,
        decimals: token.decimals,
        coin_type: token.coin_type,
        price: priceData?.value || 0,
        price_change_24h: priceData?.priceChange24h || 0,
      };
    } catch (error) {
      console.error(`Error fetching price for ${token.symbol}:`, error);
      return null;
    }
  }

  // Các hàm helper cho token cụ thể
  static async getTokenSui(): Promise<TokenData> {
    const priceData = await TokenAPI.getTokenBySymbol("0x2::sui::SUI");
    return {
      symbol: "SUI",
      name: "Sui",
      logo: "/tokens/Sui.png",
      balance: priceData.balance,
      price: priceData.value,
      price_change_24h: priceData.priceChange24h || 0,
      decimals: priceData.decimals,
      coin_type: "0x2::sui::SUI",
    };
  }

  static async getTokenSuilend(): Promise<TokenData> {
    const coinType =
      "0xda097d57ae887fbd002fb5847dd0ab47ae7e1b183fd36832a51182c52257e1bc::msend_series_1::MSEND_SERIES_1";
    const priceData = await TokenAPI.getTokenBySymbol(coinType);
    return {
      symbol: "mSEND",
      name: "mSend",
      logo: "/tokens/mSend.png",
      balance: priceData.balance,
      price: priceData.value,
      price_change_24h: priceData.priceChange24h || 0,
      decimals: priceData.decimals,
      coin_type: coinType,
    };
  }

  static async getTokenBySymbol(address: string) {
    const url = `${import.meta.env.VITE_SUILEND_URL}/price`;
    const params = new URLSearchParams({ address });

    try {
      const response = await api.get<any>(url, { params });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching token for ${address}:`, error);
    }
  }
}
