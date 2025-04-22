import * as React from "react";
import { CirclePlus, Ticket, Tickets } from "lucide-react";
import { NavLinks } from "@/components/nav-links";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/sidebar";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAttendant } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <Link to="/">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Tickets className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">HelpMe</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavLinks
          projects={[
            {
              name: "Chamados",
              url: "/",
              icon: Ticket,
            },
            // Exibir "Abrir chamado" apenas para clientes
            ...(!isAttendant
              ? [
                  {
                    name: "Abrir chamado",
                    url: "/tickets/new",
                    icon: CirclePlus,
                  },
                ]
              : []),
          ]}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
