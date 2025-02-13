import cn from "classnames";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  FileBox,
  Twitter,
  MessageSquareShare,
  Youtube,
  QrCode, 
  ChartNetwork
} from "lucide-react";
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

// Menu items.
const items = [
  {
    url: "/conversation",
    icon: MessageCircle,
    label: "Conversation",
  },
  {
    url: "/graph",
    icon: ChartNetwork ,
    label: "Graph",
  },
  {
    url: "https://weminal.craft.me/FlY_FISH_AI",
    icon: FileBox,
    label: "Documents",
  },
  {
    url: "https://x.com/0xFlyFish_agent",
    icon: Twitter,
    label: "Twitter",
  },
  {
    url: "https://www.canva.com/design/DAGee_3gdq0/QSytpzLfKWZ_e9gzJ0Ob9A/edit?utm_content=DAGee_3gdq0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
    icon: MessageSquareShare,
    label: "Pitchdesk",
  },{
    url: "https://www.youtube.com/watch?v=wqBZD4jdMro",
    icon: Youtube,
    label: "Youtube",
  },
  {
    url: "https://linktr.ee/flyfish_agent",
    icon: QrCode,
    label: "Linktree",
  },
];

const sideBarClassName = cn([
  "[&>div[data-sidebar=sidebar]]:border",
  "[&>div[data-sidebar=sidebar]]:flex-1",
  "[&>div[data-sidebar=sidebar]]:rounded-lg",
]);

export function AppSidebar() {
  return (
    <Sidebar
      className={`p-2 ${sideBarClassName}`}
      variant="inset"
      collapsible="icon"
    >
      <SidebarHeader className="border-b rounded-t-lg max-h-[45px]">
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
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => item.label === "Conversation" ||item.label === "Graph")
                .map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Portfolio</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => item.label !== "Conversation" && item.label !== "Graph")
                .map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} target="_blank">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
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
