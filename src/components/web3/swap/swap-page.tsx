import React, { useState } from 'react';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import ChooseTokenModal from './choose-token-modal';
import { useWallet } from '@suiet/wallet-kit';
import ConnectWallet from 'src/components/ui/connect-wallet';
import { WalletUtils } from 'src/utils/wallet';

interface Token {
  symbol: string;
  name: string;
  logo: string;
  balance?: string;
}

export default function SwapPage() {
  // wallet
  const { connected, address } = useWallet();

  const [fromToken, setFromToken] = useState<Token>({ 
    symbol: 'SUI', 
    name: 'Sui', 
    logo: '/tokens/Sui.png',
    balance: '3.80'
  });
  const [toToken, setToToken] = useState<Token>({ 
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

  const handleSwapPositions = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = async () => {
    setLoading(true);
    try {
      console.log(`Swapping ${fromAmount} ${fromToken.symbol} to ${toToken.symbol}`);
      setToAmount((Number(fromAmount) * 1.2).toString());
    } catch (error) {
      console.error('Swap failed:', error);
    } finally {
      setLoading(false);
    }
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
            <div className="text-gray-400">${(Number(fromAmount) * 2.89).toFixed(2)}</div>
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
            <div className="text-gray-400">${(Number(toAmount) * 1.2).toFixed(2)}</div>
          </div>
        </div>

        <div className="text-sm text-gray-400 mb-4">
          1 {fromToken.symbol} ≈ 2.643987 {toToken.symbol}
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
      />

      <ChooseTokenModal
        isOpen={isChooseToToken}
        onClose={() => setIsChooseToToken(false)}
        onSelect={setToToken}
      />
    </div>
  );
} 
