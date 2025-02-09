import {
  Dialog,
  Tab,
  TabGroup,
  TabList,
  Transition,
  TabPanels,
  TabPanel,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { TokenData } from "../../../types/token";
import { TokenService } from "../../../services/token.service";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { useWallet } from "@suiet/wallet-kit";
import ConnectWallet from "src/components/ui/connect-wallet";

interface SwapModalAgentProps {
  isOpen: boolean;
  onClose: () => void;
  fromSymbol: string;
  toSymbol: string;
  amount: number;
  txBytes?: string;
  onSwap: (txBytes: string) => void;
}

export default function SwapModalAgent({
  isOpen,
  onClose,
  fromSymbol,
  toSymbol,
  amount,
  txBytes,
  onSwap,
}: SwapModalAgentProps) {
  const { connected } = useWallet();

  //== init state
  const [fromToken, setFromToken] = useState<TokenData | null>(null);
  const [toToken, setToToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTokensInfo = async () => {
      setLoading(true);
      try {
        const tokens = await TokenService.getTokenPrices();

        // Tìm token từ danh sách dựa vào symbol
        const from = tokens.find(
          (t) => t.symbol.toLowerCase() === fromSymbol.toLowerCase()
        );
        const to = tokens.find(
          (t) => t.symbol.toLowerCase() === toSymbol.toLowerCase()
        );

        setFromToken(from || null);
        setToToken(to || null);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTokensInfo();
    }
  }, [isOpen, fromSymbol, toSymbol]);

  // Tính toán giá trị USD
  const getUSDValue = (tokenAmount: number, token: TokenData | null) => {
    if (!token?.price) return "0";
    return (tokenAmount * token.price).toFixed(2);
  };

  // Tính tỷ giá
  const getExchangeRate = () => {
    if (!fromToken?.price || !toToken?.price) return "0";
    const rate = toToken.price / fromToken.price;
    return rate.toFixed(6);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      {!connected ? (
        <ConnectWallet />
      ) : (
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-left align-middle shadow-xl transition-all">
                <TabGroup>
                  <TabList>
                    <Tab className={({ selected }) =>
                      `text-gray-400 ${
                        selected ? 'text-blue-500' : 'hover:text-blue-400'
                      } transition-colors duration-200`
                    }>
                      <Dialog.Title
                        as="h3"
                        className="p-2 text-lg font-medium leading-6"
                      >
                        Swap
                      </Dialog.Title>
                    </Tab>
                    <Tab className={({ selected }) =>
                      `text-gray-400 ${
                        selected ? 'text-blue-500' : 'hover:text-blue-400'
                      } transition-colors duration-200`
                    }>
                      <Dialog.Title
                        as="h3"
                        className="p-2 text-lg font-medium leading-6 mb-4"
                      >
                        Logs
                      </Dialog.Title>
                    </Tab>
                  </TabList>
                  <TabPanels>
                    {loading ? (
                      <div className="text-center text-gray-400 py-4">
                        Loading...
                      </div>
                    ) : (
                      <>
                        <TabPanel>
                          <div className="bg-[#ffffff] rounded-lg border border-gray-600 p-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                              {fromToken && (
                                <img
                                  src={fromToken.logo}
                                  alt={fromToken.symbol}
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                              )}
                              <div>
                                <div className="text-white text-xl">
                                  {amount}
                                </div>
                                <div className="text-gray-400">
                                  {fromSymbol}
                                </div>
                              </div>
                            </div>
                            <div className="text-right text-gray-400">
                              ${getUSDValue(amount, fromToken)}
                            </div>
                          </div>

                          <div className="flex justify-center my-2">
                            <ArrowsUpDownIcon className="w-5 h-5 text-blue-400" />
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              {toToken && (
                                <img
                                  src={toToken.logo}
                                  alt={toToken.symbol}
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                              )}
                              <div>
                                <div className="text-white text-xl">
                                  {(amount * Number(getExchangeRate())).toFixed(
                                    6
                                  )}
                                </div>
                                <div className="text-gray-400">{toSymbol}</div>
                              </div>
                            </div>
                            <div className="text-right text-gray-400">
                              $
                              {getUSDValue(
                                amount * Number(getExchangeRate()),
                                toToken
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-400 mb-4">
                          <div>Exchange Rate:</div>
                          <div>
                            1 {fromSymbol} = {getExchangeRate()} {toSymbol}
                          </div>
                        </div>

                        <button
                          onClick={() => txBytes && onSwap(txBytes)}
                          disabled={!txBytes}
                          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg border border-blue-600 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Confirm Swap
                        </button>
                      </TabPanel>

                    <TabPanel>
                      <div className="bg-gray-700 rounded-lg border border-gray-600 p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div>
                              <div className="text-white text-xl">1000</div>
                              <div className="text-gray-400">Sui</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    </>
                    )}
                  </TabPanels>
                </TabGroup>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      )}
    </Transition>
  );
}
