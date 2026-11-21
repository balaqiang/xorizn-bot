"use client";

import { useFeedback } from "@/components/bot/feedback";
import { Avatar, Chips, EmptyState, FormField, Loading, NativeSelect, Section, ToggleRow } from "@/components/bot/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftIcon, LinkIcon, LogOutIcon, PlusIcon, RegenerateIcon, SendIcon, TrashBinIcon, UsersIcon } from "@/icons";
import { api } from "@/lib/api";
import { fmtNum } from "@/lib/format";
import { Link, useRouter } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

export default function GroupDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <GroupDetail />
    </Suspense>
  );
}

function GroupDetail() {
  const id = useSearchParams().get("id") || "";
  const enc = encodeURIComponent(id);
  const router = useRouter();
  const { toast, confirm } = useFeedback();
  const [d, setD] = useState<any>(null);
  const [tab, setTab] = useState("general");

  const load = useCallback(async (refresh = false) => {
    try {
      setD(await api("GET", `/api/groups/${enc}${refresh ? "?refresh=1" : ""}`));
    } catch (err) {
      toast((err as Error).message, true);
    }
  }, [enc, toast]);
  useEffect(() => {
    if (id) load();
  }, [id, load]);

  const save = async (patch: Record<string, unknown>, silent = false) => {
    try {
      const r = await api("PATCH", `/api/groups/${enc}/settings`, patch);
      setD((prev: any) => ({ ...prev, settings: r.settings }));
      if (!silent) toast("Tersimpan");
    } catch (err) {
      toast((err as Error).message, true);
    }
  };

  if (!id) return <EmptyState title="Grup tidak dipilih" action={<Link href="/groups" className="text-brand-500">Kembali ke daftar grup</Link>} />;
  if (!d) return <Loading />;
  const st = d.settings;

  return (
    <>
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/groups/")} aria-label="Kembali"><ArrowLeftIcon /></Button>
          <Avatar name={d.summary.subject} src={`/api/groups/${enc}/picture`} size={64} square />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-semibold text-gray-800 dark:text-white/90">{d.summary.subject}</h2>
            <div className="truncate font-mono text-theme-xs text-gray-500">{id}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge size="sm" color="gray">{fmtNum(d.summary.size)} anggota</Badge>
              <Badge size="sm" color={d.summary.botAdmin ? "success" : "warning"}>{d.summary.botAdmin ? "Bot admin" : "Bot bukan admin"}</Badge>
              {d.meta?.announce && <Badge size="sm" color="info">Tertutup</Badge>}
            </div>
          </div>
        </div>
        {d.meta?.desc && <p className="mt-4 max-h-24 overflow-auto text-sm whitespace-pre-wrap text-gray-500 dark:text-gray-400">{d.meta.desc}</p>}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="welcome">Welcome & Goodbye</TabsTrigger>
          <TabsTrigger value="moderation">Moderasi</TabsTrigger>
          <TabsTrigger value="respon">Auto-respon</TabsTrigger>
          <TabsTrigger value="members">Anggota ({d.participants.length})</TabsTrigger>
          <TabsTrigger value="actions">Aksi</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
            <Section title="Perilaku bot">
              <ToggleRow title="Bot aktif di grup ini" description="Jika mati, hanya admin & owner yang bisa memakai bot" checked={st.botEnabled} onChange={(v) => save({ botEnabled: v })} />
              <ToggleRow title="Hanya admin" description="Anggota biasa tidak bisa memakai perintah" checked={st.onlyAdmin} onChange={(v) => save({ onlyAdmin: v })} />
              <ToggleRow title="Izinkan NSFW" description="Perintah kategori NSFW boleh dipakai" checked={st.nsfw} onChange={(v) => save({ nsfw: v })} />
              <ToggleRow title="Auto stiker" description="Gambar/video pendek otomatis dijadikan stiker" checked={st.autoSticker} onChange={(v) => save({ autoSticker: v })} />
              <ToggleRow title="Notifikasi admin" description="Umumkan saat ada promote / demote" checked={st.promoteNotify} onChange={(v) => save({ promoteNotify: v })} />
            </Section>
            <DisabledCommands st={st} save={save} />
          </div>
        </TabsContent>

        <TabsContent value="welcome">
          <WelcomeTab enc={enc} st={st} defaults={d.defaults} save={save} />
        </TabsContent>

        <TabsContent value="moderation">
          <Moderation st={st} save={save} />
        </TabsContent>

        <TabsContent value="respon">
          <AutoRespon list={st.autoResponses} save={(autoResponses) => save({ autoResponses })} />
        </TabsContent>

        <TabsContent value="members">
          <Members d={d} enc={enc} reload={() => load(true)} />
        </TabsContent>

        <TabsContent value="actions">
          <Actions d={d} enc={enc} reload={() => load(true)} onLeft={() => router.push("/groups/")} confirm={confirm} toast={toast} />
        </TabsContent>
      </Tabs>
    </>
  );
}

