import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Token {
  symbol: string;
  name: string;
  logo: string;
  balance?: string;
}

const TOKENS: Token[] = [
  { symbol: 'SUI', name: 'Sui', logo: '/tokens/Sui.png', balance: '3.80' },
  { symbol: 'mSEND', name: 'MoveSend', logo: '/tokens/mSend.png', balance: '500' },
  { symbol: 'USDC', name: 'USD Coin', logo: '/tokens/mSend.png', balance: '1000' },
  { symbol: 'USDT', name: 'Tether', logo: '/tokens/mSend.png', balance: '1000' },
];

interface ChooseTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
}

export default function ChooseTokenModal({ isOpen, onClose, onSelect }: ChooseTokenModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white mb-4">
                  Select Token
                </Dialog.Title>
                
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search by token name or address"
                    className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {TOKENS.map((token) => (
                    <button
                      key={token.symbol}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={() => {
                        onSelect(token);
                        onClose();
                      }}
                    >
                      <div className="flex items-center">
                        <img
                          src={token.logo}
                          alt={token.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="ml-3">
                          <div className="text-white font-medium">{token.symbol}</div>
                          <div className="text-gray-400 text-sm">{token.name}</div>
                        </div>
                      </div>
                      {token.balance && (
                        <div className="text-white">{token.balance}</div>
                      )}
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 