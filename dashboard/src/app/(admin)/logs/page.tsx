"use client";

import { PageTitle } from "@/components/bot/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/icons";
import { api, useEvent } from "@/lib/api";
import { cn } from "@/utils";
import { useEffect, useMemo, useRef, useState } from "react";

type Entry = { time: number; level: string; scope: string; message: string };
const LEVELS = ["", "info", "success", "warn", "error", "cmd"];
const color: Record<string, string> = {
  info: "text-sky-500", success: "text-green-500", warn: "text-amber-500", error: "text-red-500", debug: "text-gray-400", cmd: "text-brand-500", chat: "text-teal-500",
};

export default function LogsPage() {
  const [all, setAll] = useState<Entry[]>([]);
  const [level, setLevel] = useState("");
  const [q, setQ] = useState("");
  const [paused, setPaused] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    api<Entry[]>("GET", "/api/logs?limit=500").then(setAll).catch(() => {});
  }, []);
  useEvent("log", (e: Entry) => {
    if (pausedRef.current) return;
    setAll((list) => [...list.slice(-1500), e]);
  });

  const shown = useMemo(() => all.filter((e) => (!level || e.level === level) && (!q || e.message.toLowerCase().includes(q.toLowerCase()) || e.scope.includes(q))).slice(-800), [all, level, q]);
  useEffect(() => {
    const el = box.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 120) el.scrollTop = el.scrollHeight;
  }, [shown]);

  return (
    <>
      <PageTitle
        title="Log"
        description="Log bot secara realtime."
        actions={
          <>
            <Button variant="outline" onClick={() => setPaused((p) => !p)}>{paused ? "Lanjut" : "Jeda"}</Button>
            <Button variant="outline" onClick={() => setAll([])}>Bersihkan</Button>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <SearchIcon className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <Input className="ps-11" placeholder="Filter teks / scope..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
          {LEVELS.map((l) => (
            <button key={l || "all"} onClick={() => setLevel(l)} className={cn("rounded-md px-3 py-2 text-theme-sm font-medium", level === l ? "bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white" : "text-gray-500")}>
              {l || "Semua"}
            </button>
          ))}
        </div>
      </div>
      <div ref={box} className="h-[calc(100vh-280px)] min-h-96 overflow-auto rounded-2xl border border-gray-200 bg-gray-950 py-3 font-mono text-[12.5px] text-gray-300 dark:border-gray-800">
        {shown.map((e, i) => (
          <div key={i} className="grid grid-cols-[72px_64px_96px_1fr] gap-2 px-4 py-0.5 break-words whitespace-pre-wrap hover:bg-white/5">
            <span className="text-gray-500">{new Date(e.time).toLocaleTimeString("id-ID", { hour12: false })}</span>
            <span className={cn("uppercase", color[e.level])}>{e.level}</span>
            <span className="truncate text-gray-500">[{e.scope}]</span>
            <span>{e.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
