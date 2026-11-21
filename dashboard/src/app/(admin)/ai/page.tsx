"use client";

import { useFeedback } from "@/components/bot/feedback";
import { EmptyState, FormField, Loading, NativeSelect, PageTitle, Section, StatCard, ToggleRow } from "@/components/bot/kit";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AiIcon, AlertIcon, BrainIcon, ChatIcon, ChipIcon, FileIcon, PaperClipIcon, PlusIcon, SendIcon, TrashBinIcon, XIcon } from "@/icons";
import { api, useApi } from "@/lib/api";
import { fmtAgo, fmtNum } from "@/lib/format";
import { cn } from "@/utils";
import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string; files?: string[]; meta?: string; error?: boolean };
type Att = { name: string; mime: string; data: string; preview?: string };

const fileToAtt = (file: File) =>
  new Promise<Att>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const url = String(r.result);
      resolve({ name: file.name, mime: file.type || "application/octet-stream", data: url.split(",")[1] || "", preview: file.type.startsWith("image/") ? url : undefined });
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });

/** Ubah markdown sederhana dari AI jadi tampilan rapi (kode, tebal, daftar). */
function Rich({ text }: { text: string }) {
  const parts = text.split(/```(\w*)\n?([\s\S]*?)```/g);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i]) {
      const inline = (line: string) =>
        line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((seg, j) =>
          seg.startsWith("**") && seg.endsWith("**") ? <b key={j}>{seg.slice(2, -2)}</b> : seg.startsWith("`") && seg.endsWith("`") ? <code key={j} className="rounded bg-gray-100 px-1 font-mono text-[0.85em] dark:bg-white/10">{seg.slice(1, -1)}</code> : seg,
        );
      out.push(
        <div key={i}>
          {parts[i].replace(/^\n+|\n+$/g, "").split("\n").map((line, j) => {
            const h = /^#{1,6}\s+(.*)$/.exec(line);
            if (h) return <div key={j} className="mt-3 mb-1 font-semibold">{inline(h[1])}</div>;
            const li = /^\s*([-*•]|\d+\.)\s+(.*)$/.exec(line);
            if (li) return <div key={j} className="flex gap-2 ps-1"><span className="shrink-0 text-gray-400">{/\d/.test(li[1]) ? li[1] : "•"}</span><span>{inline(li[2])}</span></div>;
            return <div key={j} className={line.trim() ? "" : "h-2"}>{inline(line)}</div>;
          })}
        </div>,
      );
    }
    if (parts[i + 2] !== undefined) {
      out.push(
        <pre key={`c${i}`} className="my-2 overflow-x-auto rounded-xl bg-gray-950 p-4 font-mono text-[12.5px] text-gray-100">
          {parts[i + 1] && <div className="mb-2 text-theme-xs text-gray-500">{parts[i + 1]}</div>}
          {parts[i + 2]}
        </pre>,
      );
    }
  }
  return <>{out}</>;
}

