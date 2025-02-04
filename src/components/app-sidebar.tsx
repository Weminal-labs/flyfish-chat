import { Link } from "react-router-dom";
import { MessageCircle, Search, Settings } from "lucide-react";

// Import components
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "src/components/ui/sidebar";
import WalletInformationBox from "./wallet-information-box";

// Import data
import { AuthenticatedRoutesMetadata } from "src/routes/RootRoutes";

// Menu items.
const items = [
  {
    url: "/conversation",
    icon: MessageCircle,
  },
  {
    url: "/search",
    icon: Search,
  },
  {
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src="/logo.svg" />
            <AvatarFallback className="rounded-lg">App</AvatarFallback>
          </Avatar>
          <div className="truncate grid flex-1 text-left text-sm leading-tight">
            <h1 className="font-bold">{import.meta.env.VITE_APP_NAME}</h1>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Porfolio</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={AuthenticatedRoutesMetadata.get(item.url)}
                >
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{AuthenticatedRoutesMetadata.get(item.url)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <WalletInformationBox />
      </SidebarFooter>
    </Sidebar>
  );
}
