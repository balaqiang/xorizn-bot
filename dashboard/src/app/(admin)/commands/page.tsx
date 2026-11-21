"use client";

import { useFeedback } from "@/components/bot/feedback";
import { EmptyState, Loading, NativeSelect, PageTitle, SourceBadge, StatCard } from "@/components/bot/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { AlertIcon, BoxIcon, PluginIcon, RegenerateIcon, SearchIcon, ShootingStarIcon } from "@/icons";
import { api, useApi } from "@/lib/api";
import { fmtNum } from "@/lib/format";
import { cn } from "@/utils";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

type Row = { id: string; name: string; aliases: string[]; category: string; source: string; description: string; usage: string; flags: any; active: boolean; providers: string[]; disabled: boolean; uses: number };

export default function CommandsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Commands />
    </Suspense>
  );
}

function Commands() {
  const initialQ = useSearchParams().get("q") || "";
  const { data, setData } = useApi<{ commands: Row[]; counts: Record<string, number> }>("/api/commands");
  const { toast } = useFeedback();
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState("");
  const [src, setSrc] = useState("");
  const [only, setOnly] = useState("");
  const [limit, setLimit] = useState(100);

  const cats = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of data?.commands || []) if (c.active) m[c.category] = (m[c.category] || 0) + 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [data]);

  const rows = useMemo(() => {
    let r = data?.commands || [];
    r = src ? r.filter((c) => c.source === src) : r.filter((c) => c.active || only === "conflict");
    if (cat) r = r.filter((c) => c.category === cat);
    if (only === "disabled") r = r.filter((c) => c.disabled);
    if (only === "conflict") r = r.filter((c) => c.providers.length > 1);
    const s = q.toLowerCase().trim();
    if (s) r = r.filter((c) => c.name.includes(s) || c.aliases.some((a) => a.includes(s)) || c.description.toLowerCase().includes(s));
    return r;
  }, [data, q, cat, src, only]);

  if (!data) return <Loading />;
  const c = data.counts;
  const activeSource = (name: string) => data.commands.find((x) => x.name === name && x.active)?.source;

  const toggle = async (row: Row, enabled: boolean) => {
    try {
      await api("PATCH", `/api/commands/${encodeURIComponent(row.name)}`, { disabled: !enabled });
      setData({ ...data, commands: data.commands.map((x) => (x.name === row.name && x.active ? { ...x, disabled: !enabled } : x)) });
      toast(`${row.name} ${enabled ? "diaktifkan" : "dinonaktifkan"}`);
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const setProvider = async (name: string, provider: string) => {
    try {
      await api("PATCH", `/api/commands/${encodeURIComponent(name)}`, { provider });
      setData(await api("GET", "/api/commands"));
      toast(`${name} → ${provider}`);
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const reload = async () => {
    try {
      const r = await api("POST", "/api/commands/reload");
      setData(await api("GET", "/api/commands"));
      toast(`Dimuat ulang: ${r.total} perintah aktif`);
    } catch (err) {
      toast((err as Error).message, true);
    }
  };

  return (
    <>
      <PageTitle title="Modul & Perintah" description="Aktifkan/nonaktifkan perintah dan pilih sumber bila nama bentrok." actions={<Button variant="outline" onClick={reload}><RegenerateIcon /> Muat ulang plugin</Button>} />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        <StatCard icon={<ShootingStarIcon />} title="Native" value={fmtNum(c.native)} hint="plugins/core" />
        <StatCard icon={<BoxIcon />} title="vanXone" value={fmtNum(c.vanxone)} hint="plugins/<kategori> • engine/" tone="info" />
        <StatCard icon={<PluginIcon />} title="Rubby-MD" value={fmtNum(c.rubby)} hint="plugins/rubby" tone="warning" />
        <StatCard icon={<AlertIcon />} title="Bentrok nama" value={fmtNum(data.commands.filter((x) => x.active && x.providers.length > 1).length)} hint="pilih sumbernya di tabel" tone="error" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-60 flex-1">
              <SearchIcon className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <Input className="ps-11" placeholder="Cari perintah, alias, deskripsi..." value={q} onChange={(e) => { setQ(e.target.value); setLimit(100); }} />
            </div>
            <NativeSelect className="w-auto" value={src} onChange={(e) => setSrc(e.target.value)}>
              <option value="">Semua sumber (aktif)</option>
              <option value="native">Native</option>
              <option value="vanxone">vanXone</option>
              <option value="rubby">Rubby</option>
            </NativeSelect>
            <NativeSelect className="w-auto" value={only} onChange={(e) => setOnly(e.target.value)}>
              <option value="">Semua status</option>
              <option value="disabled">Nonaktif</option>
              <option value="conflict">Bentrok nama</option>
            </NativeSelect>
          </div>
          <div className="flex flex-wrap gap-2">
            {[["", "Semua", rows.length] as const, ...cats.map(([k, n]) => [k, k, n] as const)].map(([k, label, n]) => (
              <button
                key={k || "all"}
                onClick={() => setCat(k)}
                className={cn(
                  "rounded-full border px-3 py-1 text-theme-sm font-medium",
                  cat === k ? "border-brand-300 bg-brand-50 text-brand-600 dark:border-brand-500/40 dark:bg-brand-500/15 dark:text-brand-400" : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-800 dark:text-gray-400",
                )}
              >
                {label} {k && <span className="text-gray-400">{n}</span>}
              </button>
            ))}
          </div>
          <p className="text-theme-sm text-gray-500">{fmtNum(rows.length)} perintah</p>
        </div>
        {rows.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                <TableRow>
                  {["Perintah", "Deskripsi", "Kategori", "Sumber", "Akses", "Dipakai", "Aktif"].map((h) => (
                    <TableCell key={h} isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 sm:px-6">{h}</TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {rows.slice(0, limit).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="px-5 py-3 sm:px-6">
                      <div className="font-mono text-sm font-medium text-gray-800 dark:text-white/90">{row.name}</div>
                      {row.aliases.length > 0 && <div className="max-w-56 truncate text-theme-xs text-gray-400">{row.aliases.slice(0, 6).join(", ")}</div>}
                    </TableCell>
                    <TableCell className="max-w-96 px-5 py-3 text-theme-sm text-gray-500 sm:px-6">
                      {row.description || "-"}
                      {row.usage && <div className="font-mono text-theme-xs text-gray-400">{row.usage}</div>}
                    </TableCell>
                    <TableCell className="px-5 py-3 sm:px-6"><Badge size="sm" color="gray">{row.category}</Badge></TableCell>
                    <TableCell className="px-5 py-3 sm:px-6">
                      {row.providers.length > 1 ? (
                        <NativeSelect className="h-9 w-auto text-theme-sm" value={activeSource(row.name) || row.source} onChange={(e) => setProvider(row.name, e.target.value)}>
                          {row.providers.map((p) => <option key={p}>{p}</option>)}
                        </NativeSelect>
                      ) : (
                        <SourceBadge source={row.source} />
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-3 whitespace-nowrap sm:px-6">
                      <div className="flex gap-1">
                        {row.flags.owner && <Badge size="sm" color="warning">owner</Badge>}
                        {row.flags.premium && <Badge size="sm" color="primary">premium</Badge>}
                        {row.flags.admin && <Badge size="sm" color="success">admin</Badge>}
                        {row.flags.group && !row.flags.admin && <Badge size="sm" color="gray">grup</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-theme-sm text-gray-500 sm:px-6">{fmtNum(row.uses)}</TableCell>
                    <TableCell className="px-5 py-3 sm:px-6">
                      <Switch size="sm" checked={!row.disabled} onCheckedChange={(v) => toggle(row, !!v)} aria-label={`Aktifkan ${row.name}`} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {rows.length > limit && (
              <div className="p-5 text-center">
                <Button variant="outline" onClick={() => setLimit((l) => l + 200)}>Tampilkan lebih banyak ({fmtNum(rows.length - limit)} lagi)</Button>
              </div>
            )}
          </div>
        ) : (
          <EmptyState icon={<PluginIcon />} title="Tidak ada perintah" text="Ubah filter atau kata pencarian." />
        )}
      </div>
    </>
  );
}
