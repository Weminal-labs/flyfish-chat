import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { TokenData, WalletBalance } from "../../types/token";
import { BALANCE_API, TokenService } from "../../services/token.service";
import axios from "axios";

interface ChooseTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: TokenData) => void;
  excludeToken?: TokenData;
  address?: string;
}

export default function ChooseTokenModal({
  isOpen,
  onClose,
  onSelect,
  excludeToken,
  address,
}: ChooseTokenModalProps) {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen && address) {
      fetchTokensWithBalance();
    }
  }, [isOpen, address]);

  const fetchTokensWithBalance = async () => {
    setLoading(true);
    try {
      const tokenData = await TokenService.getTokenPrices();

      if (address) {
        try {
          const balanceResponse = await axios.get(
            `${BALANCE_API}?address=${address}`
          );
          if (balanceResponse.data.status !== false) {
            const balances: WalletBalance[] = balanceResponse.data.data;

            // Gộp balance của các token trùng coinType
            const mergedBalances = balances.reduce(
              (
                acc: {
                  coinType: string;
                  balance: number;
                  symbol: string;
                }[],
                curr
              ) => {
                const existingToken = acc.find(
                  (t) => t.coinType === curr.coinType
                );
                if (existingToken) {
                  // Cộng dồn balance nếu token đã tồn tại
                  existingToken.balance += Number(curr.balance);
                } else {
                  // Thêm token mới vào mảng kết quả
                  acc.push({
                    coinType: curr.coinType,
                    balance: Number(curr.balance),
                    symbol: curr.symbol,
                  });
                }
                return acc;
              },
              []
            );

            // Map balance đã được gộp vào danh sách token
            const tokensWithBalance = tokenData.map((token) => {
              const tokenBalance = mergedBalances.find(
                (b) => b.coinType === token.coin_type
              );
              return {
                ...token,
                balance: tokenBalance ? tokenBalance.balance.toString() : "0",
              };
            });
            console.log("PHAP", tokensWithBalance);

            setTokens(tokensWithBalance);
          } else {
            setTokens(tokenData);
          }
        } catch (error) {
          console.error("Error fetching balances:", error);
          setTokens(tokenData);
        }
      } else {
        setTokens(tokenData);
      }
    } catch (error) {
      console.error("Error loading tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = tokens.filter((token) => {
    if (excludeToken && token.coin_type === excludeToken.coin_type) {
      return false;
    }

    const searchLower = searchQuery.toLowerCase();
    return (
      token.name.toLowerCase().includes(searchLower) ||
      token.symbol.toLowerCase().includes(searchLower) ||
      token.coin_type?.toLowerCase().includes(searchLower)
    );
  });

  const sortedTokens = filteredTokens.sort((a, b) => {
    if (a.symbol === "SUI") return -1;
    if (b.symbol === "SUI") return 1;

    const stablecoins = ["USDC", "USDT"];
    const aIsStable = stablecoins.includes(a.symbol);
    const bIsStable = stablecoins.includes(b.symbol);

    if (aIsStable && !bIsStable) return -1;
    if (!aIsStable && bIsStable) return 1;

    return a.symbol.localeCompare(b.symbol);
  });

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
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white mb-4"
                >
                  Select Token
                </Dialog.Title>

                <div className="mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, symbol or address"
                    className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                {loading ? (
                  <div className="text-center text-gray-400 py-4">
                    Loading tokens...
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {sortedTokens.map((token) => (
                      <button
                        key={token.coin_type}
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
                          <div className="ml-3 flex flex-col justify-start items-start">
                            <div className="self-start text-white font-medium">
                              {token.symbol}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {token.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white">
                            ${token.price?.toFixed(2)}
                          </div>
                          <div
                            className={`text-sm ${
                              token.price_change_24h &&
                              token.price_change_24h >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {token.price_change_24h?.toFixed(2)}%
                          </div>
                          {token.balance && (
                            <div className="text-sm text-gray-400">
                              Balance:{" "}
                              {token.balance
                                ? Number(token.balance).toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )
                                : "0.00"}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
