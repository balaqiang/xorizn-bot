"use client";

import { BotProvider } from "@/components/bot/bot-context";
import { Loading } from "@/components/bot/kit";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "@/layout/app-layout/header";
import AppSidebar from "@/layout/app-layout/sidebar";
import { api } from "@/lib/api";
import { useRouter } from "@/lib/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api<{ authenticated: boolean }>("GET", "/api/session")
      .then((s) => (s.authenticated ? setReady(true) : router.replace("/login/")))
      .catch(() => router.replace("/login/"));
  }, [router]);

  if (!ready) return <Loading />;

  return (
    <BotProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <div className="mx-auto w-full max-w-(--breakpoint-2xl) p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </BotProvider>
  );
}
