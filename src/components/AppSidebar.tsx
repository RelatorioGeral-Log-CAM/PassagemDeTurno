import { 
  Users, 
  Clock, 
  Package, 
  Truck, 
  Archive, 
  Boxes,
  BarChart3,
  Building2,
  QrCode
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { 
    title: "Dashboard", 
    id: "dashboard", 
    icon: BarChart3
  },
  { 
    title: "$ Campo Transitório", 
    id: "campo-transitorio", 
    icon: Users
  },
  { 
    title: "Conexões", 
    id: "conexoes", 
    icon: Package
  },
  { 
    title: "Registro de presença", 
    id: "registro-presenca", 
    icon: QrCode
  },
];

interface AppSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (pageId: string) => currentPage === pageId;

  return (
    <Sidebar
      variant="sidebar"
      className={collapsed ? "w-16" : "w-64"}
    >
      <SidebarContent>
        <SidebarGroup>
          <div className="bg-gradient-primary p-4 border-b border-border/20">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-white flex-shrink-0" />
              {!collapsed && (
                <div className="text-white">
                  <h1 className="text-lg font-bold leading-tight">
                    Passagem de Turno
                  </h1>
                  <p className="text-sm opacity-90 font-medium">Logística CAM - Grupo Boticário</p>
                </div>
              )}
            </div>
          </div>
          
          <SidebarGroupLabel className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {collapsed ? "Menu" : "Navegação"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onNavigate(item.id)}
                    className={`
                      ${isActive(item.id) 
                        ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                        : "hover:bg-muted/50"
                      }
                      ${collapsed ? "justify-center" : "justify-start"}
                      transition-all duration-200
                    `}
                  >
                    <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"} flex-shrink-0`} />
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.title}</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}