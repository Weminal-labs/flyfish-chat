import axios from "axios";
import { TokenData } from "../types/token";

const COINS_INFO_API = "https://api-sui.cetus.zone/v2/sui/coins_info?is_verified_coin=true";
const PRICE_API = "https://api.suilend.fi/proxy/price?address=";
// API để lấy balance của token trong ví
export const BALANCE_API = "https://swap-be-git-main-phuquivos-projects.vercel.app/allTokens";

// Cache để lưu trữ kết quả API
let tokenPricesCache: TokenData[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 90000; // 90 giây

export const TokenService = {
  async getTokenPrices(): Promise<TokenData[]> {
    // Kiểm tra cache
    const now = Date.now();
    // lưu cached 30s
    if (tokenPricesCache && (now - lastFetchTime < CACHE_DURATION)) {
      return tokenPricesCache;
    }

    try {
      // Lấy SUI và mSEND token trước
      const [suiToken, suilendToken] = await Promise.all([
        getTokenSui(),
        getTokenSuilend()
      ]);
      
      // Lấy danh sách các token khác
      const coinsResponse = await axios.get(COINS_INFO_API);
      const tokens = coinsResponse.data.data.list;

      // Tạo Set để theo dõi các coin_type đã xử lý
      const processedCoinTypes = new Set([
        suiToken.coin_type,
        suilendToken.coin_type
      ]);

      // Lấy giá cho tất cả token cùng lúc
      const tokenPromises = tokens.map(async (token: any) => {
        if (processedCoinTypes.has(token.coin_type)) {
          return null;
        }
        // Thêm coin_type vào Set( mục đích để tránh việc lấy giá token trùng lặp)
        processedCoinTypes.add(token.coin_type);
        return getTokenPrice(token);
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
  },

  // Xóa cache khi cần
  clearCache() {
    tokenPricesCache = null;
    lastFetchTime = 0;
  },

  // Cập nhật hàm lấy balance
  async getTokenBalance(address: string, coinType: string): Promise<string> {
    try {
      const response = await axios.get(`${BALANCE_API}?address=${address}`);
      
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
};

// Hàm helper để lấy giá token
async function getTokenPrice(token: any): Promise<TokenData | null> {
  try {
    const priceResponse = await axios.get(`${PRICE_API}${token.coin_type}`);
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
export const getTokenSui = async (): Promise<TokenData> => {
  const priceData = await getTokenBySymbol("0x2::sui::SUI");
  return {
    symbol: 'SUI',
    name: 'Sui',
    logo: '/tokens/Sui.png',
    balance: priceData.balance,
    price: priceData.value,
    price_change_24h: priceData.priceChange24h || 0,
    decimals: priceData.decimals,
    coin_type: "0x2::sui::SUI",
  };
};

export const getTokenSuilend = async (): Promise<TokenData> => {
  const coinType = "0xda097d57ae887fbd002fb5847dd0ab47ae7e1b183fd36832a51182c52257e1bc::msend_series_1::MSEND_SERIES_1";
  const priceData = await getTokenBySymbol(coinType);
  return {
    symbol: 'mSEND',
    name: 'mSend',
    logo: '/tokens/mSend.png',
    balance: priceData.balance,
    price: priceData.value,
    price_change_24h: priceData.priceChange24h || 0,
    decimals: priceData.decimals,
    coin_type: coinType,
  };
};

export const getTokenBySymbol = async (address: string) => {
  const response = await axios.get(`${PRICE_API}${address}`);
  return response.data.data;
};
