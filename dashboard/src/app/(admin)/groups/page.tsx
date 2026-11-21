"use client";

import { useFeedback } from "@/components/bot/feedback";
import { Avatar, EmptyState, Loading, PageTitle } from "@/components/bot/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkIcon, RegenerateIcon, SearchIcon, WhatsappIcon } from "@/icons";
import { api, useApi } from "@/lib/api";
import { fmtNum } from "@/lib/format";
import { Link } from "@/lib/navigation";
import { useMemo, useState } from "react";

type Group = { id: string; subject: string; size: number; announce: boolean; botAdmin: boolean; settings: any };

export default function GroupsPage() {
  const { data, setData } = useApi<{ connected: boolean; groups: Group[] }>("/api/groups");
  const [q, setQ] = useState("");
  const { toast, confirm } = useFeedback();
  const list = useMemo(() => (data?.groups || []).filter((g) => !q || g.subject.toLowerCase().includes(q.toLowerCase()) || g.id.includes(q)), [data, q]);

  const refresh = async () => {
    try {
      setData(await api("GET", "/api/groups?refresh=1"));
      toast("Daftar grup diperbarui");
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const join = async () => {
    const link = await confirm({ title: "Masuk grup lewat link", description: "Tempel link undangan grup WhatsApp.", confirm: "Masuk", input: { placeholder: "https://chat.whatsapp.com/..." } });
    if (!link || link === true) return;
    try {
      await api("POST", "/api/groups/join", { link });
      setData(await api("GET", "/api/groups?refresh=1"));
      toast("Bot bergabung ke grup");
    } catch (err) {
      toast((err as Error).message, true);
    }
  };

  if (!data) return <Loading />;

  return (
    <>
      <PageTitle
        title="Grup"
        description={`${fmtNum(data.groups.length)} grup diikuti bot`}
        actions={
          <>
            <Button variant="outline" onClick={join}><LinkIcon /> Masuk via link</Button>
            <Button variant="outline" onClick={refresh}><RegenerateIcon /> Muat ulang</Button>
          </>
        }
      />
      <div className="relative mb-6 max-w-md">
        <SearchIcon className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
        <Input className="ps-11" placeholder="Cari nama atau id grup..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {list.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {list.map((g) => (
            <Link
              key={g.id}
              href={`/groups/detail/?id=${encodeURIComponent(g.id)}`}
              className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-theme-md dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-500/40"
            >
              <div className="flex items-center gap-3">
                <Avatar name={g.subject} src={data.connected ? `/api/groups/${encodeURIComponent(g.id)}/picture` : null} size={48} square />
                <div className="min-w-0">
                  <div className="truncate font-semibold text-gray-800 group-hover:text-brand-500 dark:text-white/90">{g.subject}</div>
                  <div className="text-theme-sm text-gray-500 dark:text-gray-400">{fmtNum(g.size)} anggota</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge size="sm" color={g.botAdmin ? "success" : "gray"}>{g.botAdmin ? "Bot admin" : "Bot member"}</Badge>
                {g.settings?.botEnabled === false && <Badge size="sm" color="error">Bot mati</Badge>}
                {g.settings?.welcome && <Badge size="sm" color="info">Welcome</Badge>}
                {g.settings?.antilink && g.settings.antilink !== "off" && <Badge size="sm" color="warning">Antilink</Badge>}
                {g.settings?.nsfw && <Badge size="sm" color="dark">NSFW</Badge>}
                {g.announce && <Badge size="sm" color="light">Tertutup</Badge>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
          <EmptyState
            icon={<WhatsappIcon />}
            title={data.connected ? "Tidak ada grup" : "Bot belum terhubung"}
            text={data.connected ? "Bot belum bergabung ke grup mana pun, atau pencarian tidak cocok." : "Hubungkan WhatsApp di halaman Dashboard untuk melihat grup."}
          />
        </div>
      )}
    </>
  );
}