function DisabledCommands({ st, save }: { st: any; save: (p: any) => Promise<void> }) {
  const [v, setV] = useState("");
  return (
    <Section title="Perintah nonaktif di grup ini" description="Tidak bisa dipakai anggota (owner tetap bisa).">
      <Chips items={st.disabledCommands} empty="Tidak ada" onRemove={(c) => save({ disabledCommands: st.disabledCommands.filter((x: string) => x !== c) })} />
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const c = v.trim().toLowerCase().replace(/^[./!#]/, "");
          if (!c) return;
          save({ disabledCommands: [...new Set([...st.disabledCommands, c])] });
          setV("");
        }}
      >
        <Input placeholder="nama perintah, mis. tiktok" value={v} onChange={(e) => setV(e.target.value)} />
        <Button type="submit" variant="outline"><PlusIcon /> Tambah</Button>
      </form>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div><div className="text-theme-xs text-gray-500">Pesan tercatat</div><div className="font-semibold text-gray-800 dark:text-white/90">{fmtNum(st.stats?.messages)}</div></div>
        <div><div className="text-theme-xs text-gray-500">Perintah dipakai</div><div className="font-semibold text-gray-800 dark:text-white/90">{fmtNum(st.stats?.commands)}</div></div>
      </div>
    </Section>
  );
}

