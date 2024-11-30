import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  User
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContext } from "react";
import { ContextComponent } from "@/context";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const { navigate, toast } = useContext(ContextComponent);
  const items = [
    {
      title: "Home",
      url: "",
      icon: Home,
    },
    {
      title: "Products Page",
      url: "products",
      icon: Inbox,
    },
    {
      title: "Sales",
      url: "sales",
      icon: Calendar,
    },
    {
      title: "Purchases",
      url: "purchases",
      icon: Search,
    },
  ];
  async function handleLogout() {
    localStorage.clear();
    navigate("/signin");
    toast({
      title: "Logging Out",
      description: "You have been logged out successfully.",
    });
  }
  return (
    <Sidebar>
      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={`/${item.url}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-black">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="bg-black text-white">
                  <User /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] bg-black text-white"
              >
                <Link to={"/profile"}>
                  <DropdownMenuItem className="text-white font-normal">
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleLogout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
