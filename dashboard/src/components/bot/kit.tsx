"use client";
/** Komponen kecil bergaya TailAdmin yang dipakai banyak halaman. */
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { initials } from "@/lib/format";
import { cn } from "@/utils";
import React, { useState } from "react";

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Section({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3", className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>}
            {description && <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn("p-5 sm:p-6", bodyClassName)}>{children}</div>
    </div>
  );
}

export function StatCard({
  icon,
  title,
  value,
  hint,
  tone = "brand",
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "brand" | "success" | "warning" | "error" | "info" | "gray";
  badge?: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400",
    success: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500",
    warning: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    error: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500",
    info: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white/90",
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
      <div className="flex items-start justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        <span className={cn("flex size-10 items-center justify-center rounded-xl [&>svg]:size-5", tones[tone])}>{icon}</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <h4 className="text-[28px] leading-9 font-bold text-gray-800 dark:text-white/90">{value}</h4>
        {badge}
      </div>
      {hint && <p className="mt-1.5 text-theme-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  );
}

export function ToggleRow({
  title,
  description,
  checked,
  onChange,
  disabled,
}: {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4 border-b border-gray-100 py-3.5 last:border-b-0 dark:border-gray-800">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-800 dark:text-white/90">{title}</div>
        {description && <div className="text-theme-xs text-gray-500 dark:text-gray-400">{description}</div>}
      </div>
      <Switch checked={checked} onCheckedChange={(v) => onChange(!!v)} disabled={disabled} />
    </label>
  );
}

export function FormField({ label, help, children, className }: { label: string; help?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-400">{label}</span>
      {children}
      {help && <span className="text-theme-xs text-gray-500 dark:text-gray-400">{help}</span>}
    </div>
  );
}

export function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-11 w-full appearance-none rounded-[10px] border border-gray-300 bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 fill=%22none%22><path d=%22M4.79 7.4L10 12.6l5.21-5.2%22 stroke=%22%23667085%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat py-2.5 ps-4 pe-10 text-sm text-gray-800 shadow-theme-xs outline-hidden focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Avatar({ name, src, size = 40, square = false, className }: { name?: string; src?: string | null; size?: number; square?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-400 to-brand-600 font-semibold text-white",
        square ? "rounded-xl" : "rounded-full",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(11, size / 2.8) }}
    >
      {initials(name)}
      {src && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />
      )}
    </div>
  );
}

export function EmptyState({ icon, title, text, action }: { icon?: React.ReactNode; title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      {icon && <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 [&>svg]:size-7">{icon}</div>}
      <h4 className="font-semibold text-gray-800 dark:text-white/90">{title}</h4>
      {text && <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function StatusPill({ connection }: { connection?: string }) {
  const map: Record<string, { color: "success" | "warning" | "error" | "gray"; text: string }> = {
    open: { color: "success", text: "Terhubung" },
    connecting: { color: "warning", text: "Menyambung" },
    qr: { color: "warning", text: "Scan QR" },
    pairing: { color: "warning", text: "Menunggu pairing" },
    close: { color: "error", text: "Terputus" },
    logged_out: { color: "error", text: "Belum login" },
    idle: { color: "gray", text: "Memulai" },
  };
  const s = map[connection || "idle"] || map.idle;
  return (
    <Badge color={s.color} variant="light">
      <span className={cn("size-1.5 rounded-full bg-current", s.color === "warning" && "animate-pulse")} />
      {s.text}
    </Badge>
  );
}

export function SourceBadge({ source }: { source: string }) {
  const color = source === "native" ? "primary" : source === "classic" ? "info" : source === "extra" ? "warning" : "gray";
  return (
    <Badge color={color as "primary"} size="sm">
      {source}
    </Badge>
  );
}

export function Chips({ items, onRemove, empty }: { items: string[]; onRemove?: (v: string) => void; empty?: string }) {
  if (!items.length) return <span className="text-theme-sm text-gray-400">{empty || "-"}</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <span key={it} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-theme-sm text-gray-700 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300">
          {it}
          {onRemove && (
            <button type="button" className="text-gray-400 hover:text-red-500" onClick={() => onRemove(it)} aria-label={`Hapus ${it}`}>
              ✕
            </button>
          )}
        </span>
      ))}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <div className={cn("size-8 animate-spin rounded-full border-3 border-gray-200 border-t-brand-500 dark:border-gray-700", className)} />;
}

export function Loading() {
  return (
    <div className="flex h-[40vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
