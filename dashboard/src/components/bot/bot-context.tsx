"use client";
/** Status bot global (koneksi WhatsApp, nama bot, jumlah grup) yang dibagi semua halaman. */
import { api, useEvent } from "@/lib/api";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type BotStatus = {
  connection: string;
  qr: string | null;
  pairingCode: string | null;
  pairingNumber?: string;
  me: { id: string; lid?: string; name?: string } | null;
  lastDisconnect?: { code?: number; reason?: string; at?: number } | null;
  since: number;
};

type Ctx = { status: BotStatus | null; botName: string; groups: number; refresh: () => void };
const BotContext = createContext<Ctx>({ status: null, botName: "Bitch Bot", groups: 0, refresh: () => {} });

export function BotProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [botName, setBotName] = useState("Bitch Bot");
  const [groups, setGroups] = useState(0);
  const refresh = useCallback(() => {
    api("GET", "/api/overview")
      .then((o) => {
        setStatus(o.status);
        setBotName(o.settings.botName);
        setGroups(o.counts.groups);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  useEvent("status", (s) => setStatus(s));
  useEvent("groups", () => refresh());
  return <BotContext.Provider value={{ status, botName, groups, refresh }}>{children}</BotContext.Provider>;
}

export const useBot = () => useContext(BotContext);
