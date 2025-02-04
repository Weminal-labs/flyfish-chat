import React from "react";
import { WalletMinimal, Repeat, ShieldCheck } from "lucide-react";

export type RecommendationProps = {
  className?: string; // Cho phép tuỳ chỉnh class từ bên ngoài
};

// Danh sách recommendation với dữ liệu linh hoạt hơn
const recommentItems = [
  { icon: <WalletMinimal />, name: "Wallet", des: "Connect Wallet" },
  { icon: <Repeat />, name: "Transactions", des: "Repeat Payments" },
  { icon: <ShieldCheck />, name: "Balance", des: "View Balance" },
  { icon: <ShieldCheck />, name: "Security", des: "Secure Funds" },
];

// Component chính với React.memo để tối ưu re-render
const Recommendation: React.FC<RecommendationProps> = React.memo(({ className = "" }) => {
  return (
    <div className={`flex flex-wrap gap-4 p-4 max-w-[900px] ${className}`}>
      {
        recommentItems.map((item, index) => (
          <div
            key={index}
            className="min-w-[400px] h-[80px] rounded-lg border border-gray-300 p-2 flex flex-col justify-center items-center gap-2 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            onClick={() => alert(item.name)}
          >
            {/* Icon + Name */}
            <div className="flex items-center gap-2 ">
              <div className="text-gray-700">{item.icon}</div>
              <div className="font-medium">{item.name}</div>
            </div>

            {/* Description */}
            <div className="text-sm text-gray-500">{item.des}</div>
          </div>
        ))
      }
    </div>
  );
});

export default Recommendation;