export default function AiPage() {
  const { data, setData, reload } = useApi<any>("/api/opencode");
  const { toast, confirm } = useFeedback();
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [prompt, setPrompt] = useState("");
  const [atts, setAtts] = useState<Att[]>([]);
  const [busy, setBusy] = useState(false);
  const [cfg, setCfg] = useState<any>(null);
  const [starting, setStarting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data) return;
    if (!cfg) setCfg({ ...data.config, router: { ...data.config.router } });
    if (!model) setModel(data.config.defaultModel || data.defaultModel || "");
  }, [data, cfg, model]);
  // gulir hanya area pesan (bukan seluruh halaman). Catatan: jangan pakai `() => el.scrollIntoView()` sebagai
  // efek berbentuk ekspresi — di Chromium baru nilainya Promise dan React mengira itu fungsi cleanup.
  useEffect(() => {
    const box = endRef.current?.parentElement;
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const models = data?.models || [];
  const current = useMemo(() => models.find((m: any) => m.key === model), [models, model]);
  const providers = useMemo(() => [...new Set(models.map((m: any) => m.providerID))] as string[], [models]);

  if (!data || !cfg) return <Loading />;
  const st = data.status;

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (busy || (!prompt.trim() && !atts.length)) return;
    const userMsg: Msg = { role: "user", text: prompt, files: atts.map((a) => a.name) };
    setMessages((m) => [...m, userMsg]);
    const body = { text: prompt, files: atts.map(({ name, mime, data }) => ({ name, mime, data })), model, variant, sessionId: sessionId || undefined, newSession: !sessionId };
    setPrompt("");
    setAtts([]);
    setBusy(true);
    try {
      const r = await api("POST", "/api/opencode/chat", body);
      setSessionId(r.sessionId);
      const meta = [r.model ? `${r.model.providerID}/${r.model.id}` : model, `${(r.ms / 1000).toFixed(1)} dtk`, r.tokens ? `${fmtNum(r.tokens.input + r.tokens.output)} token` : "", r.tools?.length ? `🔧 ${r.tools.map((t: any) => t.name).join(", ")}` : "", ...(r.notes || [])].filter(Boolean).join(" • ");
      setMessages((m) => [...m, { role: "assistant", text: r.text || r.error || "(tidak ada jawaban)", meta, error: !!r.error && !r.text }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", text: (err as Error).message, error: true }]);
    } finally {
      setBusy(false);
      reload();
    }
  };

  const openSession = async (id: string) => {
    try {
      const r = await api("GET", `/api/opencode/sessions/${encodeURIComponent(id)}/messages`);
      setSessionId(id);
      setMessages(r.messages.map((x: any) => ({ role: x.role, text: x.text || x.error || "", files: x.files, error: !!x.error && !x.text })));
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const deleteSession = async (id: string) => {
    if (!(await confirm({ title: "Hapus sesi OpenCode?", description: "Riwayat percakapan sesi ini dihapus permanen dari OpenCode.", confirm: "Hapus", danger: true }))) return;
    try {
      await api("DELETE", `/api/opencode/sessions/${encodeURIComponent(id)}`);
      if (id === sessionId) {
        setSessionId("");
        setMessages([]);
      }
      setData({ ...data, sessions: data.sessions.filter((s: any) => s.id !== id) });
      toast("Sesi dihapus");
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const saveCfg = async () => {
    try {
      const r = await api("PATCH", "/api/opencode/config", cfg);
      setCfg({ ...r.config, router: { ...r.config.router } });
      toast("Pengaturan AI disimpan");
      reload();
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const setC = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setCfg({ ...cfg, [k]: e.target.value });

  return (
    <>
      <PageTitle title="AI / OpenCode" description="Bot terhubung ke OpenCode di komputer ini (lewat 9router). Perintah WhatsApp: .oc, .ocmodels, .ocmodel, .oceffort, .ocnew, .ocsessions, .ocopen" />

      {!st.ok && (
        <Alert variant="destructive" className="mb-6">
          <AlertIcon />
          <AlertTitle>Server OpenCode tidak terhubung</AlertTitle>
          <AlertDescription>
            <p>{st.error}</p>
            <Button
              size="sm"
              className="mt-3"
              disabled={starting}
              onClick={async () => {
                setStarting(true);
                try {
                  const r = await api("POST", "/api/opencode/start");
                  toast(r.status?.ok ? `OpenCode menyala (v${r.status.version})` : "Service dijalankan, menunggu siap...");
                  await reload();
                } catch (err) {
                  toast((err as Error).message, true);
                } finally {
                  setStarting(false);
                }
              }}
            >
              {starting ? "Menyalakan..." : "Jalankan OpenCode"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        <StatCard icon={<AiIcon />} title="Server OpenCode" value={st.ok ? `v${st.version}` : "Offline"} hint={st.url} tone={st.ok ? "success" : "error"} />
        <StatCard icon={<ChipIcon />} title="Model tersedia" value={fmtNum(models.length)} hint={`${providers.length} provider • ${models.filter((m: any) => m.providerID === "9router").length} lewat 9router`} />
        <StatCard icon={<ChatIcon />} title="Sesi dari WhatsApp" value={fmtNum(data.sessions.filter((s: any) => s.fromBot).length)} hint={`${fmtNum(data.sessions.length)} sesi terbaru di OpenCode`} tone="info" />
        <StatCard icon={<BrainIcon />} title="9router" value={data.router?.ok ? `${fmtNum(data.router.models)} model` : "Offline"} hint={data.router?.ok ? `${data.router.audio.length} model bisa audio` : data.router?.error} tone={data.router?.ok ? "warning" : "error"} />
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* ---------- Chat ---------- */}
        <div className="col-span-12 xl:col-span-8">
          <div className="flex h-[calc(100vh-220px)] min-h-[560px] flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
            <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">AI Playground</h3>
                <p className="truncate text-theme-xs text-gray-500">{sessionId ? `Sesi ${sessionId}` : "Sesi baru akan dibuat saat pesan pertama dikirim"}</p>
              </div>
              <NativeSelect className="h-10 w-auto max-w-64 text-theme-sm" value={model} onChange={(e) => { setModel(e.target.value); setVariant(""); }}>
                {providers.map((p) => (
                  <optgroup key={p} label={p}>
                    {models.filter((m: any) => m.providerID === p).map((m: any) => (
                      <option key={m.key} value={m.key}>
                        {m.id} {m.input.includes("image") ? "🖼️" : ""}{m.variants.length ? "⚙️" : ""}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </NativeSelect>
              {current?.variants?.length > 0 && (
                <NativeSelect className="h-10 w-auto text-theme-sm" value={variant} onChange={(e) => setVariant(e.target.value)}>
                  <option value="">effort: default</option>
                  {current.variants.map((v: string) => <option key={v} value={v}>effort: {v}</option>)}
                </NativeSelect>
              )}
              <Button variant="outline" size="sm" onClick={() => { setSessionId(""); setMessages([]); }}><PlusIcon /> Baru</Button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
              {!messages.length && (
                <EmptyState
                  icon={<AiIcon />}
                  title="Tanya apa saja ke OpenCode"
                  text="Lampirkan gambar, PDF, DOCX, XLSX, PPTX, file kode, atau audio — dibaca dengan cara yang sama seperti dari WhatsApp."
                />
              )}
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "assistant" && <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white"><AiIcon className="size-5" /></span>}
                  <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed", m.role === "user" ? "rounded-tr-sm bg-brand-500 text-white" : m.error ? "rounded-tl-sm bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "rounded-tl-sm bg-gray-100 text-gray-800 dark:bg-white/5 dark:text-white/90")}>
                    {m.files?.length ? (
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        {m.files.map((f) => <span key={f} className={cn("inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-theme-xs", m.role === "user" ? "bg-white/20" : "bg-white dark:bg-white/10")}><FileIcon className="size-3.5" />{f}</span>)}
                      </div>
                    ) : null}
                    {m.role === "assistant" ? <Rich text={m.text} /> : <div className="whitespace-pre-wrap">{m.text}</div>}
                    {m.meta && <div className="mt-2 text-theme-xs text-gray-500 dark:text-gray-400">{m.meta}</div>}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-500 text-white"><AiIcon className="size-5" /></span>
                  <div className="flex gap-1 rounded-2xl bg-gray-100 px-4 py-4 dark:bg-white/5">
                    {[0, 1, 2].map((d) => <span key={d} className="size-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: `${d * 150}ms` }} />)}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={send} className="border-t border-gray-100 p-4 dark:border-gray-800">
              {atts.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {atts.map((a, i) => (
                    <span key={i} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-1 ps-1 pe-2 text-theme-xs text-gray-700 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300">
                      {a.preview ? <img src={a.preview} alt="" className="size-8 rounded-lg object-cover" /> : <FileIcon className="ms-1 size-5" />}
                      <span className="max-w-40 truncate">{a.name}</span>
                      <button type="button" onClick={() => setAtts((x) => x.filter((_, j) => j !== i))} aria-label="Hapus lampiran"><XIcon className="size-4" /></button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-900">
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  hidden
                  onChange={async (e) => {
                    const files = [...(e.target.files || [])].slice(0, 5);
                    const big = files.find((f) => f.size > 25 * 1024 * 1024);
                    if (big) return toast(`${big.name} lebih dari 25 MB`, true);
                    setAtts([...atts, ...(await Promise.all(files.map(fileToAtt)))]);
                    e.target.value = "";
                  }}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => fileRef.current?.click()} aria-label="Lampirkan file"><PaperClipIcon /></Button>
                <Textarea
                  rows={1}
                  className="max-h-40 min-h-11 flex-1 resize-none border-0 bg-transparent shadow-none focus:ring-0 focus-visible:ring-0 dark:bg-transparent"
                  placeholder="Tulis pesan... (Enter kirim, Shift+Enter baris baru)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <Button type="submit" size="icon" disabled={busy || !st.ok} aria-label="Kirim"><SendIcon /></Button>
              </div>
            </form>
          </div>
        </div>

        {/* ---------- Samping: sesi & pengaturan ---------- */}
        <div className="col-span-12 space-y-4 md:space-y-6 xl:col-span-4">
          <Section title="Sesi OpenCode" description="Klik untuk membuka di playground." bodyClassName="p-0 sm:p-0">
            <div className="max-h-80 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
              {data.sessions.length ? (
                data.sessions.map((s: any) => (
                  <div key={s.id} className={cn("flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-white/3", s.id === sessionId && "bg-brand-50 dark:bg-brand-500/10")}>
                    <button className="min-w-0 flex-1 text-start" onClick={() => openSession(s.id)}>
                      <div className="truncate text-sm font-medium text-gray-800 dark:text-white/90">{s.title || "(tanpa judul)"}</div>
                      <div className="flex items-center gap-1.5 text-theme-xs text-gray-500">
                        {s.fromBot && <Badge size="sm" color="success">WA</Badge>}
                        <span className="truncate">{fmtAgo(s.updated)} • {s.model || "-"}</span>
                      </div>
                    </button>
                    <Button variant="ghost" size="icon-xs" onClick={() => deleteSession(s.id)} aria-label="Hapus sesi"><TrashBinIcon className="size-4" /></Button>
                  </div>
                ))
              ) : (
                <p className="px-5 py-6 text-sm text-gray-500">Belum ada sesi.</p>
              )}
            </div>
          </Section>

          <Section title="Pengaturan AI" description="Berlaku untuk perintah WhatsApp .oc dan playground ini.">
            <div className="space-y-4">
              <ToggleRow title="Aktifkan OpenCode di WhatsApp" checked={cfg.enabled !== false} onChange={(v) => setCfg({ ...cfg, enabled: v })} />
              <FormField label="Model default" help="Dipakai pengguna yang belum memilih model (.ocmodel).">
                <NativeSelect value={cfg.defaultModel || ""} onChange={setC("defaultModel")}>
                  <option value="">(default OpenCode{data.defaultModel ? `: ${data.defaultModel}` : ""})</option>
                  {models.map((m: any) => <option key={m.key} value={m.key}>{m.key}</option>)}
                </NativeSelect>
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Agent">
                  <NativeSelect value={cfg.defaultAgent || "build"} onChange={setC("defaultAgent")}>
                    {(data.agents.length ? data.agents : [{ id: "build" }, { id: "plan" }]).map((a: any) => <option key={a.id}>{a.id}</option>)}
                  </NativeSelect>
                </FormField>
                <FormField label="Batas waktu (dtk)"><Input type="number" min={30} max={1800} value={cfg.timeoutSec} onChange={setC("timeoutSec")} /></FormField>
              </div>
              <FormField label="Siapa yang boleh memakai">
                <NativeSelect value={cfg.access} onChange={setC("access")}>
                  <option value="owner">Owner saja</option>
                  <option value="premium">Owner + premium</option>
                  <option value="all">Semua pengguna</option>
                </NativeSelect>
              </FormField>
              <FormField label="Izin AI di komputer (owner)" help="Pengguna selain owner selalu memakai mode aman.">
                <NativeSelect value={cfg.permissionMode} onChange={setC("permissionMode")}>
                  <option value="safe">Aman — hanya baca, tanpa shell / edit file</option>
                  <option value="ask">Tanya — shell & edit minta izin lewat WhatsApp (.ocizin)</option>
                  <option value="full">Penuh — semua diizinkan (berisiko)</option>
                </NativeSelect>
              </FormField>
              <FormField label="Folder kerja sesi"><Input className="font-mono text-theme-sm" value={cfg.directory} placeholder={cfg.workspace} onChange={setC("directory")} /></FormField>
              <details className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">Koneksi server OpenCode (lanjutan)</summary>
                <div className="mt-4 space-y-4">
                  <FormField label="URL server" help="Kosong = otomatis dari service OpenCode di komputer ini."><Input className="font-mono text-theme-sm" value={cfg.url} placeholder={st.url} onChange={setC("url")} /></FormField>
                  <FormField label="Password server" help="Kosong = otomatis dari ~/.local/state/opencode/service.json"><Input type="password" value={cfg.password} onChange={setC("password")} /></FormField>
                </div>
              </details>
              <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Transkripsi audio lewat 9router</div>
                <p className="mb-3 text-theme-xs text-gray-500">OpenCode belum meneruskan audio ke model, jadi voice note ditranskripsi dulu. Ambil API key di dashboard 9router → API Keys.</p>
                <div className="space-y-3">
                  <FormField label="URL 9router"><Input className="font-mono text-theme-sm" value={cfg.router.url} onChange={(e) => setCfg({ ...cfg, router: { ...cfg.router, url: e.target.value } })} /></FormField>
                  <FormField label="API key 9router"><Input type="password" value={cfg.router.apiKey} placeholder="sk-..." onChange={(e) => setCfg({ ...cfg, router: { ...cfg.router, apiKey: e.target.value } })} /></FormField>
                  <FormField label="Model audio">
                    <NativeSelect value={cfg.router.audioModel} onChange={(e) => setCfg({ ...cfg, router: { ...cfg.router, audioModel: e.target.value } })}>
                      <option value="">(otomatis)</option>
                      {(data.router?.audio || []).map((m: string) => <option key={m}>{m}</option>)}
                    </NativeSelect>
                  </FormField>
                </div>
              </div>
              <Button className="w-full" onClick={saveCfg}>Simpan pengaturan AI</Button>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}
