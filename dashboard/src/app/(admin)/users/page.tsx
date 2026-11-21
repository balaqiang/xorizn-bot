"use client";

import { useFeedback } from "@/components/bot/feedback";
import { Avatar, EmptyState, Loading, PageTitle } from "@/components/bot/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, SearchIcon, UserCircleIcon } from "@/icons";
import { api } from "@/lib/api";
import { fmtAgo, fmtNum } from "@/lib/format";
import { cn } from "@/utils";
import { useCallback, useEffect, useState } from "react";

type U = { id: string; number: string; name: string; premium: boolean; premiumTime: number; banned: boolean; banReason: string; owner: boolean; commands: number; lastSeen: number };

export default function UsersPage() {
  const { toast, confirm } = useFeedback();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [d, setD] = useState<{ total: number; page: number; pages: number; users: U[] } | null>(null);

  const load = useCallback(async () => {
    try {
      setD(await api("GET", `/api/users?q=${encodeURIComponent(q)}&filter=${filter}&page=${page}`));
    } catch (err) {
      toast((err as Error).message, true);
    }
  }, [q, filter, page, toast]);
  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [load]);

  const patch = async (u: U, body: Record<string, unknown>) => {
    try {
      await api("PATCH", `/api/users/${encodeURIComponent(u.id)}`, body);
      toast("Tersimpan");
      load();
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const premium = async (u: U) => {
    if (u.premium) return patch(u, { premium: false });
    const days = await confirm({ title: "Jadikan premium", description: "Durasi dalam hari (0 = permanen).", confirm: "Simpan", input: { type: "number", defaultValue: "30" } });
    if (days === false) return;
    patch(u, { premium: true, days: Number(days) || 0 });
  };
  const ban = async (u: U) => {
    if (u.banned) return patch(u, { banned: false });
    const reason = await confirm({ title: "Blokir pengguna dari bot?", description: "Alasan (opsional).", confirm: "Blokir", danger: true, input: { placeholder: "spam, dll." } });
    if (reason === false) return;
    patch(u, { banned: true, banReason: reason === true ? "" : reason });
  };
  const owner = async (u: U) => {
    if (!u.owner && !(await confirm({ title: "Jadikan owner?", description: "Owner bisa memakai semua perintah, termasuk eval/exec dan OpenCode.", confirm: "Jadikan owner", danger: true }))) return;
    patch(u, { owner: !u.owner });
  };
  const addPremium = async () => {
    const num = await confirm({ title: "Tambah pengguna premium", description: "Nomor WhatsApp dengan kode negara. Premium 30 hari.", confirm: "Tambah", input: { placeholder: "628xxx" } });
    if (!num || num === true) return;
    try {
      await api("PATCH", `/api/users/${encodeURIComponent(String(num).replace(/\D/g, ""))}`, { premium: true, days: 30 });
      toast("Premium 30 hari ditambahkan");
      load();
    } catch (err) {
      toast((err as Error).message, true);
    }
  };

  return (
    <>
      <PageTitle title="Pengguna" description="Pengguna tercatat otomatis saat mengirim pesan ke bot." actions={<Button onClick={addPremium}><PlusIcon /> Tambah premium</Button>} />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="flex flex-wrap items-center gap-3 p-5 sm:p-6">
          <div className="relative min-w-60 flex-1">
            <SearchIcon className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
            <Input className="ps-11" placeholder="Cari nomor atau nama..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          </div>
          <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            {[["", "Semua"], ["premium", "Premium"], ["owner", "Owner"], ["banned", "Diblokir"]].map(([k, v]) => (
              <button key={k} onClick={() => { setFilter(k); setPage(1); }} className={cn("rounded-md px-3 py-2 text-theme-sm font-medium", filter === k ? "bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white" : "text-gray-500")}>
                {v}
              </button>
            ))}
          </div>
        </div>
        {!d ? (
          <Loading />
        ) : d.users.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                <TableRow>
                  {["Pengguna", "Status", "Perintah", "Terakhir aktif", ""].map((h) => (
                    <TableCell key={h} isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 sm:px-6">{h}</TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {d.users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="px-5 py-3 sm:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name || u.number} size={40} />
                        <div>
                          <div className="text-sm font-medium text-gray-800 dark:text-white/90">{u.name || "-"}</div>
                          <div className="font-mono text-theme-xs text-gray-500">{u.id.endsWith("@lid") ? "LID " : "+"}{u.number}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3 sm:px-6">
                      <div className="flex flex-wrap gap-1">
                        {u.owner && <Badge size="sm" color="warning">Owner</Badge>}
                        {u.premium && <Badge size="sm" color="primary">Premium{u.premiumTime ? ` • ${new Date(u.premiumTime).toLocaleDateString("id-ID")}` : ""}</Badge>}
                        {u.banned && <Badge size="sm" color="error" title={u.banReason}>Diblokir</Badge>}
                        {!u.owner && !u.premium && !u.banned && <Badge size="sm" color="gray">Free</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-theme-sm text-gray-500 sm:px-6">{fmtNum(u.commands)}</TableCell>
                    <TableCell className="px-5 py-3 text-theme-sm text-gray-500 sm:px-6">{fmtAgo(u.lastSeen)}</TableCell>
                    <TableCell className="px-5 py-3 whitespace-nowrap sm:px-6">
                      <div className="flex justify-end gap-2">
                        <Button size="xs" variant="outline" onClick={() => premium(u)}>{u.premium ? "Cabut premium" : "Premium"}</Button>
                        <Button size="xs" variant="outline" className={u.banned ? "" : "text-red-600"} onClick={() => ban(u)}>{u.banned ? "Buka blokir" : "Blokir"}</Button>
                        <Button size="xs" variant="ghost" onClick={() => owner(u)}>{u.owner ? "Hapus owner" : "Owner"}</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end gap-3 p-5 text-theme-sm text-gray-500">
              <span>Hal {d.page}/{d.pages} • {fmtNum(d.total)} pengguna</span>
              <Button size="xs" variant="outline" disabled={d.page <= 1} onClick={() => setPage((p) => p - 1)}>‹</Button>
              <Button size="xs" variant="outline" disabled={d.page >= d.pages} onClick={() => setPage((p) => p + 1)}>›</Button>
            </div>
          </div>
        ) : (
          <EmptyState icon={<UserCircleIcon />} title="Belum ada pengguna" text="Pengguna tercatat otomatis saat mengirim pesan ke bot." />
        )}
      </div>
    </>
  );
}
