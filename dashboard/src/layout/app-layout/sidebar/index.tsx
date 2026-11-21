"use client";

import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "@/lib/navigation";
import { botItems, navItems, systemItems } from "./data";
import AppSidebarHeader from "./sidebar-header";
import SidebarNavGroup from "./sidebar-nav-group";
import SidebarWidget from "./sidebar-widget";
import { MenuType, NavItem } from "./types";

const menuSections: { type: MenuType; labelKey: string; items: NavItem[] }[] = [
  { type: "main", labelKey: "groups.menu", items: navItems },
  { type: "support", labelKey: "groups.bot", items: botItems },
  { type: "others", labelKey: "groups.system", items: systemItems },
];

export default function AppSidebar() {
  const { open, isMobile, isHovered } = useSidebar();
  const pathname = usePathname();
  const showContent = open || isHovered || isMobile;
  const active = pathname.startsWith("/groups") ? "/groups" : pathname;

  return (
    <Sidebar side="left" collapsible="icon">
      <AppSidebarHeader showContent={showContent} />
      <SidebarContent className="overflow-y-auto px-5 duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {menuSections.map((section) => (
              <SidebarNavGroup
                key={section.type}
                labelKey={section.labelKey}
                menuType={section.type}
                items={section.items}
                openSubmenu={null}
                showContent={showContent}
                pathname={active}
                onToggleSubmenu={() => {}}
              />
            ))}
          </div>
        </nav>
        {showContent && <SidebarWidget />}
      </SidebarContent>
    </Sidebar>
  );
}
