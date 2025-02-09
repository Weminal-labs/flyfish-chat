import React, { useState, useEffect } from 'react';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import ChooseTokenModal from './choose-token-modal';
import { useWallet } from '@suiet/wallet-kit';
import ConnectWallet from 'src/components/ui/connect-wallet';
import { WalletUtils } from 'src/utils/wallet';
import { TokenData } from '../../../types/token';
import { getTokenSui, getTokenSuilend } from 'src/services/token.service';

export default function SwapPage() {
  // wallet
  const { connected, address } = useWallet();
  const [fromToken, setFromToken] = useState<TokenData>({ 
    symbol: 'SUI', 
    name: 'Sui', 
    logo: '/tokens/Sui.png',
    balance: '3.80'
  });
  const [toToken, setToToken] = useState<TokenData>({ 
    symbol: 'mSEND', 
    name: 'MoveSend', 
    logo: '/tokens/mSend.png',
    balance: '500'
  });
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChooseFromToken, setIsChooseFromToken] = useState(false);
  const [isChooseToToken, setIsChooseToToken] = useState(false);

  React.useEffect(() => {
    const getSuiToken = async () => {
      const suiToken = await getTokenSui();
      setFromToken(suiToken);
    };
    const getSuilendToken = async () => {
      const suilendToken = await getTokenSuilend();
      setToToken(suilendToken);
    };
    getSuiToken();
    getSuilendToken();
  }, []);
  const handleSwapPositions = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // Tính toán tỷ giá giữa hai token
  const calculateExchangeRate = (amount: string) => {
    if (!fromToken.price || !toToken.price || !amount) return '0';

    const fromValue = Number(amount);
    const fromTokenPrice = fromToken.price;
    const toTokenPrice = toToken.price;

    // Tính toán dựa trên USD value
    const usdValue = fromValue * fromTokenPrice;
    const toValue = usdValue / toTokenPrice;

    // Làm tròn số dựa trên decimals của token đích
    const decimals = toToken.decimals || 9;
    return toValue.toFixed(decimals);
  };

  // Cập nhật số lượng token đích khi thay đổi số lượng token nguồn
  useEffect(() => {
    const calculateToAmount = () => {
      const calculatedAmount = calculateExchangeRate(fromAmount);
      setToAmount(calculatedAmount);
    };
    calculateToAmount();
  }, [fromAmount, fromToken, toToken]);

  const handleSwap = async () => {
    setLoading(true);
    try {
      console.log(`Swapping ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`);
      // Thực hiện swap ở đây
    } catch (error) {
      console.error('Swap failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tính USD value
  const getUSDValue = (amount: string, token: TokenData) => {
    if (!token.price || !amount) return '0';
    const value = Number(amount) * token.price;
    return value.toFixed(2);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-4">
        {connected ? (
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Wallet: {WalletUtils.censorAddress(address!)}</div>
            <div className="text-sm text-gray-400 mb-2">Balance: 1000</div>
          </div>
        ): ( <ConnectWallet />)}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Buy</div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between mb-2">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="w-2/3 bg-transparent text-white text-2xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0.0"
              />
              <button
                onClick={() => setIsChooseFromToken(true)}
                className="flex items-center bg-gray-600 rounded-lg px-3 py-1 hover:bg-gray-500"
              >
                <img src={fromToken.logo} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
                <span className="text-white ml-2">{fromToken.symbol}</span>
                <span className="text-gray-400 ml-2">▼</span>
              </button>
            </div>
            <div className="text-gray-400">
              ${getUSDValue(fromAmount, fromToken)}
            </div>
          </div>
        </div>

        <div className="relative mb-4">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 mt-2">
            <button
              onClick={handleSwapPositions}
              className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ArrowsUpDownIcon className="w-5 h-5 text-blue-400" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Sell</div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between mb-2">
              <input
                type="number"
                value={toAmount}
                readOnly
                className="w-2/3 bg-transparent text-white text-2xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0.0"
              />
              <button
                onClick={() => setIsChooseToToken(true)}
                className="flex items-center bg-gray-600 rounded-lg px-3 py-1 hover:bg-gray-500"
              >
                <img src={toToken.logo} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
                <span className="text-white ml-2">{toToken.symbol}</span>
                <span className="text-gray-400 ml-2">▼</span>
              </button>
            </div>
            <div className="text-gray-400">
              ${getUSDValue(toAmount, toToken)}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400 mb-4">
          1 {fromToken.symbol} ≈ {calculateExchangeRate('1')} {toToken.symbol}
          {fromToken.price && toToken.price && (
            <div className="text-xs text-gray-500">
              1 {fromToken.symbol} = ${fromToken.price.toFixed(6)}
              {' | '}
              1 {toToken.symbol} = ${toToken.price.toFixed(6)}
            </div>
          )}
        </div>

        <button
          onClick={handleSwap}
          disabled={loading || !fromAmount}
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Swapping...' : 'Swap Tokens'}
        </button>
      </div>

      <ChooseTokenModal
        isOpen={isChooseFromToken}
        onClose={() => setIsChooseFromToken(false)}
        onSelect={setFromToken}
        excludeToken={toToken}
      />

      <ChooseTokenModal
        isOpen={isChooseToToken}
        onClose={() => setIsChooseToToken(false)}
        onSelect={setToToken}
        excludeToken={fromToken}
      />
    </div>
  );
} 
