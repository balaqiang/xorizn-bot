/** Teks antarmuka (Bahasa Indonesia). Pengganti file pesan next-intl dari template TailAdmin. */
export const messages: Record<string, unknown> = {
  sidebar: {
    groups: { menu: "Menu", bot: "Bot", system: "Sistem" },
    badges: { new: "baru", pro: "pro" },
    items: {
      dashboard: "Dashboard",
      groups: "Grup",
      commands: "Modul & Perintah",
      users: "Pengguna",
      ai: "AI / OpenCode",
      settings: "Pengaturan Bot",
      system: "Sistem & Database",
      logs: "Log",
    },
  },
  header: {
    searchPlaceholder: "Cari perintah...",
    toggleSidebar: "Buka/tutup sidebar",
    notifications: { title: "Aktivitas", viewAll: "Lihat log lengkap" },
  },
  userDropdown: {
    settings: "Pengaturan bot",
    system: "Sistem",
    signOut: "Keluar",
  },
};

export function translate(path: string): string | undefined {
  let cur: unknown = messages;
  for (const part of path.split(".")) {
    if (cur && typeof cur === "object" && part in (cur as Record<string, unknown>)) cur = (cur as Record<string, unknown>)[part];
    else return undefined;
  }
  return typeof cur === "string" ? cur : undefined;
}