function WelcomeTab({ enc, st, defaults, save }: { enc: string; st: any; defaults: any; save: (p: any, s?: boolean) => Promise<void> }) {
  const { toast } = useFeedback();
  const [wText, setW] = useState(st.welcomeText);
  const [bText, setB] = useState(st.goodbyeText);
  const [bg, setBg] = useState(st.cardBackground);
  const [kind, setKind] = useState<"welcome" | "goodbye">("welcome");
  const [img, setImg] = useState<string | null>(null);
  const [focus, setFocus] = useState<"w" | "b">("w");

  const preview = useCallback(async () => {
    try {
      const blob = await api<Blob>("POST", `/api/groups/${enc}/preview/${kind}`, { background: bg });
      setImg((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
      toast((err as Error).message, true);
    }
  }, [enc, kind, bg, toast]);
  useEffect(() => {
    preview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const insert = (ph: string) => (focus === "w" ? setW((t: string) => t + ph) : setB((t: string) => t + ph));

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
      <Section title="Pengaturan">
        <ToggleRow title="Welcome" description="Sambutan saat anggota baru masuk" checked={st.welcome} onChange={(v) => save({ welcome: v })} />
        <ToggleRow title="Goodbye" description="Pesan saat anggota keluar" checked={st.goodbye} onChange={(v) => save({ goodbye: v })} />
        <ToggleRow title="Kartu gambar (discord-canvas)" description="Matikan untuk mengirim teks saja" checked={st.welcomeCard} onChange={(v) => save({ welcomeCard: v })} />
        <div className="mt-4 space-y-4">
          <FormField label="Teks welcome">
            <Textarea rows={3} placeholder={defaults.welcomeText} value={wText} onFocus={() => setFocus("w")} onChange={(e) => setW(e.target.value)} />
          </FormField>
          <FormField label="Teks goodbye" help="Kosongkan untuk memakai teks default dari Pengaturan Bot.">
            <Textarea rows={3} placeholder={defaults.goodbyeText} value={bText} onFocus={() => setFocus("b")} onChange={(e) => setB(e.target.value)} />
          </FormField>
          <div className="flex flex-wrap gap-2">
            {["@user", "@name", "@group", "@count", "@desc", "@number"].map((p) => (
              <button key={p} type="button" onClick={() => insert(p)} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-theme-xs text-gray-700 hover:border-brand-300 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300">
                {p}
              </button>
            ))}
          </div>
          <FormField label="Latar kartu (URL gambar 1024×450)">
            <Input value={bg} placeholder="https://... (kosong = default)" onChange={(e) => setBg(e.target.value)} onBlur={preview} />
          </FormField>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => save({ welcomeText: wText, goodbyeText: bText, cardBackground: bg.trim() }).then(preview)}>Simpan</Button>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await api("POST", `/api/groups/${enc}/test/${kind}`);
                  toast("Pesan tes dikirim ke grup");
                } catch (err) {
                  toast((err as Error).message, true);
                }
              }}
            >
              <SendIcon /> Kirim tes ke grup
            </Button>
          </div>
        </div>
      </Section>
      <Section
        title="Pratinjau kartu"
        description="Dibuat dengan discord-canvas memakai profil bot sebagai contoh."
        action={
          <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            {(["welcome", "goodbye"] as const).map((k) => (
              <button key={k} onClick={() => setKind(k)} className={`rounded-md px-3 py-2 text-theme-sm font-medium ${kind === k ? "bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white" : "text-gray-500"}`}>
                {k === "welcome" ? "Welcome" : "Goodbye"}
              </button>
            ))}
          </div>
        }
      >
        {img ? <img src={img} alt="Pratinjau kartu" className="w-full rounded-xl border border-gray-200 dark:border-gray-800" /> : <div className="aspect-[1024/450] animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />}
      </Section>
    </div>
  );
}

function Moderation({ st, save }: { st: any; save: (p: any) => Promise<void> }) {
  const [words, setWords] = useState("");
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
      <Section title="Anti-link" description="Admin grup tidak terkena. Bot harus admin untuk menghapus & mengeluarkan.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Mode">
            <NativeSelect value={st.antilink} onChange={(e) => save({ antilink: e.target.value })}>
              <option value="off">Mati</option>
              <option value="wa">Link grup/saluran WA</option>
              <option value="all">Semua link</option>
            </NativeSelect>
          </FormField>
          <FormField label="Aksi">
            <NativeSelect value={st.antilinkAction} onChange={(e) => save({ antilinkAction: e.target.value })}>
              <option value="delete">Hapus pesan</option>
              <option value="warn">Hapus + peringatan</option>
              <option value="kick">Keluarkan</option>
            </NativeSelect>
          </FormField>
          <FormField label="Batas peringatan">
            <Input type="number" min={1} max={20} defaultValue={st.warnLimit} onBlur={(e) => save({ warnLimit: Number(e.target.value) })} />
          </FormField>
        </div>
      </Section>
      <Section title="Anti kata kasar">
        <ToggleRow title="Aktifkan" description="Pesan berisi kata terlarang dihapus / diperingatkan" checked={st.antiBadword} onChange={(v) => save({ antiBadword: v })} />
        <div className="mt-4">
          <Chips items={st.badwords} empty="Belum ada kata" onRemove={(w) => save({ badwords: st.badwords.filter((x: string) => x !== w) })} />
        </div>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const list = words.split(",").map((w) => w.trim()).filter(Boolean);
            if (!list.length) return;
            save({ badwords: [...st.badwords, ...list] });
            setWords("");
          }}
        >
          <Input placeholder="kata1, kata2" value={words} onChange={(e) => setWords(e.target.value)} />
          <Button type="submit" variant="outline"><PlusIcon /> Tambah</Button>
        </form>
      </Section>
      <Section title="Peringatan aktif" className="xl:col-span-2">
        {Object.keys(st.warns || {}).length ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {Object.entries(st.warns).map(([n, c]) => (
              <div key={n} className="flex items-center gap-3 py-3">
                <span className="flex-1 font-mono text-sm text-gray-700 dark:text-gray-300">+{n}</span>
                <Badge color="warning" size="sm">{String(c)}/{st.warnLimit}</Badge>
                <Button variant="ghost" size="xs" onClick={() => { const w = { ...st.warns }; delete w[n]; save({ warns: w }); }}>Reset</Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Tidak ada anggota dengan peringatan.</p>
        )}
      </Section>
    </div>
  );
}

