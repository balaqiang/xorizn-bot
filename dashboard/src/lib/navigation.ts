"use client";
/** Pengganti navigasi next-intl: memakai next/link & next/navigation biasa. */
import { usePathname as useNextPathname } from "next/navigation";

export { default as Link } from "next/link";
export { useRouter } from "next/navigation";

/** Path tanpa garis miring di akhir (static export memakai trailingSlash). */
export function usePathname() {
  const p = useNextPathname() || "/";
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}
