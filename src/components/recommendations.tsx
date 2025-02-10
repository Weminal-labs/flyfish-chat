import React from "react";
import {
  ArrowLeftRight,
  HardDriveDownload,
  HardDriveUpload,
  ScanQrCode,
} from "lucide-react";
import { useWallet } from "@suiet/wallet-kit";
import { useConversationState } from "src/states/conversation";
import { ConversationUtils } from "src/objects/conversation/utils";

export type RecommendationProps = {
  className?: string; // Cho phép tuỳ chỉnh class từ bên ngoài
};

interface RecommendItem {
  icon: React.ReactNode;
  name: string;
  des: string;
}

// Danh sách recommendation với dữ liệu linh hoạt hơn
const recommentItems = [
  {
    icon: <ArrowLeftRight />,
    name: "Swap",
    des: "Swap {amount} SUI to USDC for address ",
  },
  {
    icon: <HardDriveDownload />,
    name: "Deposit",
    des: "Deposit {amount} SUI in suilend for address ",
  },
  {
    icon: <HardDriveUpload />,
    name: "Withdraw",
    des: "Withdraw {amount} SUI from suilend for address ",
  },
  { icon: <ScanQrCode />, name: "Portfolio", des: "Get portfolio for address " },
];

// Component chính với React.memo để tối ưu re-render
const Recommendations: React.FC<RecommendationProps> = React.memo(
  ({ className = "" }) => {
    // Get wallet and conversation state
    const { account } = useWallet();
    // const { addDialog } = useConversationState();

    const handleItemClick = (item: RecommendItem) => {
      const fullDescription = account?.address
        ? `${item.des}${account.address}`
        : `${item.des}(Please connect wallet first)`;

      // // Add dialog to conversation
      // const userDialog = ConversationUtils.createDialog(
      //   fullDescription
      // );
      // addDialog(userDialog);
      const userInputElement = document.getElementById("user-input");
      if (userInputElement) {
        userInputElement.textContent = fullDescription;
      }
    };

    return (
      <div
        className={`flex justify-center flex-wrap gap-4 p-4 max-w-[900px] ${className}`}
      >
        {recommentItems.map((item, index) => (
          <div
            key={index}
            className="min-w-[400px] h-[80px] bg-background rounded-lg border border-gray-300 p-2 flex flex-col justify-center items-center gap-2 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            {/* Icon + Name */}
            <div className="flex items-center gap-2">
              <div className="text-gray-700">{item.icon}</div>
              <div className="font-medium">{item.name}</div>
            </div>

            {/* Description */}
            <div className="text-sm text-gray-500">
              {account?.address
                ? `${item.des}${account.address.slice(
                    0,
                    6
                  )}...${account.address.slice(-4)}`
                : item.des}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

export default Recommendations;
