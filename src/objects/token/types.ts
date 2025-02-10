export interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

export interface TokenData {
  symbol: string;
  name: string;
  logo: string;
  balance?: string;
  price?: number;
  price_change_24h?: number;
  decimals?: number;
  coin_type?: string;
}

export interface WalletBalance {
  balance: number;
  coinObjectId: string;
  coinType: string;
  disget: string;
  previousTransaction: string;
  symbol: string;
  version: string;
}
