"use client";
/** Klien REST + realtime (SSE) ke server dashboard bot. */
import { useCallback, useEffect, useRef, useState } from "react";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T = any>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: body !== undefined && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {},
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });
  if (res.status === 401 && !url.endsWith("/api/login")) {
    if (typeof window !== "undefined" && !location.pathname.startsWith("/login")) location.href = "/login/";
    throw new ApiError("Sesi berakhir, silakan login lagi", 401);
  }
  const type = res.headers.get("content-type") || "";
  const data = type.includes("json") ? await res.json() : await res.blob();
  if (!res.ok) throw new ApiError((data as any)?.error || `HTTP ${res.status}`, res.status);
  return data as T;
}

/** Ambil data saat komponen tampil; `reload()` untuk muat ulang. */
export function useApi<T = any>(url: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    try {
      setData(await api<T>("GET", url));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);
  useEffect(() => {
    reload();
  }, [reload]);
  return { data, setData, error, loading, reload };
}

// ---------------- realtime (satu EventSource untuk seluruh aplikasi) ----------------
type Handler = (data: any) => void;
const listeners = new Map<string, Set<Handler>>();
let source: EventSource | null = null;
const lastEvent: Record<string, any> = {};

function ensureSource() {
  if (source || typeof window === "undefined") return;
  source = new EventSource("/api/events");
  for (const type of ["status", "log", "command", "groups"]) {
    source.addEventListener(type, (e) => {
      const data = JSON.parse((e as MessageEvent).data);
      lastEvent[type] = data;
      listeners.get(type)?.forEach((fn) => fn(data));
    });
  }
}

export function useEvent(type: string, handler: Handler) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    ensureSource();
    const fn: Handler = (d) => ref.current(d);
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type)!.add(fn);
    if (lastEvent[type] !== undefined && type === "status") fn(lastEvent[type]);
    return () => {
      listeners.get(type)?.delete(fn);
    };
  }, [type]);
}

export function closeEvents() {
  source?.close();
  source = null;
}
