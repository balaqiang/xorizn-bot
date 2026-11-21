"use client";
/** Toast notifikasi + dialog konfirmasi/input (berbasis Dialog TailAdmin). */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CheckCircleIcon, OctagonAlertIcon } from "@/icons";
import { cn } from "@/utils";
import { createContext, useCallback, useContext, useRef, useState } from "react";

type Toast = { id: number; text: string; error?: boolean };
type ConfirmOpts = { title: string; description?: string; confirm?: string; cancel?: string; danger?: boolean; input?: { placeholder?: string; defaultValue?: string; type?: string } };

const FeedbackContext = createContext<{
  toast: (text: string, error?: boolean) => void;
  confirm: (opts: ConfirmOpts) => Promise<string | boolean>;
} | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dialog, setDialog] = useState<ConfirmOpts | null>(null);
  const [value, setValue] = useState("");
  const resolver = useRef<((v: string | boolean) => void) | null>(null);

  const toast = useCallback((text: string, error = false) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, error }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const confirm = useCallback((opts: ConfirmOpts) => {
    setValue(opts.input?.defaultValue ?? "");
    setDialog(opts);
    return new Promise<string | boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (result: string | boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setDialog(null);
  };

  return (
    <FeedbackContext.Provider value={{ toast, confirm }}>
      {children}
      <Dialog open={!!dialog} onOpenChange={(open) => !open && close(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog?.title}</DialogTitle>
            {dialog?.description && <DialogDescription>{dialog.description}</DialogDescription>}
          </DialogHeader>
          {dialog?.input && (
            <Input
              autoFocus
              type={dialog.input.type || "text"}
              placeholder={dialog.input.placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && close(value)}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => close(false)}>
              {dialog?.cancel || "Batal"}
            </Button>
            <Button variant={dialog?.danger ? "destructive" : "default"} onClick={() => close(dialog?.input ? value : true)}>
              {dialog?.confirm || "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="pointer-events-none fixed end-5 bottom-5 z-[200] flex flex-col gap-3" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex min-w-64 max-w-sm items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-theme-lg dark:bg-gray-900 dark:text-white/90",
              t.error ? "border-red-200 dark:border-red-500/30" : "border-green-200 dark:border-green-500/30",
            )}
          >
            {t.error ? <OctagonAlertIcon className="mt-0.5 size-5 shrink-0 text-red-500" /> : <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-green-500" />}
            <span>{t.text}</span>
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback harus di dalam FeedbackProvider");
  return ctx;
}
