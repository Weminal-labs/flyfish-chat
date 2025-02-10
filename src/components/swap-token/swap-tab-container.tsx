import React from "react";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanels,
  TabPanel,
  Transition,
} from "@headlessui/react";
import { TokenData } from "../../types/token";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { useWallet } from "@suiet/wallet-kit";
import { TokenAPI } from "src/objects/token/api";
import JsonLogger from "./swap-log";
import ConnectWallet from "../ui/connect-wallet";
import handleSwap from "./sign-transaction";

type SwapModalAgentProps = {
  isOpen: boolean;
  fromSymbol: string;
  toSymbol: string;
  amount: number;
  txBytes?: string;
  logs: string[];
};

export default function SwapTabContainer({
  isOpen,
  fromSymbol,
  toSymbol,
  amount,
  txBytes,
  logs,
}: SwapModalAgentProps) {
  const { connected, signAndExecuteTransaction } = useWallet();

  const [fromToken, setFromToken] = React.useState<TokenData | null>(null);
  const [toToken, setToToken] = React.useState<TokenData | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchTokensInfo = async () => {
      setLoading(true);
      try {
        const tokens = await TokenAPI.getTokenPrices();

        // Tìm token từ danh sách dựa vào symbol
        const from = tokens.find(
          (t) => t.symbol.toLowerCase() === fromSymbol.toLowerCase()
        );
        const to = tokens.find(
          (t) => t.symbol.toLowerCase() === toSymbol.toLowerCase()
        );

        setFromToken(from || null);
        setToToken(to || null);
        console.log("from", from);
        console.log("to", to);
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

    // Tính toán dựa trên USD value của 1 token
    const usdValue = 1 * fromToken.price;
    const toValue = usdValue / toToken.price;

    // Làm tròn số dựa trên decimals của token đích
    const decimals = toToken.decimals || 9;
    return toValue.toFixed(decimals);
  };

  const handleSwapTab = async () => {
    const tx = handleSwap(txBytes);
    console.log("tx", tx);

    await signAndExecuteTransaction({
      transaction: tx,
    }).then(async (result) => {
      alert("Sui sent successfully");
    });
  };

  if (!connected) {
    return <ConnectWallet />;
  }

  // if (!isOpen) {
  //   return null;
  // }

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Transition.Child
        as={React.Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" />
      </Transition.Child>
      <div className=" inset-x-0 bottom-0 z-50 p-4 bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-left shadow-xl">
          <TabGroup>
            <TabList className="flex space-x-4 border-b border-gray-200 mb-4">
              <Tab
                className={({ selected }) =>
                  `px-4 py-2 text-sm font-medium border-b-2 ${
                    selected
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-500 hover:text-blue-400"
                  } transition-colors duration-200`
                }
              >
                Swap
              </Tab>
              <Tab
                className={({ selected }) =>
                  `px-4 py-2 text-sm font-medium border-b-2 ${
                    selected
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-500 hover:text-blue-400"
                  } transition-colors duration-200`
                }
              >
                Logs
              </Tab>
            </TabList>

            <TabPanels>
              {loading ? (
                <div className="text-center text-gray-400 py-4">Loading...</div>
              ) : (
                <>
                  <TabPanel>
                    <div className="bg-[#ffffff] rounded-lg border border-gray-200 p-4 mb-4">
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
                            <div className="text-gray-900 text-xl">
                              {amount}
                            </div>
                            <div className="text-gray-500">{fromSymbol}</div>
                          </div>
                        </div>
                        <div className="text-right text-gray-500">
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
                            <div className="text-gray-900 text-xl">
                              {(amount * Number(getExchangeRate())).toFixed(6)}
                            </div>
                            <div className="text-gray-500">{toSymbol}</div>
                          </div>
                        </div>
                        <div className="text-right text-gray-500">
                          $
                          {getUSDValue(
                            amount * Number(getExchangeRate()),
                            toToken
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      <div>Exchange Rate:</div>
                      <div>
                        1 {fromSymbol} = {getExchangeRate()} {toSymbol}
                      </div>
                    </div>

                    <button
                      disabled={!txBytes}
                      onClick={handleSwapTab}
                      className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg border border-blue-600 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Swap
                    </button>
                  </TabPanel>

                  <TabPanel>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
                      <JsonLogger logs={logs} />
                    </div>
                  </TabPanel>
                </>
              )}
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </Transition>
  );
}
