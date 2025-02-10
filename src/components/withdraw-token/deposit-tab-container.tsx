import React from "react";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { useWallet } from "@suiet/wallet-kit";

// Import components
import JsonLogger from "../log";
import ConnectWallet from "../ui/connect-wallet";

// Import objects
import { TokenAPI } from "src/objects/token/api";

// Import utils
import { WalletUtils } from "src/utils/wallet";

// Import types
import { TokenData } from "src/types/token";

type WithdrawTabContainerProps = {
  symbol: string;
  amount: number;
  txBytes?: string;
  logs: string;
};

export default function WithdrawTabContainer({
  symbol,
  amount,
  txBytes,
  logs,
}: WithdrawTabContainerProps) {
  const { connected, signAndExecuteTransaction } = useWallet();
  const [price, setPrice] = React.useState<string>("0.0");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    TokenAPI.getTokenPriceByCoinType("0x2::sui::SUI").then((price) => {
      if (price) {
        setPrice(price);
      }
    });
  }, []);

  // React.useEffect(() => {
  //   const fetchTokensInfo = async () => {
  //     setLoading(true);
  //     try {
  //       const tokens = await TokenAPI.getTokenPrices();

  //       // Tìm token từ danh sách dựa vào symbol
  //       const from = tokens.find(
  //         (t) => t.symbol.toLowerCase() === fromSymbol.toLowerCase()
  //       );
  //       const to = tokens.find(
  //         (t) => t.symbol.toLowerCase() === toSymbol.toLowerCase()
  //       );

  //       setFromToken(from || null);
  //       setToToken(to || null);
  //       console.log("from", from);
  //       console.log("to", to);
  //     } catch (error) {
  //       console.error("Error fetching tokens:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (isOpen) {
  //     fetchTokensInfo();
  //   }
  // }, [isOpen, fromSymbol, toSymbol]);

  // Tính toán giá trị USD
  // const getUSDValue = (tokenAmount: number, token: TokenData | null) => {
  //   if (!token?.price) return "0";
  //   return (tokenAmount * token.price).toFixed(2);
  // };

  // // Tính tỷ giá
  // const getExchangeRate = () => {
  //   if (!fromToken?.price || !toToken?.price) return "0";

  //   // Tính toán dựa trên USD value của 1 token
  //   const usdValue = 1 * fromToken.price;
  //   const toValue = usdValue / toToken.price;

  //   // Làm tròn số dựa trên decimals của token đích
  //   const decimals = toToken.decimals || 9;
  //   return toValue.toFixed(decimals);
  // };

  const handleWithdrawTransation = async () => {
    if (!txBytes) {
      alert("No transaction bytes found");
      return;
    }
    const txn = WalletUtils.createTransactionFromTxBytes(txBytes);

    await signAndExecuteTransaction({
      transaction: txn,
    });
  };

  if (!connected) {
    return <ConnectWallet />;
  }

  // if (!isOpen) {
  //   return null;
  // }

  return (
    <div className="inset-x-0 bottom-0 z-50">
      <div className=" inset-x-0 bottom-0 z-50">
        <div className="w-full max-w-md bg-slate-50 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-left shadow-sm">
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
                Withdraw
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
                    <div className="flex justify-between rounded-lg px-3 py-2 bg-border mb-3">
                      <p className="font-bold">{amount}</p>
                      <p className="font-bold">{symbol}</p>
                    </div>
                    <div className="flex justify-between px-3 mb-3">
                      <p>Price</p>
                      <p>${price}</p>
                    </div>
                    <button
                      disabled={!txBytes}
                      onClick={handleWithdrawTransation}
                      className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg border border-blue-600 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Withdraw
                    </button>
                  </TabPanel>

                  <TabPanel>
                    <div className="bg-gray-50 ">
                      <JsonLogger logs={logs} />
                    </div>
                  </TabPanel>
                </>
              )}
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  );
}
