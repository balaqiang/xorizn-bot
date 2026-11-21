"use client";
/** Kartu koneksi WhatsApp: minta kode pairing / scan QR / info akun yang tersambung. */
import { useBot } from "@/components/bot/bot-context";
import { useFeedback } from "@/components/bot/feedback";
import { Avatar, Section, StatusPill } from "@/components/bot/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CallIcon, LogOutIcon, RegenerateIcon } from "@/icons";
import { api } from "@/lib/api";
import { fmtDate } from "@/lib/format";
import { useState } from "react";

export default function ConnectCard() {
  const { status, botName } = useBot();
  const { toast, confirm } = useFeedback();
  const [number, setNumber] = useState("");
  const [busy, setBusy] = useState(false);
  const s = status;

  const pair = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("POST", "/api/connection/pair", { number: number || s?.pairingNumber });
      toast("Kode pairing dibuat");
    } catch (err) {
      toast((err as Error).message, true);
    } finally {
      setBusy(false);
    }
  };
  const act = async (kind: "reconnect" | "logout") => {
    if (kind === "logout" && !(await confirm({ title: "Logout WhatsApp?", description: "Sesi dicadangkan di data/session-backup dan bot perlu ditautkan ulang.", confirm: "Logout", danger: true }))) return;
    try {
      await api("POST", `/api/connection/${kind}`);
      toast("Diproses");
    } catch (err) {
      toast((err as Error).message, true);
    }
  };

  if (s?.connection === "open") {
    return (
      <Section title="Koneksi WhatsApp" action={<StatusPill connection="open" />}>
        <div className="flex items-center gap-4">
          <Avatar name={s.me?.name || botName} size={64} />
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold text-gray-800 dark:text-white/90">{s.me?.name || botName}</div>
            <div className="font-mono text-sm text-gray-500 dark:text-gray-400">+{String(s.me?.id || "").split("@")[0]}</div>
            <div className="text-theme-xs text-gray-400">Terhubung sejak {fmtDate(s.since)}</div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => act("reconnect")}>
            <RegenerateIcon /> Sambung ulang
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400" onClick={() => act("logout")}>
            <LogOutIcon /> Logout
          </Button>
        </div>
      </Section>
    );
  }

  if (s?.connection === "qr" && s.qr) {
    return (
      <Section title="Login dengan QR" action={<StatusPill connection="qr" />}>
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="rounded-2xl bg-white p-3 shadow-theme-sm">
            <img src={s.qr} alt="QR login WhatsApp" width={208} height={208} />
          </div>
          <ol className="list-decimal space-y-2 ps-5 text-sm text-gray-600 dark:text-gray-400">
            <li>Buka WhatsApp di HP</li>
            <li>Setelan → <b>Perangkat tertaut</b></li>
            <li><b>Tautkan perangkat</b>, lalu scan QR ini</li>
            <li className="text-theme-xs text-gray-400">QR diperbarui otomatis. Ingin pakai kode? Ubah metode login di halaman Sistem.</li>
          </ol>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Hubungkan WhatsApp" description="Tautkan nomor yang akan dijadikan bot." action={<StatusPill connection={s?.connection} />}>
      {s?.pairingCode ? (
        <div className="mb-5">
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Masukkan kode ini di WhatsApp → <b>Perangkat tertaut</b> → <b>Tautkan perangkat</b> → <b>Tautkan dengan nomor telepon</b>:
          </p>
          <div className="inline-block rounded-xl border border-dashed border-brand-300 bg-brand-50 px-5 py-3 font-mono text-3xl font-semibold tracking-[0.2em] text-brand-600 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-400">
            {s.pairingCode}
          </div>
        </div>
      ) : (
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Masukkan nomor WhatsApp bot dengan kode negara (tanpa + atau spasi), lalu minta kode pairing.</p>
      )}
      <form onSubmit={pair} className="flex max-w-md gap-2">
        <Input placeholder="628123456789" inputMode="numeric" value={number} onChange={(e) => setNumber(e.target.value)} />
        <Button type="submit" disabled={busy}>
          <CallIcon /> {s?.pairingCode ? "Kode baru" : "Minta kode"}
        </Button>
      </form>
      {s?.lastDisconnect && (
        <p className="mt-3 text-theme-xs text-gray-400">
          Terakhir terputus: kode {s.lastDisconnect.code ?? "-"} {s.lastDisconnect.reason}
        </p>
      )}
    </Section>
  );
}
