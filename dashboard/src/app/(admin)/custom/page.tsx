"use client";

import { useFeedback } from "@/components/bot/feedback";
import { Chips, EmptyState, FormField, Loading, NativeSelect, PageTitle, Section } from "@/components/bot/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CodeIcon, PlusIcon, TrashBinIcon } from "@/icons";
import { api, useApi } from "@/lib/api";
import { useState } from "react";

type Step = Record<string, any> & { type: string };
type Cmd = { name: string; aliases: string[]; description: string; usage: string; category: string; enabled: boolean; cooldown: number; flags: Record<string, any>; steps: Step[]; override?: boolean; uses?: number; lastUsed?: number; lastError?: { at: number; message: string; step: number } | null };
type Data = { commands: Cmd[]; secrets: { name: string; updatedAt: number }[]; allowHosts: string[]; limits: Record<string, number> };
type TestResult = { ok: boolean; replies: any[]; trace: { step: number; type: string; ms: number; ok: boolean; info: string }[]; error?: string };

const STEP_LABEL: Record<string, string> = {
  http: "🌐 Panggil API (HTTP)",
  pick: "🎯 Ambil data (path)",
  set: "📝 Simpan teks / variabel",
  random: "🎲 Pilih acak dari daftar",
  check: "✅ Cek syarat",
  reply: "💬 Balas",
  react: "😀 Reaksi",
  ai: "🤖 Tanya AI",
  delay: "⏱️ Jeda",
  stop: "⏹️ Selesai",
};
const NEW_STEP: Record<string, Step> = {
  http: { type: "http", method: "GET", url: "https://", headers: {}, query: {}, body: "", bodyType: "json", responseType: "auto", timeout: 15, save: "res", failText: "" },
  pick: { type: "pick", path: "res.", save: "hasil", required: true, failText: "Data tidak ditemukan." },
  set: { type: "set", save: "teks", value: "" },
  random: { type: "random", items: ["pilihan 1", "pilihan 2"], save: "acak" },
  check: { type: "check", path: "res.", op: "exists", value: "", failText: "Tidak ada hasil." },
  reply: { type: "reply", kind: "text", text: "Halo {{sender.name}}!", url: "", fileName: "" },
  react: { type: "react", emoji: "✅" },
  ai: { type: "ai", prompt: "Jawab singkat: {{text}}", save: "ai" },
  delay: { type: "delay", seconds: 1 },
  stop: { type: "stop", text: "" },
};
const EMPTY: Cmd = { name: "", aliases: [], description: "", usage: "", category: "custom", enabled: true, cooldown: 0, flags: { limit: 0 }, steps: [NEW_STEP.reply] };
const PRESETS: { label: string; cmd: Cmd }[] = [
  { label: "Balasan teks", cmd: { ...EMPTY, name: "rules", description: "Aturan grup", steps: [{ type: "reply", kind: "text", text: "📜 Aturan grup:\n1. Dilarang spam\n2. Sopan ya {{sender.name}}" }] } },
  {
    label: "Gambar acak dari API",
    cmd: {
      ...EMPTY, name: "kucing", description: "Gambar kucing acak", flags: { limit: 1 },
      steps: [
        { ...NEW_STEP.http, url: "https://api.thecatapi.com/v1/images/search?limit=5" },
        { ...NEW_STEP.pick, path: "res.random.url", save: "img", failText: "Gambar tidak ditemukan." },
        { type: "reply", kind: "image", url: "{{img}}", text: "🐱 Nih {{sender.name}}", fileName: "" },
      ],
    },
  },
  {
    label: "Kirim ke n8n & balas",
    cmd: {
      ...EMPTY, name: "tanyan8n", description: "Teruskan ke workflow n8n",
      steps: [
        { ...NEW_STEP.http, method: "POST", url: "http://localhost:5678/webhook/xorizn", body: { text: "{{text}}", sender: "{{sender.number}}", name: "{{sender.name}}" } },
        { type: "reply", kind: "text", text: "{{res.reply | default:Workflow tidak membalas.}}", url: "", fileName: "" },
      ],
    },
  },
];

const parseJsonField = (s: string, fallback: any) => {
  if (!s.trim()) return fallback;
  return JSON.parse(s);
};