function AutoRespon({ list, save }: { list: any[]; save: (l: any[]) => Promise<void> }) {
  const [trigger, setTrigger] = useState("");
  const [response, setResponse] = useState("");
  const [exact, setExact] = useState(true);
  return (
    <Section title="Auto-respon grup" description="Bot membalas otomatis saat pesan cocok dengan kata kunci. Placeholder: @user @name">
      {list.length ? (
        <div className="mb-6 divide-y divide-gray-100 dark:divide-gray-800">
          {list.map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <Badge size="sm" color={r.exact ? "gray" : "info"}>{r.exact ? "sama persis" : "mengandung"}</Badge>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-sm font-medium text-gray-800 dark:text-white/90">{r.trigger}</div>
                <div className="truncate text-theme-sm text-gray-500">{r.response}</div>
              </div>
              <Button variant="ghost" size="icon-sm" aria-label="Hapus" onClick={() => save(list.filter((_, j) => j !== i))}><TrashBinIcon /></Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-6 text-sm text-gray-500">Belum ada auto-respon.</p>
      )}
      <form
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          const t = trigger.trim().toLowerCase();
          if (!t || !response.trim()) return;
          save([...list.filter((r) => r.trigger !== t), { trigger: t, response, exact }]);
          setTrigger("");
          setResponse("");
        }}
      >
        <FormField label="Kata kunci"><Input value={trigger} onChange={(e) => setTrigger(e.target.value)} required /></FormField>
        <FormField label="Cocok jika">
          <label className="flex h-11 items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <Switch checked={exact} onCheckedChange={(v) => setExact(!!v)} /> {exact ? "Sama persis" : "Mengandung kata"}
          </label>
        </FormField>
        <FormField label="Balasan" className="sm:col-span-2"><Textarea rows={3} value={response} onChange={(e) => setResponse(e.target.value)} required /></FormField>
        <div><Button type="submit"><PlusIcon /> Tambah</Button></div>
      </form>
    </Section>
  );
}

