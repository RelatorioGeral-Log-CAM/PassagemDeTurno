import { 
  Users, 
  Clock, 
  Package, 
  Truck, 
  Archive, 
  Boxes,
  BarChart3,
  Building2 
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
    icon: BarChart3,
    description: "Visão geral"
  },
  { 
    title: "Separação", 
    id: "separacao", 
    icon: Clock,
    description: "Controle de separação"
  },
  { 
    title: "Matéria Prima", 
    id: "materia-prima", 
    icon: Package,
    description: "Recebimento MP"
  },
  { 
    title: "Expedição", 
    id: "expedicao", 
    icon: Truck,
    description: "Gestão de expedição"
  },
  { 
    title: "Recebimento ME", 
    id: "recebimento-me", 
    icon: Archive,
    description: "Materiais e embalagens"
  },
  { 
    title: "Armazém Estojos", 
    id: "armazem-estojos", 
    icon: Boxes,
    description: "Controle de armazenagem"
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
          <div className="flex items-center gap-3 px-3 py-4 border-b border-border">
            <Building2 className="h-8 w-8 text-primary flex-shrink-0" />
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">
                  Logística CAM
                </h1>
                <p className="text-xs text-muted-foreground">Grupo Boticário</p>
              </div>
            )}
          </div>
          
          <SidebarGroupLabel className="px-3 py-2">
            {collapsed ? "Menu" : "Passagem de Turno"}
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
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </div>
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