function StepEditor({ step, onChange, secrets }: { step: Step; onChange: (s: Step) => void; secrets: string[] }) {
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange({ ...step, [k]: e.target.value });
  const [jsonErr, setJsonErr] = useState<string | null>(null);
  const jsonField = (k: string, label: string, help?: string) => (
    <FormField label={label} help={jsonErr && jsonErr.startsWith(k) ? <span className="text-red-500">{jsonErr.slice(k.length + 1)}</span> : help} className="sm:col-span-2">
      <Textarea
        rows={3}
        className="font-mono text-xs"
        defaultValue={typeof step[k] === "string" ? step[k] : JSON.stringify(step[k] ?? {}, null, 2)}
        onBlur={(e) => {
          try {
            const v = e.target.value.trim();
            onChange({ ...step, [k]: k === "body" && v && !/^[[{]/.test(v) ? v : parseJsonField(v, k === "body" ? "" : {}) });
            setJsonErr(null);
          } catch {
            setJsonErr(`${k}:JSON tidak valid`);
          }
        }}
      />
    </FormField>
  );
  switch (step.type) {
    case "http":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <FormField label="Method"><NativeSelect value={step.method} onChange={set("method")}>{["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => <option key={m}>{m}</option>)}</NativeSelect></FormField>
          <FormField label="URL" className="sm:col-span-3"><Input className="font-mono text-xs" value={step.url} onChange={set("url")} placeholder="https://api.contoh.com/gambar?q={{text | urlencode}}" /></FormField>
          {jsonField("headers", "Header (JSON)", secrets.length ? `Rahasia: ${secrets.map((s) => `{{secret.${s}}}`).join(", ")}` : 'Contoh: {"Authorization": "Bearer {{secret.API_KEY}}"}')}
          {jsonField("query", "Query (JSON)", 'Contoh: {"q": "{{text}}"}')}
          {step.method !== "GET" && step.method !== "DELETE" && jsonField("body", "Body (JSON / teks)")}
          {step.method !== "GET" && step.method !== "DELETE" && (
            <FormField label="Jenis body"><NativeSelect value={step.bodyType} onChange={set("bodyType")}><option value="json">JSON</option><option value="form">Form</option><option value="text">Teks</option></NativeSelect></FormField>
          )}
          <FormField label="Simpan sebagai"><Input className="font-mono" value={step.save} onChange={set("save")} /></FormField>
          <FormField label="Batas waktu (dtk)"><Input type="number" min={1} max={30} value={step.timeout} onChange={set("timeout")} /></FormField>
          <FormField label="Pesan bila API error" className="sm:col-span-2"><Input value={step.failText} onChange={set("failText")} placeholder="kosong = pesan bawaan" /></FormField>
        </div>
      );
    case "pick":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FormField label="Path data" help="Contoh: res.result.images.random • res.data[0].url • res.list.length" className="sm:col-span-2"><Input className="font-mono text-xs" value={step.path} onChange={set("path")} /></FormField>
          <FormField label="Simpan sebagai"><Input className="font-mono" value={step.save} onChange={set("save")} /></FormField>
          <FormField label="Pesan bila kosong" className="sm:col-span-3"><Input value={step.failText} onChange={set("failText")} /></FormField>
        </div>
      );
    case "set":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FormField label="Nama variabel"><Input className="font-mono" value={step.save} onChange={set("save")} /></FormField>
          <FormField label="Nilai (template)" className="sm:col-span-2"><Input value={step.value} onChange={set("value")} placeholder="{{res.title | upper}}" /></FormField>
        </div>
      );
    case "random":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FormField label="Pilihan (satu per baris)" className="sm:col-span-2"><Textarea rows={3} defaultValue={(step.items || []).join("\n")} onBlur={(e) => onChange({ ...step, items: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })} /></FormField>
          <FormField label="Simpan sebagai"><Input className="font-mono" value={step.save} onChange={set("save")} /></FormField>
        </div>
      );
    case "check":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <FormField label="Path" className="sm:col-span-2"><Input className="font-mono text-xs" value={step.path} onChange={set("path")} /></FormField>
          <FormField label="Syarat">
            <NativeSelect value={step.op} onChange={set("op")}>
              <option value="exists">ada / tidak kosong</option><option value="empty">kosong</option><option value="equals">sama dengan</option><option value="notEquals">tidak sama</option>
              <option value="contains">mengandung</option><option value="gt">lebih dari</option><option value="lt">kurang dari</option><option value="matches">cocok regex</option>
            </NativeSelect>
          </FormField>
          <FormField label="Nilai"><Input value={step.value} onChange={set("value")} disabled={["exists", "empty"].includes(step.op)} /></FormField>
          <FormField label="Pesan bila syarat gagal (lalu berhenti)" className="sm:col-span-4"><Input value={step.failText} onChange={set("failText")} /></FormField>
        </div>
      );
    case "reply":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <FormField label="Jenis">
            <NativeSelect value={step.kind} onChange={set("kind")}>
              <option value="text">Teks</option><option value="image">Gambar</option><option value="video">Video</option><option value="audio">Audio</option>
              <option value="voice">Voice note</option><option value="sticker">Stiker</option><option value="document">Dokumen</option>
            </NativeSelect>
          </FormField>
          {step.kind !== "text" && <FormField label="URL media" className="sm:col-span-3"><Input className="font-mono text-xs" value={step.url} onChange={set("url")} placeholder="{{img}}" /></FormField>}
          <FormField label={step.kind === "text" ? "Teks" : "Caption (opsional)"} className="sm:col-span-4"><Textarea rows={step.kind === "text" ? 3 : 2} value={step.text} onChange={set("text")} /></FormField>
          {step.kind === "document" && <FormField label="Nama file"><Input value={step.fileName} onChange={set("fileName")} /></FormField>}
        </div>
      );
    case "react":
      return <FormField label="Emoji"><Input value={step.emoji} onChange={set("emoji")} className="w-24" /></FormField>;
    case "ai":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FormField label="Prompt" className="sm:col-span-2"><Textarea rows={2} value={step.prompt} onChange={set("prompt")} /></FormField>
          <FormField label="Simpan sebagai"><Input className="font-mono" value={step.save} onChange={set("save")} /></FormField>
        </div>
      );
    case "delay":
      return <FormField label="Detik (maks 10)"><Input type="number" min={0.1} max={10} step={0.1} value={step.seconds} onChange={set("seconds")} className="w-32" /></FormField>;
    case "stop":
      return <FormField label="Teks terakhir (opsional)"><Input value={step.text} onChange={set("text")} /></FormField>;
  }
  return null;
}

