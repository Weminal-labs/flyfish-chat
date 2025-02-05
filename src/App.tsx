// Import routes
import RootRoutes from "./routes/RootRoutes";
import { SuietWallet, SuiWallet, WalletProvider } from "@suiet/wallet-kit";
import './wallet-custom.css';

function App() {
  return (
    <WalletProvider defaultWallets={[
      SuietWallet,
      SuiWallet
    ]}>
      <RootRoutes />
    </ WalletProvider>
  );
}

export default App;
