"use client";

import { Avatar } from "@/components/bot/kit";
import { useBot } from "@/components/bot/bot-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { ChevronDownIcon, DatabaseIcon, GearIcon, LogOutIcon } from "@/icons";
import { api, closeEvents } from "@/lib/api";
import { useTranslations } from "@/lib/intl";
import { Link } from "@/lib/navigation";
import { cn } from "@/utils";
import { useState } from "react";

export default function UserDropdown() {
  const t = useTranslations("userDropdown");
  const [isOpen, setIsOpen] = useState(false);
  const { status, botName } = useBot();
  const name = status?.me?.name || botName;

  const signOut = async () => {
    await api("POST", "/api/logout").catch(() => {});
    closeEvents();
    location.href = "/login/";
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="dropdown-toggle flex items-center text-gray-700 dark:text-gray-400">
        <Avatar name={name} size={44} square className="me-3" />
        <span className="me-1 block max-w-40 truncate text-sm font-medium">{name}</span>
        <ChevronDownIcon className={cn("size-5 text-gray-500 duration-200 dark:text-gray-400", isOpen ? "rotate-180" : "rotate-0")} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={12} className="w-65 p-3">
        <div className="px-3 py-2">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">{name}</span>
          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{status?.me ? `+${String(status.me.id).split("@")[0]}` : "Belum terhubung"}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/settings" />}>
          <GearIcon className="size-6" />
          {t("settings")}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/system" />}>
          <DatabaseIcon className="size-6" />
          {t("system")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOutIcon className="size-6" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
