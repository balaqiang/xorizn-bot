"use client";
/** Dropdown "Aktivitas": perintah yang baru dijalankan (realtime lewat SSE). */
import { SourceBadge } from "@/components/bot/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BellIcon, DotIcon, XIcon } from "@/icons";
import { api, useEvent } from "@/lib/api";
import { fmtAgo } from "@/lib/format";
import { useTranslations } from "@/lib/intl";
import { Link } from "@/lib/navigation";
import { cn } from "@/utils";
import { Fragment, useEffect, useState } from "react";

type Cmd = { name: string; source: string; sender: string; chat: string; ok: boolean; ms: number; time: number };

export default function NotificationDropdown() {
  const t = useTranslations("header.notifications");
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [items, setItems] = useState<Cmd[]>([]);

  useEffect(() => {
    api("GET", "/api/overview").then((o) => setItems(o.recent || [])).catch(() => {});
  }, []);
  useEvent("command", (c: Cmd) => {
    setItems((list) => [c, ...list].slice(0, 30));
    if (!isOpen) setNotifying(true);
  });

  return (
    <DropdownMenu open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (o) setNotifying(false); }}>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon-lg" className="relative" aria-label="Aktivitas">
            <span className={cn("absolute inset-e-0 -top-0.5 z-10 h-2 w-2 translate-x-1/2 rounded-full bg-orange-400", !notifying ? "hidden" : "flex")}>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
            </span>
            <BellIcon className="size-auto!" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" sideOffset={12} className="w-87.5 overflow-hidden p-3 sm:w-90.25 dark:bg-[#1E2635]">
        <div className="flex items-center justify-between pb-3">
          <h5 className="text-title-sm font-semibold text-gray-800 dark:text-gray-200">{t("title")}</h5>
          <Button variant="ghost" size="icon-xs" onClick={() => setIsOpen(false)} aria-label="Tutup">
            <XIcon className="size-5" />
          </Button>
        </div>
        <DropdownMenuSeparator className="my-0" />
        <ScrollArea className="h-96">
          <div className="flex flex-col pe-2">
            {!items.length && <p className="p-6 text-center text-sm text-gray-500">Belum ada perintah yang dijalankan.</p>}
            {items.map((c, i) => (
              <Fragment key={`${c.time}-${i}`}>
                <DropdownMenuItem className="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-white/5">
                  <Badge color={c.ok ? "success" : "error"} size="sm">{c.ok ? "OK" : "ERR"}</Badge>
                  <span className="block flex-1 text-start">
                    <span className="mb-1 block text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-white/90">+{c.sender}</span> menjalankan{" "}
                      <span className="font-mono font-medium text-gray-800 dark:text-white/90">{c.name}</span>
                    </span>
                    <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <SourceBadge source={c.source} />
                      <DotIcon className="size-2 text-gray-400" />
                      <span>{c.ms} ms</span>
                      <DotIcon className="size-2 text-gray-400" />
                      <span>{fmtAgo(c.time)}</span>
                    </span>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-0.5 bg-gray-100 last-of-type:hidden dark:bg-gray-700" />
              </Fragment>
            ))}
          </div>
        </ScrollArea>
        <Button variant="outline" nativeButton={false} className="mt-3 w-full" render={<Link href="/logs" />}>
          {t("viewAll")}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
