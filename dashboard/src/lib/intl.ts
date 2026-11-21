/** Pengganti ringan next-intl (dashboard hanya satu bahasa & di-export statis). */
import { translate } from "./messages";

export function useTranslations(namespace?: string) {
  return (key: string, values?: Record<string, string | number>) => {
    const full = namespace ? `${namespace}.${key}` : key;
    let text = translate(full) ?? key.split(".").pop() ?? key;
    if (values) for (const [k, v] of Object.entries(values)) text = text.replace(`{${k}}`, String(v));
    return text;
  };
}

export function useLocale() {
  return "id";
}
