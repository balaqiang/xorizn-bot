"use client";

import AreaChart from "@/components/bot/area-chart";
import ConnectCard from "@/components/bot/connect-card";
import { EmptyState, Loading, PageTitle, Section, SourceBadge, StatCard } from "@/components/bot/kit";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { AiIcon, AlertIcon, BoltIcon, ChatIcon, ClockIcon, PluginIcon, UserCircleIcon, WhatsappIcon } from "@/icons";
import { useApi, useEvent } from "@/lib/api";
import { fmtAgo, fmtBytes, fmtDur, fmtNum } from "@/lib/format";
import { Link } from "@/lib/navigation";
import { cn } from "@/utils";
import { useState } from "react";

type Overview = any;

export default function DashboardPage() {
  const { data: o, setData } = useApi<Overview>("/api/overview");
  const [range, setRange] = useState<7 | 14>(14);

  useEvent("command", (c) =>
    setData((prev: Overview) => (prev ? { ...prev, recent: [c, ...(prev.recent || [])].slice(0, 15), runtime: { ...prev.runtime, commands: prev.runtime.commands + 1 } } : prev)),
  );

  if (!o) return <Loading />;
  const src = o.counts.sources || {};
  const daily = o.daily.slice(-range);
  const maxTop = o.top[0]?.count || 1;

  return (
    <>
      <PageTitle title="Dashboard" description={`Ringkasan ${o.settings.botName} • mode ${o.settings.mode} • prefix ${o.settings.prefixes.join(" ")}`} />

      <div className="space-y-4 md:space-y-6">
        {o.dbError && (
          <Alert variant="destructive">
            <AlertIcon />
            <AlertTitle>Database utama gagal terhubung</AlertTitle>
            <AlertDescription>
              Sementara memakai JSON. {o.dbError} — <Link className="underline" href="/system">perbaiki di Sistem</Link>
            </AlertDescription>
          </Alert>
        )}
        {!o.settings.owners?.length && (
          <Alert variant="warning">
            <AlertIcon />
            <AlertTitle>Owner belum diatur</AlertTitle>
            <AlertDescription>
              Perintah owner tidak bisa dipakai siapa pun. <Link className="underline" href="/settings">Atur nomor owner</Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
          <StatCard icon={<WhatsappIcon />} title="Grup" value={fmtNum(o.counts.groups)} hint="diikuti bot" />
          <StatCard icon={<UserCircleIcon />} title="Pengguna" value={fmtNum(o.counts.users)} hint={`${fmtNum(o.counts.premium)} premium • ${fmtNum(o.counts.banned)} diblokir`} tone="info" />
          <StatCard icon={<PluginIcon />} title="Perintah aktif" value={fmtNum(o.counts.commands)} hint={`native ${src.native || 0} • vanXone ${src.vanxone || 0} • Rubby ${src.rubby || 0}`} tone="success" />
          <StatCard icon={<ClockIcon />} title="Uptime" value={fmtDur(o.uptime)} hint={`${fmtNum(o.runtime.messages)} pesan • ${fmtNum(o.runtime.commands)} perintah`} tone="warning" />
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 xl:col-span-8">
            <Section
              title="Statistik Pesan & Perintah"
              description="Aktivitas harian yang diproses bot."
              action={
                <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
                  {[7, 14].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r as 7 | 14)}
                      className={cn(
                        "rounded-md px-3 py-2 text-theme-sm font-medium",
                        range === r ? "bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white" : "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {r} hari
                    </button>
                  ))}
                </div>
              }
            >
              <div className="mb-2 flex gap-4 text-theme-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-brand-500" />Pesan</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#0BA5EC]" />Perintah</span>
              </div>
              <AreaChart
                categories={daily.map((d: any) => `${d.date.slice(8)}/${d.date.slice(5, 7)}`)}
                series={[
                  { name: "Pesan", data: daily.map((d: any) => d.messages) },
                  { name: "Perintah", data: daily.map((d: any) => d.commands) },
                ]}
              />
            </Section>
          </div>
          <div className="col-span-12 space-y-4 md:space-y-6 xl:col-span-4">
            <ConnectCard />
            <Section title="AI / OpenCode" action={<Badge color={o.opencode?.ok ? "success" : "gray"} size="sm">{o.opencode?.ok ? `v${o.opencode.version}` : "offline"}</Badge>}>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15"><AiIcon className="size-6" /></span>
                <div className="min-w-0 text-sm">
                  <div className="font-medium text-gray-800 dark:text-white/90">{o.opencode?.ok ? "Server OpenCode terhubung" : "Server OpenCode tidak terhubung"}</div>
                  <div className="truncate text-theme-xs text-gray-500">{o.opencode?.url}</div>
                </div>
              </div>
              <Link href="/ai" className="mt-4 inline-block text-theme-sm font-medium text-brand-500 hover:underline">Kelola AI →</Link>
            </Section>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 xl:col-span-5">
            <Section title="Perintah Terpopuler" description="Paling sering dipakai sejak bot dijalankan.">
              {o.top.length ? (
                <div className="space-y-4">
                  {o.top.map((t: any, i: number) => (
                    <div key={t.name} className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-theme-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="truncate font-mono font-medium text-gray-800 dark:text-white/90">{t.name}</span>
                          <span className="text-gray-500">{fmtNum(t.count)}×</span>
                        </div>
                        <div className="mt-1.5 h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                          <div className="h-2 rounded-full bg-brand-500" style={{ width: `${(t.count / maxTop) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={<BoltIcon />} title="Belum ada data" text="Statistik muncul setelah perintah dipakai." />
              )}
            </Section>
          </div>
          <div className="col-span-12 xl:col-span-7">
            <Section title="Aktivitas Terbaru" description="Perintah yang baru dijalankan (realtime)." bodyClassName="px-0 pb-2 sm:px-0">
              {o.recent.length ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                      <TableRow>
                        {["Perintah", "Sumber", "Pengirim", "Waktu", "Status"].map((h) => (
                          <TableCell key={h} isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 sm:px-6 dark:text-gray-400">{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {o.recent.slice(0, 8).map((c: any, i: number) => (
                        <TableRow key={`${c.time}-${i}`}>
                          <TableCell className="px-5 py-3 font-mono text-theme-sm text-gray-800 sm:px-6 dark:text-white/90">{c.name}</TableCell>
                          <TableCell className="px-5 py-3 sm:px-6"><SourceBadge source={c.source} /></TableCell>
                          <TableCell className="px-5 py-3 text-theme-sm text-gray-500 sm:px-6">+{c.sender}</TableCell>
                          <TableCell className="px-5 py-3 text-theme-sm text-gray-500 sm:px-6">{fmtAgo(c.time)}</TableCell>
                          <TableCell className="px-5 py-3 sm:px-6"><Badge color={c.ok ? "success" : "error"} size="sm">{c.ok ? "Berhasil" : "Gagal"} • {c.ms}ms</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState icon={<ChatIcon />} title="Menunggu perintah masuk" text="Aktivitas tampil otomatis saat ada yang memakai bot." />
              )}
            </Section>
          </div>
        </div>

        <Section title="Info Sistem">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-6">
            {[
              ["Database", `${o.database.driver}`],
              ["Kartu welcome", o.cardEngine],
              ["Bentrok nama", `${fmtNum(o.counts.conflicts)} perintah`],
              ["Node.js", o.system.node],
              ["RAM bot", fmtBytes(o.system.rss)],
              ["Sistem", o.system.platform],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-theme-xs text-gray-500 dark:text-gray-400">{k}</div>
                <div className="mt-1 text-sm font-semibold text-gray-800 dark:text-white/90">{v}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
