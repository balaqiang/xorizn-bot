"use client";

import { SidebarHeader } from "@/components/ui/sidebar";
import { Link } from "@/lib/navigation";
import { cn } from "@/utils";

interface AppSidebarHeaderProps {
  showContent: boolean;
}

export default function AppSidebarHeader({
  showContent,
}: AppSidebarHeaderProps) {
  return (
    <SidebarHeader className="px-5 pt-5 pb-8">
      <Link
        href="/"
        className={cn(
          "flex items-center",
          !showContent ? "justify-center" : "justify-start",
        )}
      >
        {showContent ? (
          <span className="flex items-center gap-3">
            <img src="/images/logo/logo-icon.svg" alt="" width={36} height={36} />
            <span className="text-lg font-bold tracking-wide text-gray-900 uppercase dark:text-white">xorizn-bot</span>
          </span>
        ) : (
          <img src="/images/logo/logo-icon.svg" alt="xorizn-bot" width={32} height={32} />
        )}
      </Link>
    </SidebarHeader>
  );
}
