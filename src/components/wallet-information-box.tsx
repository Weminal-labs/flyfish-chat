// import { useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import ConnectWallet from "./ui/connect-wallet";
import { ChevronsUpDown, LogOut, Users } from "lucide-react";

// Import components
// import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "src/components/ui/sidebar";

// Import hooks
// import { useAuth } from "src/hooks/use-auth";
import { addressEllipsis } from "src/utils/number";

// Import objects
// import { UserUtils } from "src/objects/user/utils";

export default function WalletInformationBox() {
  // Get access to the wallet
  const wallet = useWallet();
  console.log(wallet);
  // const { address, setAddress } = useState<string | "">("0x23523525524....235235");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  <ConnectWallet />
                </span>
              </div>

              {wallet.status === "connected" && (
                <ChevronsUpDown className="ml-auto size-4" />
              )}

            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {wallet.status === "connected" && (
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-sidebar"
              side="right"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {wallet?.account && (
                        <div>
                          <p>Account: {addressEllipsis(wallet.account.address)}</p>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Users className="mr-2 size-4" />
                Change accounts
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 cursor-pointer"
                onClick={() => wallet.disconnect()}
              >
                <LogOut className="mr-2 size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