function Editor({ initial, original, secrets, onSaved, onCancel }: { initial: Cmd; original: string | null; secrets: string[]; onSaved: () => void; onCancel: () => void }) {
  const { toast } = useFeedback();
  const [c, setC] = useState<Cmd>(structuredClone(initial));
  const [override, setOverride] = useState(!!initial.override);
  const [jsonMode, setJsonMode] = useState(false);
  const [json, setJson] = useState("");
  const [testText, setTestText] = useState("");
  const [test, setTest] = useState<TestResult | null>(null);
  const [busy, setBusy] = useState(false);
  const flag = (k: string, v: any) => setC({ ...c, flags: { ...c.flags, [k]: v } });
  const setStep = (i: number, s: Step) => setC({ ...c, steps: c.steps.map((x, j) => (j === i ? s : x)) });
  const move = (i: number, d: number) => {
    const s = [...c.steps];
    const j = i + d;
    if (j < 0 || j >= s.length) return;
    [s[i], s[j]] = [s[j], s[i]];
    setC({ ...c, steps: s });
  };
  const current = (): Cmd | null => {
    if (!jsonMode) return c;
    try {
      return JSON.parse(json);
    } catch {
      toast("JSON tidak valid", true);
      return null;
    }
  };
  const toggleJson = () => {
    if (jsonMode) {
      const v = current();
      if (!v) return;
      setC(v);
    } else setJson(JSON.stringify({ ...c, uses: undefined, lastUsed: undefined, lastError: undefined }, null, 2));
    setJsonMode(!jsonMode);
  };
  const save = async () => {
    const cmd = current();
    if (!cmd) return;
    setBusy(true);
    try {
      await api("POST", "/api/custom", { command: cmd, override, previousName: original });
      toast(`Perintah .${cmd.name} disimpan`);
      onSaved();
    } catch (err) {
      toast((err as Error).message, true);
    } finally {
      setBusy(false);
    }
  };
  const runTest = async () => {
    const cmd = current();
    if (!cmd) return;
    setBusy(true);
    setTest(null);
    try {
      setTest(await api<TestResult>("POST", "/api/custom/test", { command: { ...cmd, name: cmd.name || "uji" }, text: testText }));
    } catch (err) {
      toast((err as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
      <div className="space-y-4 md:space-y-6 xl:col-span-2">
        <Section title={original ? `Ubah .${original}` : "Perintah baru"} action={<Button size="sm" variant="outline" onClick={toggleJson}><CodeIcon />{jsonMode ? "Mode form" : "Mode JSON"}</Button>}>
          {jsonMode ? (
            <Textarea rows={22} className="font-mono text-xs" value={json} onChange={(e) => setJson(e.target.value)} />
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <FormField label="Nama perintah" help="tanpa titik, huruf kecil"><Input className="font-mono" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value.toLowerCase().replace(/\s/g, "") })} placeholder="waifu" /></FormField>
                <FormField label="Alias" help="pisahkan koma"><Input className="font-mono" value={c.aliases.join(", ")} onChange={(e) => setC({ ...c, aliases: e.target.value.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean) })} /></FormField>
                <FormField label="Kategori menu"><Input value={c.category} onChange={(e) => setC({ ...c, category: e.target.value })} /></FormField>
                <FormField label="Deskripsi" className="sm:col-span-2"><Input value={c.description} onChange={(e) => setC({ ...c, description: e.target.value })} /></FormField>
                <FormField label="Contoh pemakaian"><Input value={c.usage} onChange={(e) => setC({ ...c, usage: e.target.value })} placeholder="<kata kunci>" /></FormField>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                {[["group", "Hanya grup"], ["private", "Hanya chat pribadi"], ["admin", "Admin grup"], ["owner", "Owner"], ["premium", "Premium"]].map(([k, l]) => (
                  <label key={k} className="flex items-center gap-2"><input type="checkbox" className="size-4 accent-brand-500" checked={!!c.flags[k]} onChange={(e) => flag(k, e.target.checked)} />{l}</label>
                ))}
                <label className="flex items-center gap-2">Limit <Input type="number" min={0} max={100} className="h-8 w-20" value={c.flags.limit || 0} onChange={(e) => flag("limit", Number(e.target.value))} /></label>
                <label className="flex items-center gap-2">Jeda (dtk) <Input type="number" min={0} max={300} className="h-8 w-20" value={c.cooldown || 0} onChange={(e) => setC({ ...c, cooldown: Number(e.target.value) })} /></label>
                <label className="flex items-center gap-2"><input type="checkbox" className="size-4 accent-brand-500" checked={override} onChange={(e) => setOverride(e.target.checked)} />Timpa perintah bawaan bernama sama</label>
              </div>
              <div className="space-y-3">
                {c.steps.map((s, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge size="sm" color="light">Langkah {i + 1}</Badge>
                        <NativeSelect className="h-8 w-56" value={s.type} onChange={(e) => setStep(i, { ...NEW_STEP[e.target.value] })}>
                          {Object.entries(STEP_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                        </NativeSelect>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon-xs" variant="outline" onClick={() => move(i, -1)} aria-label="Naik">↑</Button>
                        <Button size="icon-xs" variant="outline" onClick={() => move(i, 1)} aria-label="Turun">↓</Button>
                        <Button size="icon-xs" variant="outline" onClick={() => setC({ ...c, steps: c.steps.filter((_, j) => j !== i) })} aria-label="Hapus langkah"><TrashBinIcon className="size-4" /></Button>
                      </div>
                    </div>
                    <StepEditor step={s} secrets={secrets} onChange={(v) => setStep(i, v)} />
                  </div>
                ))}
                <div className="flex flex-wrap gap-2">
                  {["http", "pick", "check", "set", "random", "reply", "react", "ai", "delay", "stop"].map((t) => (
                    <Button key={t} size="xs" variant="outline" onClick={() => setC({ ...c, steps: [...c.steps, structuredClone(NEW_STEP[t])] })}><PlusIcon className="size-4" />{STEP_LABEL[t]}</Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={save} disabled={busy}>Simpan</Button>
            <Button variant="outline" onClick={onCancel}>Batal</Button>
          </div>
        </Section>
      </div>
      <div className="space-y-4 md:space-y-6">
        <Section title="Coba dulu" description="Dijalankan sungguhan (API dipanggil) tapi tidak dikirim ke WhatsApp.">
          <FormField label="Teks setelah perintah" help="jadi {{text}}, {{arg1}}, {{args}}"><Input value={testText} onChange={(e) => setTestText(e.target.value)} placeholder="kata kunci" /></FormField>
          <Button className="mt-3" variant="outline" onClick={runTest} disabled={busy}>{busy ? "Menjalankan..." : "▶ Coba"}</Button>
          {test && (
            <div className="mt-4 space-y-3 text-sm">
              <Badge color={test.ok ? "success" : "error"}>{test.ok ? "Berhasil" : "Gagal"}</Badge>
              {test.error && <p className="text-red-500">{test.error}</p>}
              <ol className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                {test.trace.map((t, i) => <li key={i} className={t.ok ? "" : "text-red-500"}>{t.ok ? "✓" : "✗"} {t.step}. {t.type} — {t.info} {t.ms ? `(${t.ms} ms)` : ""}</li>)}
              </ol>
              {test.replies.map((r, i) => (
                <div key={i} className="rounded-lg bg-gray-50 p-3 dark:bg-white/[0.03]">
                  <p className="mb-1 text-xs text-gray-500">Balasan {i + 1}: {r.kind}{r.bytes ? ` • ${(r.bytes / 1024).toFixed(0)} KB` : ""}</p>
                  {r.kind === "image" && r.url && <img src={r.url} alt="" className="mb-2 max-h-48 rounded" />}
                  {r.text && <p className="whitespace-pre-wrap text-gray-800 dark:text-white/90">{r.text}</p>}
                </div>
              ))}
            </div>
          )}
        </Section>
        <Section title="Variabel & path">
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <p><code>{"{{text}}"}</code> teks setelah perintah • <code>{"{{arg1}}"}</code> kata pertama • <code>{"{{args}}"}</code></p>
            <p><code>{"{{sender.name}}"}</code> <code>{"{{sender.number}}"}</code> <code>{"{{chat.name}}"}</code> <code>{"{{quoted.text}}"}</code> <code>{"{{date}}"}</code> <code>{"{{time}}"}</code></p>
            <p>Hasil langkah: <code>{"{{res.data.title}}"}</code> • modifier: <code>random first last length reverse shuffle keys values</code> • indeks <code>[0]</code> / <code>-1</code></p>
            <p>Filter: <code>{"{{res.title | upper | default:-}}"}</code> — upper, lower, trim, default:x, truncate:n, join:sep, urlencode, json, number</p>
            <p>Rahasia hanya di langkah HTTP: <code>{"{{secret.NAMA}}"}</code> (di teks balasan tampil ***).</p>
          </div>
        </Section>
      </div>
    </div>
  );
}

export default function CustomCommandsPage() {
  const { data, reload } = useApi<Data>("/api/custom");
  const { toast, confirm } = useFeedback();
  const [editing, setEditing] = useState<{ cmd: Cmd; original: string | null } | null>(null);
  const [secretName, setSecretName] = useState("");
  const [secretValue, setSecretValue] = useState("");
  const [host, setHost] = useState("");

  if (!data) return <Loading />;
  const secrets = data.secrets.map((s) => s.name);

  if (editing) {
    return (
      <>
        <PageTitle title="Perintah Kustom" description="Buat perintah sendiri tanpa ngoding: panggil API, ambil data, lalu balas." />
        <Editor initial={editing.cmd} original={editing.original} secrets={secrets} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />
      </>
    );
  }

  const toggle = async (c: Cmd, v: boolean) => {
    try {
      await api("PATCH", `/api/custom/${c.name}`, { enabled: v });
      reload();
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const del = async (c: Cmd) => {
    if (!(await confirm({ title: `Hapus .${c.name}?`, description: "Perintah ini akan dihapus permanen.", confirm: "Hapus", danger: true }))) return;
    await api("DELETE", `/api/custom/${c.name}`);
    toast("Perintah dihapus");
    reload();
  };
  const saveSecret = async () => {
    try {
      await api("PUT", `/api/secrets/${encodeURIComponent(secretName.trim().toUpperCase())}`, { value: secretValue });
      setSecretName("");
      setSecretValue("");
      toast("Rahasia disimpan (terenkripsi)");
      reload();
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const saveHosts = async (hosts: string[]) => {
    try {
      await api("PATCH", "/api/builder", { allowHosts: hosts });
      reload();
    } catch (err) {
      toast((err as Error).message, true);
    }
  };

  return (
    <>
      <PageTitle
        title="Perintah Kustom"
        description="Buat perintah sendiri tanpa ngoding: panggil API, ambil data dengan path (mis. result.images.random), lalu balas teks/gambar/video."
        actions={<Button onClick={() => setEditing({ cmd: structuredClone(EMPTY), original: null })}><PlusIcon />Perintah baru</Button>}
      />
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
        <div className="space-y-4 md:space-y-6 xl:col-span-2">
          <Section title={`Daftar perintah (${data.commands.length})`} description="Mulai cepat dari contoh:" action={<div className="flex flex-wrap gap-2">{PRESETS.map((p) => <Button key={p.label} size="xs" variant="outline" onClick={() => setEditing({ cmd: structuredClone(p.cmd), original: null })}>{p.label}</Button>)}</div>}>
            {!data.commands.length ? (
              <EmptyState icon={<CodeIcon className="size-6" />} title="Belum ada perintah kustom" text="Klik “Perintah baru” atau pilih salah satu contoh di atas." />
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.commands.map((c) => (
                  <div key={c.name} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-medium text-gray-800 dark:text-white/90">.{c.name} {c.aliases.length > 0 && <span className="text-xs text-gray-500">({c.aliases.join(", ")})</span>}</p>
                      <p className="text-xs text-gray-500">{c.description || "—"} • {c.steps.length} langkah • dipakai {c.uses || 0}x{c.override ? " • menimpa bawaan" : ""}</p>
                      {c.lastError && <p className="mt-1 text-xs text-red-500">⚠️ Error terakhir (langkah {c.lastError.step}): {c.lastError.message}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch size="sm" checked={c.enabled !== false} onCheckedChange={(v) => toggle(c, !!v)} aria-label={`Aktifkan ${c.name}`} />
                      <Button size="xs" variant="outline" onClick={() => setEditing({ cmd: structuredClone(c), original: c.name })}>Ubah</Button>
                      <Button size="icon-xs" variant="outline" onClick={() => del(c)} aria-label={`Hapus ${c.name}`}><TrashBinIcon className="size-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
        <div className="space-y-4 md:space-y-6">
          <Section title="Rahasia (API key)" description="Disimpan terenkripsi. Pakai di header/query/URL: {{secret.NAMA}}. Nilai tidak pernah ditampilkan lagi.">
            <Chips items={secrets} onRemove={async (n) => { await api("DELETE", `/api/secrets/${n}`); reload(); }} empty="Belum ada rahasia." />
            <div className="mt-4 grid grid-cols-1 gap-2">
              <Input className="font-mono" value={secretName} onChange={(e) => setSecretName(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))} placeholder="NAMA_RAHASIA" />
              <Input type="password" autoComplete="off" value={secretValue} onChange={(e) => setSecretValue(e.target.value)} placeholder="nilai / API key" />
              <Button variant="outline" onClick={saveSecret} disabled={!secretName || !secretValue}>Simpan rahasia</Button>
            </div>
          </Section>
          <Section title="Host lokal yang diizinkan" description="Demi keamanan, API ke localhost / IP privat diblokir. Tambahkan host yang memang kamu pakai, mis. localhost:5678 (n8n).">
            <Chips items={data.allowHosts} onRemove={(h) => saveHosts(data.allowHosts.filter((x) => x !== h))} empty="Belum ada." />
            <div className="mt-3 flex gap-2">
              <Input className="font-mono" value={host} onChange={(e) => setHost(e.target.value.trim().toLowerCase())} placeholder="localhost:5678" />
              <Button variant="outline" onClick={() => { if (host) saveHosts([...data.allowHosts, host]); setHost(""); }}>Tambah</Button>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}
