import axios from "axios";
import { TokenData } from "../types/token";

const COINS_INFO_API =
  "https://api-sui.cetus.zone/v2/sui/coins_info?is_verified_coin=true";
const PRICE_API = "https://api.suilend.fi/proxy/price?address=";

export const TokenService = {
  async getTokenPrices(): Promise<TokenData[]> {
    try {
      // Lấy SUI và mSEND token trước
      const suiToken = await getTokenSui();
      const suilendToken = await getTokenSuilend();
      
      // Lấy danh sách các token khác
      const coinsResponse = await axios.get(COINS_INFO_API);
      const tokens = coinsResponse.data.data.list;

      // Tạo Set để theo dõi các coin_type đã xử lý
      const processedCoinTypes = new Set([
        "0x2::sui::SUI",
        "0xda097d57ae887fbd002fb5847dd0ab47ae7e1b183fd36832a51182c52257e1bc::msend_series_1::MSEND_SERIES_1"
      ]);

      const tokensWithPrices = await Promise.all(
        tokens.map(async (token: any) => {
          try {
            // Kiểm tra nếu coin_type đã được xử lý
            if (processedCoinTypes.has(token.coin_type)) {
              return null;
            }
            
            // Thêm coin_type vào Set
            processedCoinTypes.add(token.coin_type);

            const priceResponse = await axios.get(
              `${PRICE_API}${token.coin_type}`
            );
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
          } catch (priceError) {
            console.error(
              `Error fetching price for ${token.symbol}:`,
              priceError
            );
            return {
              symbol: token.symbol.toUpperCase(),
              name: token.name,
              logo: token.logo_url,
              decimals: token.decimals,
              coin_type: token.coin_type,
              price: 0,
              price_change_24h: 0,
            };
          }
        })
      );

      // Lọc bỏ các giá trị null và thêm SUI và mSEND token vào đầu danh sách
      const filteredTokens = tokensWithPrices
        .filter(token => token !== null)
        // Sắp xếp theo symbol để dễ tìm kiếm
        .sort((a, b) => a!.symbol.localeCompare(b!.symbol));

      // Thêm cả SUI và mSEND vào đầu danh sách
      return [suiToken, suilendToken, ...filteredTokens];
    } catch (error) {
      console.error("Error fetching token data:", error);
      return [];
    }
  },
};

// get token by symbol
export const getTokenBySymbol = async (address: string) => {
  const apiUrl = `${PRICE_API}${address}`;
  const tokens = await axios.get(apiUrl);
  return tokens.data.data;
};
// get token sui
export const getTokenSui = async () => {
  const apiUrl = `${PRICE_API}0x2::sui::SUI`;
  const tokens = await axios.get(apiUrl);
  const tokenData: TokenData = {
    symbol: 'SUI',
    name: 'Sui',
    logo: '/tokens/Sui.png',
    balance: tokens.data.data.value,
    price: tokens.data.data.value,
    price_change_24h: tokens.data.data.priceChange24h || 0,
    decimals: tokens.data.data.decimals,
    coin_type: "0x2::sui::SUI",
  };
  return tokenData;
};
// get token by usdc
export const getTokenUsdc = async () => {
  const apiUrl = `${PRICE_API}0x7f5c7618d39535669b9b27b40e54c98d2dab2deb::usdc::USDC`;
  const tokens = await axios.get(apiUrl);
  const tokenData: TokenData = {
    symbol: 'USDC',
    name: 'USD Coin',
    logo: '/tokens/usdc.png',
    balance: tokens.data.data.value,
    price: tokens.data.data.value,
    price_change_24h: tokens.data.data.priceChange24h || 0,
    decimals: tokens.data.data.decimals,
    coin_type: "0x7f5c7618d39535669b9b27b40e54c98d2dab2deb::usdc::USDC",
  };
  return tokenData;
};

// get token suilend
export const getTokenSuilend = async () => {
  const apiUrl = `${PRICE_API}0xda097d57ae887fbd002fb5847dd0ab47ae7e1b183fd36832a51182c52257e1bc::msend_series_1::MSEND_SERIES_1`;
  const tokens = await axios.get(apiUrl);
  const tokenData: TokenData = {
    symbol: 'mSEND',
    name: 'mSend',
    logo: '/tokens/mSend.png',
    balance: tokens.data.data.value,
    price: tokens.data.data.value,
    price_change_24h: tokens.data.data.priceChange24h || 0,
    decimals: tokens.data.data.decimals,
    coin_type: "0xda097d57ae887fbd002fb5847dd0ab47ae7e1b183fd36832a51182c52257e1bc::msend_series_1::MSEND_SERIES_1",
  };
  return tokenData;
};
