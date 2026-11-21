export const fmtNum = (n?: number | null) => Number(n || 0).toLocaleString("id-ID");

export function fmtBytes(n?: number) {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(u.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  return `${(n / 1024 ** i).toFixed(i ? 1 : 0)} ${u[i]}`;
}

export function fmtDur(ms: number) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return [d && `${d}h`, h && `${h}j`, `${m}m`].filter(Boolean).join(" ");
}

export function fmtAgo(t?: number) {
  if (!t) return "-";
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "baru saja";
  if (s < 3600) return `${Math.floor(s / 60)} mnt lalu`;
  if (s < 86400) return `${Math.floor(s / 3600)} jam lalu`;
  return `${Math.floor(s / 86400)} hari lalu`;
}

export const fmtDate = (t?: number) =>
  t ? new Date(t).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-";

export function initials(s?: string) {
  const parts = String(s || "?")
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2);
  return parts.map((w) => [...w][0] || "").join("").toUpperCase() || "#";
}
