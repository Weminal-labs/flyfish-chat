// Import routes
import RootRoutes from "./routes/RootRoutes";
import { SuietWallet, SuiWallet, WalletProvider } from "@suiet/wallet-kit";
import './wallet-custom.css';
import { CursorEffect } from './components/ui/cursor-effect';

function App() {
  return (
    <div className="relative min-h-screen">
      <CursorEffect />
      <WalletProvider defaultWallets={[SuietWallet, SuiWallet]}>
        <RootRoutes />
      </WalletProvider>
    </div>
  );
}

export default App;