function Members({ d, enc, reload }: { d: any; enc: string; reload: () => Promise<void> }) {
  const { toast, confirm } = useFeedback();
  const [q, setQ] = useState("");
  const rows = d.participants
    .filter((p: any) => !q || p.number.includes(q) || String(p.name).toLowerCase().includes(q.toLowerCase()))
    .sort((a: any, b: any) => (b.admin ? 1 : 0) - (a.admin ? 1 : 0));
  const act = async (action: string, participant: string) => {
    if (action === "remove" && !(await confirm({ title: "Keluarkan anggota?", confirm: "Keluarkan", danger: true }))) return;
    try {
      await api("POST", `/api/groups/${enc}/action`, { action, participant });
      await reload();
      toast("Berhasil");
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  if (!d.participants.length) return <Section><EmptyState icon={<UsersIcon />} title="Data anggota belum tersedia" text="Bot belum terhubung ke WhatsApp." /></Section>;
  return (
    <Section bodyClassName="p-0 sm:p-0">
      <div className="p-5 sm:p-6">
        <Input className="max-w-sm" placeholder="Cari nomor / nama..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              {["Anggota", "Status", "Peringatan", ""].map((h) => (
                <TableCell key={h} isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 sm:px-6">{h}</TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {rows.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="px-5 py-3 sm:px-6">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name || p.number} size={36} />
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-white/90">{p.name || "-"}</div>
                      <div className="font-mono text-theme-xs text-gray-500">+{p.number}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-3 sm:px-6">
                  <Badge size="sm" color={p.admin === "superadmin" ? "warning" : p.admin ? "success" : "gray"}>{p.admin === "superadmin" ? "Pembuat" : p.admin ? "Admin" : "Anggota"}</Badge>
                </TableCell>
                <TableCell className="px-5 py-3 text-sm sm:px-6">{p.warns ? <Badge size="sm" color="warning">{p.warns}</Badge> : "-"}</TableCell>
                <TableCell className="px-5 py-3 text-end whitespace-nowrap sm:px-6">
                  {d.summary.botAdmin && p.admin !== "superadmin" && (
                    <div className="flex justify-end gap-2">
                      <Button size="xs" variant="outline" onClick={() => act(p.admin ? "demote" : "promote", p.id)}>{p.admin ? "Copot admin" : "Jadikan admin"}</Button>
                      <Button size="xs" variant="outline" className="text-red-600" onClick={() => act("remove", p.id)}>Keluarkan</Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}

function Actions({ d, enc, reload, onLeft, confirm, toast }: any) {
  const [text, setText] = useState("");
  const [hidetag, setHidetag] = useState(false);
  const [invite, setInvite] = useState("");
  const run = async (action: string) => {
    if (action === "leave" && !(await confirm({ title: "Keluarkan bot dari grup?", description: `Bot akan keluar dari ${d.summary.subject}. Untuk masuk lagi butuh link undangan.`, confirm: "Keluar", danger: true }))) return;
    try {
      const r = await api("POST", `/api/groups/${enc}/action`, { action });
      if (action === "invite") setInvite(r.link);
      else if (action === "leave") {
        toast("Bot keluar dari grup");
        onLeft();
      } else {
        await reload();
        toast("Berhasil");
      }
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
      <Section title="Kirim pesan">
        <Textarea rows={4} placeholder="Tulis pesan untuk grup ini..." value={text} onChange={(e) => setText(e.target.value)} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><Switch checked={hidetag} onCheckedChange={(v) => setHidetag(!!v)} /> Hidetag (tag semua diam-diam)</label>
          <Button
            onClick={async () => {
              try {
                await api("POST", `/api/groups/${enc}/message`, { text, hidetag });
                setText("");
                toast("Pesan terkirim");
              } catch (err) {
                toast((err as Error).message, true);
              }
            }}
          >
            <SendIcon /> Kirim
          </Button>
        </div>
      </Section>
      <Section title="Kelola grup">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => run("open")}>Buka grup</Button>
          <Button variant="outline" onClick={() => run("close")}>Tutup grup</Button>
          <Button variant="outline" onClick={() => run("invite")}><LinkIcon /> Link undangan</Button>
          <Button variant="outline" onClick={() => run("refresh")}><RegenerateIcon /> Segarkan</Button>
        </div>
        {invite && <a href={invite} target="_blank" rel="noopener" className="mt-4 block font-mono text-sm text-brand-500">{invite}</a>}
        <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
          <Button variant="destructive" onClick={() => run("leave")}><LogOutIcon /> Keluarkan bot dari grup</Button>
        </div>
      </Section>
    </div>
  );
}
