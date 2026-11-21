"use client";
import { StatusPill } from "@/components/bot/kit";
import { useBot } from "@/components/bot/bot-context";
import { Link } from "@/lib/navigation";

/** Kartu status koneksi WhatsApp di bawah sidebar (menggantikan widget promo template). */
export default function SidebarWidget() {
  const { status, botName } = useBot();
  const me = status?.me;
  return (
    <div className="mx-auto mb-6 w-full rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/3">
      <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{me?.name || botName}</h3>
      <p className="mb-3 text-theme-xs text-gray-500 dark:text-gray-400">{me ? `+${String(me.id).split("@")[0]}` : "WhatsApp belum terhubung"}</p>
      <div className="mb-4 flex justify-center">
        <StatusPill connection={status?.connection} />
      </div>
      {status?.connection !== "open" && (
        <Link href="/" className="flex items-center justify-center rounded-lg bg-brand-500 p-3 text-sm font-medium text-white hover:bg-brand-600">
          Hubungkan WhatsApp
        </Link>
      )}
    </div>
  );
}
