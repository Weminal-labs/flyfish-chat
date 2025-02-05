import { ConnectButton } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

export default function ConnectWallet() {
  return (
    <div className="w-full overflow-hidden border-white">
      <ConnectButton className="bg-blue-500" children="Connect Wallet" />
    </div>
  );
}
