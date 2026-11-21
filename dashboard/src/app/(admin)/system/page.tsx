"use client";

import { useFeedback } from "@/components/bot/feedback";
import { FormField, Loading, NativeSelect, PageTitle, Section, ToggleRow } from "@/components/bot/kit";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertIcon, DatabaseIcon, RegenerateIcon } from "@/icons";
import { api, useApi } from "@/lib/api";
import { fmtNum } from "@/lib/format";
import { cn } from "@/utils";
import { useEffect, useState } from "react";

const DRIVER_LABEL: Record<string, string> = { json: "JSON file", sqlite: "SQLite", mysql: "MySQL / XAMPP" };

export default function SystemPage() {
  const { data: c, reload } = useApi<any>("/api/config");
  const { data: o } = useApi<any>("/api/overview");
  const { toast, confirm } = useFeedback();
  const [driver, setDriver] = useState("json");
  const [db, setDb] = useState<any>({});
  const [dash, setDash] = useState<any>({});
  const [login, setLogin] = useState<any>({});
  const [packs, setPacks] = useState<any>({});
  const [keys, setKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!c) return;
    setDriver(c.database.driver);
    setDb({ json: { ...c.database.json }, sqlite: { ...c.database.sqlite }, mysql: { ...c.database.mysql } });
    setDash({ host: c.dashboard.host, port: c.dashboard.port, password: "" });
    setLogin({ ...c.bot });
    setPacks({ ...c.packs });
    setKeys({ ...c.apiKeys });
  }, [c]);

  if (!c || !o) return <Loading />;
  const opts = db[driver] || {};
  const setOpt = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setDb({ ...db, [driver]: { ...opts, [k]: e.target.value } });
  const patchConfig = async (body: any, msg = "Disimpan, berlaku setelah restart") => {
    try {
      await api("PATCH", "/api/config", body);
      toast(msg);
      reload();
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const options = () => ({ ...opts, ...(opts.port ? { port: Number(opts.port) } : {}) });

  return (
    <>
      <PageTitle
        title="Sistem & Database"
        actions={
          <>
            <Button variant="outline" onClick={async () => { await api("POST", "/api/connection/reconnect").catch(() => {}); toast("Menyambung ulang WhatsApp..."); }}><RegenerateIcon /> Sambung ulang WA</Button>
            <Button
              onClick={async () => {
                if (!(await confirm({ title: "Restart bot?", description: "Bot akan mati sebentar lalu menyala lagi.", confirm: "Restart" }))) return;
                await api("POST", "/api/system/restart").catch(() => {});
                toast("Restart... halaman dimuat ulang dalam 10 detik");
                setTimeout(() => location.reload(), 10000);
              }}
            >
              Restart bot
            </Button>
          </>
        }
      />
      {c.database.driver !== c.database.active && (
        <Alert variant="warning" className="mb-6">
          <AlertIcon />
          <AlertDescription>Config memakai <b>{c.database.driver}</b>, tapi yang aktif <b>{c.database.active}</b>. Restart bot untuk menerapkan.</AlertDescription>
        </Alert>
      )}
      {!c.launcher && (
        <Alert variant="info" className="mb-6">
          <AlertIcon />
          <AlertDescription>Bot tidak dijalankan lewat <code>npm start</code>, jadi tombol restart hanya menghentikan bot.</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        <div className="space-y-4 md:space-y-6">
          <Section title="Database" description='Pilih penyimpanan data bot. "Pindahkan data" menyalin semua data lalu memakainya setelah restart.' action={<Badge color="success" size="sm">aktif: {c.database.active}</Badge>}>
            <div className="mb-5 grid grid-cols-3 gap-2">
              {c.drivers.map((d: string) => (
                <button
                  key={d}
                  onClick={() => setDriver(d)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-theme-sm font-medium transition",
                    driver === d ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400" : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-800 dark:text-gray-400",
                  )}
                >
                  <DatabaseIcon className="size-6" />
                  {DRIVER_LABEL[d]}
                </button>
              ))}
            </div>
            {driver === "mysql" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Host"><Input value={opts.host || ""} onChange={setOpt("host")} /></FormField>
                <FormField label="Port"><Input type="number" value={opts.port || ""} onChange={setOpt("port")} /></FormField>
                <FormField label="User"><Input value={opts.user || ""} onChange={setOpt("user")} /></FormField>
                <FormField label="Password"><Input type="password" value={opts.password || ""} placeholder="kosong untuk XAMPP default" onChange={setOpt("password")} /></FormField>
                <FormField label="Nama database" help="Dibuat otomatis. XAMPP: jalankan MySQL di XAMPP Control Panel dulu." className="sm:col-span-2"><Input value={opts.database || ""} onChange={setOpt("database")} /></FormField>
              </div>
            ) : (
              <FormField label="File" help={driver === "sqlite" ? "Memakai modul bawaan Node.js (node:sqlite), tanpa instalasi tambahan." : undefined}>
                <Input className="font-mono" value={opts.file || ""} onChange={setOpt("file")} />
              </FormField>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const r = await api("POST", "/api/database/test", { driver, options: options() });
                    toast(`Koneksi ${driver} OK (${r.rows} baris)`);
                  } catch (err) {
                    toast((err as Error).message, true);
                  }
                }}
              >
                Tes koneksi
              </Button>
              <Button
                onClick={async () => {
                  if (!(await confirm({ title: `Pindahkan data ke ${DRIVER_LABEL[driver]}?`, description: "Semua data disalin ke penyimpanan baru (data lama tidak dihapus). Setelah itu bot perlu restart.", confirm: "Pindahkan" }))) return;
                  try {
                    const r = await api("POST", "/api/database/migrate", { driver, options: options() });
                    toast(`${fmtNum(r.rows)} baris disalin ke ${driver}`);
                    reload();
                    if (await confirm({ title: "Restart sekarang?", description: "Database baru dipakai setelah bot restart.", confirm: "Restart" })) await api("POST", "/api/system/restart");
                  } catch (err) {
                    toast((err as Error).message, true);
                  }
                }}
              >
                Pindahkan data & pakai
              </Button>
            </div>
            <p className="mt-4 text-theme-xs text-gray-500">{Object.entries(o.database.collections).map(([k, v]) => `${k}: ${fmtNum(v as number)}`).join(" • ")}</p>
          </Section>
          <Section title="Dashboard">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Host" help="127.0.0.1 = hanya komputer ini. 0.0.0.0 = bisa dari jaringan."><Input className="font-mono" value={dash.host || ""} onChange={(e) => setDash({ ...dash, host: e.target.value })} /></FormField>
              <FormField label="Port"><Input type="number" value={dash.port || ""} onChange={(e) => setDash({ ...dash, port: e.target.value })} /></FormField>
              <FormField label="Password baru" className="sm:col-span-2"><Input type="password" autoComplete="new-password" placeholder="kosongkan bila tidak diganti" value={dash.password} onChange={(e) => setDash({ ...dash, password: e.target.value })} /></FormField>
            </div>
            <Button className="mt-5" onClick={() => patchConfig({ dashboard: { host: dash.host, port: Number(dash.port), ...(dash.password ? { password: dash.password } : {}) } })}>Simpan</Button>
          </Section>
        </div>
        <div className="space-y-4 md:space-y-6">
          <Section title="Login WhatsApp">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Metode login">
                <NativeSelect value={login.loginMethod || "pairing"} onChange={(e) => setLogin({ ...login, loginMethod: e.target.value })}>
                  <option value="pairing">Kode pairing</option>
                  <option value="qr">QR code</option>
                </NativeSelect>
              </FormField>
              <FormField label="Nomor bot (pairing otomatis)"><Input value={login.pairingNumber || ""} placeholder="628xxx" onChange={(e) => setLogin({ ...login, pairingNumber: e.target.value })} /></FormField>
            </div>
            <p className="mt-3 text-theme-xs text-gray-500">Sesi tersimpan di <code>{c.bot.sessionDir}</code></p>
            <Button className="mt-4" onClick={() => patchConfig({ bot: { loginMethod: login.loginMethod, pairingNumber: login.pairingNumber } })}>Simpan</Button>
          </Section>
          <Section title="Sumber fitur">
            <ToggleRow title="Classic" description="±2.250 perintah dari src/plugins & src/engine (7 engine). Butuh restart." checked={!!packs.classic} onChange={(v) => setPacks({ ...packs, classic: v })} />
            <ToggleRow title="Extra" description="±270 perintah dari src/plugins/extra. Butuh restart." checked={!!packs.extra} onChange={(v) => setPacks({ ...packs, extra: v })} />
            <Button className="mt-4" onClick={() => patchConfig({ packs })}>Simpan</Button>
          </Section>
          <Section title="API key" description="Dipakai fitur classic & extra (downloader, maker, AI, dll). Nilai tersimpan disamarkan.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.keys(keys).map((k) => (
                <FormField key={k} label={k}><Input className="font-mono" value={keys[k]} placeholder="-" onChange={(e) => setKeys({ ...keys, [k]: e.target.value })} /></FormField>
              ))}
            </div>
            <Button className="mt-5" onClick={() => patchConfig({ apiKeys: keys }, "API key disimpan, restart untuk menerapkan")}>Simpan</Button>
          </Section>
        </div>
      </div>
    </>
  );
}
