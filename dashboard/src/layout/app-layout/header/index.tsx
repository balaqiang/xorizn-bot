"use client";

import { StatusPill } from "@/components/bot/kit";
import { useBot } from "@/components/bot/bot-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useSidebar } from "@/components/ui/sidebar";
import { HorizontalDotsIcon, MenuTwoIcon, SearchIcon, XIcon } from "@/icons";
import NotificationDropdown from "@/layout/header/notification-dropdown";
import ThemeToggleButton from "@/layout/header/theme-toggler";
import UserDropdown from "@/layout/header/user-dropdown";
import { useTranslations } from "@/lib/intl";
import { Link, useRouter } from "@/lib/navigation";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";

export default function AppHeader() {
  const t = useTranslations("header");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { openMobile, toggleSidebar } = useSidebar();
  const { status, botName } = useBot();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex w-full shrink-0 border-gray-200 bg-white xl:border-b dark:border-gray-800 dark:bg-gray-900">
      <div className="flex grow flex-col items-center justify-between xl:flex-row xl:px-6">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 sm:gap-4 xl:justify-normal xl:border-b-0 xl:px-0 xl:py-4 dark:border-gray-800">
          <Button variant="outline" size="icon" className="text-gray-500 lg:size-11 dark:text-gray-400" onClick={toggleSidebar} aria-label={t("toggleSidebar")}>
            {openMobile ? <XIcon className="size-6" /> : <MenuTwoIcon className="size-auto!" />}
          </Button>

          <Link href="/" className="flex items-center gap-2 xl:hidden">
            <img src="/images/logo/logo-icon.svg" alt="" width={32} height={32} />
            <span className="font-bold text-gray-900 dark:text-white">{botName}</span>
          </Link>

          <Button variant="ghost" size="icon" onClick={() => setApplicationMenuOpen((v) => !v)} aria-label="Menu aplikasi" className="text-gray-700 xl:hidden dark:text-gray-400">
            <HorizontalDotsIcon />
          </Button>

          <div className="hidden xl:block">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = inputRef.current?.value.trim();
                router.push(`/commands/${q ? `?q=${encodeURIComponent(q)}` : ""}`);
              }}
            >
              <Field className="xl:w-107.5">
                <InputGroup className="border-gray-200 bg-transparent dark:border-gray-800 dark:bg-white/3">
                  <InputGroupAddon align="inline-start">
                    <SearchIcon className="size-5 text-gray-500 dark:text-gray-400" />
                  </InputGroupAddon>
                  <InputGroupInput ref={inputRef} type="text" placeholder={t("searchPlaceholder")} className="text-gray-800 placeholder:text-gray-400 dark:text-white/90 dark:placeholder:text-white/30" />
                  <InputGroupAddon align="inline-end">
                    <Badge variant="light" color="gray" size="sm" className="gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-1.75 py-[4.5px] text-xs text-gray-500 shadow-none dark:border-gray-800 dark:bg-white/3 dark:text-gray-400">
                      <span>⌘</span>
                      <span>K</span>
                    </Badge>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </form>
          </div>
        </div>

        <div className={cn("flex w-full items-center justify-between gap-4 px-5 py-4 shadow-theme-md xl:flex xl:justify-end xl:px-0 xl:shadow-none", isApplicationMenuOpen ? "flex" : "hidden")}>
          <div className="flex items-center gap-2 2xsm:gap-3">
            <StatusPill connection={status?.connection} />
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
