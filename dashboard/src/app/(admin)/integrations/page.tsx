"use client";

import { useFeedback } from "@/components/bot/feedback";
import { FormField, Loading, PageTitle, Section, ToggleRow } from "@/components/bot/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashBinIcon } from "@/icons";
import { api, useApi } from "@/lib/api";
import { useEffect, useState } from "react";

type Hook = { id?: string; url: string; events: string[]; enabled: boolean; reply: boolean; timeout: number; secretSet?: boolean };
type Data = { webhooks: Hook[]; status: Record<string, { at: number; ok: boolean; code?: number; error?: string }>; events: string[]; api: { enabled: boolean; tokenSet: boolean; tokenHint: string } };

const EVENT_LABEL: Record<string, string> = { message: "Pesan masuk", command: "Perintah dijalankan", group: "Anggota grup (masuk/keluar/admin)" };

export default function IntegrationsPage() {
  const { data, setData } = useApi<Data>("/api/integrations");
  const { toast } = useFeedback();
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [origin, setOrigin] = useState("http://127.0.0.1:3000");

  useEffect(() => {
    if (data) setHooks(data.webhooks);
  }, [data]);
  useEffect(() => setOrigin(window.location.origin), []);
  if (!data) return <Loading />;

  const setHook = (i: number, h: Partial<Hook>) => setHooks(hooks.map((x, j) => (j === i ? { ...x, ...h } : x)));
  const saveHooks = async (list = hooks) => {
    try {
      const r = await api<Data>("PUT", "/api/integrations/webhooks", { webhooks: list });
      setData(r);
      toast("Webhook disimpan");
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const showSecret = async (h: Hook) => {
    const r = await api<{ secret: string }>("POST", `/api/integrations/webhooks/${h.id}/secret`);
    await navigator.clipboard?.writeText(r.secret).catch(() => {});
    toast(`Secret disalin: ${r.secret.slice(0, 6)}…`);
  };
  const testHook = async (h: Hook) => {
    const r = await api<{ ok: boolean; status?: number; error?: string }>("POST", `/api/integrations/webhooks/${h.id}/test`);
    toast(r.ok ? `Terkirim (HTTP ${r.status})` : `Gagal: ${r.error || `HTTP ${r.status}`}`, !r.ok);
  };
  const setApi = async (body: Record<string, unknown>) => {
    try {
      const r = await api<Data & { token: string | null }>("PATCH", "/api/integrations/api", body);
      setData(r);
      if (r.token) setToken(r.token);
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const tk = token || "TOKEN_KAMU";

  return (
    <>
      <PageTitle title="Integrasi (n8n)" description="Hubungkan bot ke n8n atau aplikasi lain: kirim event lewat webhook, dan kirim pesan dari luar lewat API." />
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        <Section
          title="Webhook keluar"
          description="Bot mengirim POST JSON ke URL ini setiap ada event. Header X-Xorizn-Signature berisi HMAC-SHA256 body dengan secret webhook."
          action={<Button size="sm" variant="outline" onClick={() => setHooks([...hooks, { url: "http://localhost:5678/webhook/xorizn", events: ["message"], enabled: true, reply: false, timeout: 10 }])}><PlusIcon />Tambah</Button>}
        >
          {!hooks.length && <p className="text-sm text-gray-500">Belum ada webhook.</p>}
          <div className="space-y-4">
            {hooks.map((h, i) => {
              const st = h.id ? data.status[h.id] : undefined;
              return (
                <div key={h.id || i} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge size="sm" color={h.enabled ? "success" : "light"}>{h.enabled ? "aktif" : "mati"}</Badge>
                      {st && <Badge size="sm" color={st.ok ? "success" : "error"}>{st.ok ? `OK ${st.code}` : `gagal ${st.code || st.error || ""}`}</Badge>}
                    </div>
                    <Button size="icon-xs" variant="outline" onClick={() => setHooks(hooks.filter((_, j) => j !== i))} aria-label="Hapus webhook"><TrashBinIcon className="size-4" /></Button>
                  </div>
                  <FormField label="URL"><Input className="font-mono text-xs" value={h.url} onChange={(e) => setHook(i, { url: e.target.value })} /></FormField>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {data.events.map((ev) => (
                      <label key={ev} className="flex items-center gap-2">
                        <input type="checkbox" className="size-4 accent-brand-500" checked={h.events.includes(ev)} onChange={(e) => setHook(i, { events: e.target.checked ? [...h.events, ev] : h.events.filter((x) => x !== ev) })} />
                        {EVENT_LABEL[ev] || ev}
                      </label>
                    ))}
                  </div>
                  <ToggleRow title="Aktif" checked={h.enabled} onChange={(v) => setHook(i, { enabled: v })} />
                  <ToggleRow title="Balas dari n8n" description='Bila n8n membalas JSON {"reply": "teks"}, bot mengirimnya ke chat asal' checked={h.reply} onChange={(v) => setHook(i, { reply: v })} />
                  {h.id && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="xs" variant="outline" onClick={() => showSecret(h)}>Salin secret</Button>
                      <Button size="xs" variant="outline" onClick={() => testHook(h)}>Kirim tes</Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Button className="mt-5" onClick={() => saveHooks()}>Simpan webhook</Button>
        </Section>

        <Section title="API masuk" description="Kirim pesan WhatsApp dari n8n / aplikasi lain. Pakai node HTTP Request di n8n.">
          <ToggleRow title="Aktifkan API" description="Token dibuat otomatis saat pertama diaktifkan" checked={data.api.enabled} onChange={(v) => setApi({ enabled: v })} />
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-gray-600 dark:text-gray-400">Token: <code className="font-mono">{data.api.tokenSet ? data.api.tokenHint : "belum ada"}</code></p>
            {token && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs dark:border-amber-500/40 dark:bg-amber-500/10">
                <p className="mb-1 font-medium text-amber-700 dark:text-amber-300">Simpan token ini sekarang — hanya ditampilkan sekali:</p>
                <code className="font-mono break-all text-gray-800 dark:text-white/90">{token}</code>
                <Button size="xs" variant="outline" className="mt-2" onClick={() => navigator.clipboard?.writeText(token)}>Salin</Button>
              </div>
            )}
            <Button size="sm" variant="outline" onClick={() => setApi({ regenerate: true, enabled: true })}>{data.api.tokenSet ? "Buat token baru" : "Buat token"}</Button>
            <div className="rounded-lg bg-gray-50 p-3 font-mono text-xs leading-relaxed text-gray-700 dark:bg-white/[0.03] dark:text-gray-300">
              <p className="mb-1 font-sans text-gray-500">Kirim teks:</p>
              <pre className="whitespace-pre-wrap">{`curl -X POST ${origin}/api/v1/send \\
  -H "Authorization: Bearer ${tk}" \\
  -H "Content-Type: application/json" \\
  -d '{"to":"628123456789","text":"Halo dari n8n"}'`}</pre>
              <p className="mt-3 mb-1 font-sans text-gray-500">Field lain: image, video, audio, document, sticker (URL), caption, fileName. "to" bisa nomor, JID pengguna, atau JID grup (…@g.us).</p>
              <p className="font-sans text-gray-500">Endpoint lain: GET /api/v1/status • GET /api/v1/groups</p>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
