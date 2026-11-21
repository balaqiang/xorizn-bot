"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useRouter } from "@/lib/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [botName, setBotName] = useState("Bitch Bot");

  useEffect(() => {
    api<{ authenticated: boolean; botName: string }>("GET", "/api/session")
      .then((s) => {
        setBotName(s.botName || "Bitch Bot");
        if (s.authenticated) router.replace("/");
      })
      .catch(() => setError("Dashboard tidak bisa dihubungi. Pastikan bot sedang berjalan."));
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("POST", "/api/login", { password });
      router.replace("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-center bg-white lg:flex-row dark:bg-gray-900">
      <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 lg:w-1/2">
        <form onSubmit={submit} className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <img src="/images/logo/logo-icon.svg" alt="" width={44} height={44} />
            <span className="text-xl font-bold tracking-wide text-gray-900 uppercase dark:text-white">{botName}</span>
          </div>
          <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">Masuk</h1>
          <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
            Password ada di <code className="rounded bg-gray-100 px-1 dark:bg-white/10">config/config.json</code> → <code className="rounded bg-gray-100 px-1 dark:bg-white/10">dashboard.password</code> (juga dicetak di console saat start pertama).
          </p>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400" htmlFor="pw">
            Password
          </label>
          <Input id="pw" type="password" autoComplete="current-password" required autoFocus value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="min-h-6 py-2 text-sm text-red-500">{error}</p>
          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy ? "Memeriksa..." : "Masuk"}
          </Button>
        </form>
      </div>
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-brand-950 lg:flex dark:bg-white/5">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative max-w-sm text-center">
          <img src="/images/logo/logo-icon.svg" alt="" width={72} height={72} className="mx-auto mb-6" />
          <h2 className="mb-3 text-2xl font-semibold text-white">WhatsApp Bot Dashboard</h2>
          <p className="text-gray-400">Kelola grup, perintah, pengguna, OpenCode AI, dan database bot dari satu tempat.</p>
        </div>
      </div>
    </div>
  );
}
