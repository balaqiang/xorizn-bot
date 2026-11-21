"use client";

import { useBot } from "@/components/bot/bot-context";
import { useFeedback } from "@/components/bot/feedback";
import { FormField, Loading, NativeSelect, PageTitle, Section, ToggleRow } from "@/components/bot/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, useApi } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

export default function SettingsPage() {
  const { data, setData } = useApi<{ settings: any; cardEngine: string }>("/api/settings");
  const { toast } = useFeedback();
  const { refresh } = useBot();
  const [f, setF] = useState<any>(null);
  const [img, setImg] = useState<string | null>(null);

  useEffect(() => {
    if (data && !f) {
      const s = data.settings;
      setF({ ...s, ownersText: s.owners.join(", "), prefixText: s.prefixes.join(" "), orderText: s.providerOrder.join(" > ") });
    }
  }, [data, f]);

  const save = async (patch: Record<string, unknown>) => {
    try {
      const r = await api("PATCH", "/api/settings", patch);
      setData({ ...data!, settings: r.settings });
      toast("Pengaturan disimpan");
      refresh();
    } catch (err) {
      toast((err as Error).message, true);
    }
  };
  const preview = useCallback(async (kind: "welcome" | "goodbye") => {
    if (!f) return;
    try {
      const blob = await api<Blob>("POST", `/api/preview/${kind}`, { background: f.welcomeBackground, color: kind === "welcome" ? f.welcomeColor : f.goodbyeColor, groupName: `${f.botName} Community` });
      setImg(URL.createObjectURL(blob));
    } catch (err) {
      toast((err as Error).message, true);
    }
  }, [f, toast]);
  useEffect(() => {
    if (f && !img) preview("welcome");
  }, [f, img, preview]);

  if (!data || !f) return <Loading />;
  const s = data.settings;
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <>
      <PageTitle title="Pengaturan Bot" description="Identitas, perilaku, prefix, dan tampilan welcome." />
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        <div className="space-y-4 md:space-y-6">
          <Section title="Identitas">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Nama bot"><Input value={f.botName} onChange={set("botName")} /></FormField>
              <FormField label="Nama owner"><Input value={f.ownerName} onChange={set("ownerName")} /></FormField>
              <FormField label="Nomor owner" help="Pisahkan dengan koma. Owner bisa memakai semua perintah." className="sm:col-span-2">
                <Input value={f.ownersText} placeholder="628xxx, 628yyy" onChange={set("ownersText")} />
              </FormField>
              <FormField label="Pack stiker"><Input value={f.packname} onChange={set("packname")} /></FormField>
              <FormField label="Author stiker"><Input value={f.author} onChange={set("author")} /></FormField>
              <FormField label="Footer" className="sm:col-span-2"><Input value={f.footer} onChange={set("footer")} /></FormField>
              <FormField label="Zona waktu"><Input value={f.timezone} onChange={set("timezone")} /></FormField>
            </div>
            <Button className="mt-5" onClick={() => save({ botName: f.botName, ownerName: f.ownerName, owners: f.ownersText.split(/[,\s]+/).filter(Boolean), packname: f.packname, author: f.author, footer: f.footer, timezone: f.timezone })}>
              Simpan identitas
            </Button>
          </Section>
          <Section title="Perintah">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Prefix" help="Pisahkan dengan spasi, contoh: . ! # /"><Input className="font-mono" value={f.prefixText} onChange={set("prefixText")} /></FormField>
              <FormField label="Mode">
                <NativeSelect value={f.mode} onChange={set("mode")}>
                  <option value="public">Public — semua orang</option>
                  <option value="self">Self — owner saja</option>
                  <option value="group">Grup saja</option>
                  <option value="private">Chat pribadi saja</option>
                </NativeSelect>
              </FormField>
              <FormField label="Jeda antar perintah (detik)"><Input type="number" min={0} max={60} value={f.cooldown} onChange={set("cooldown")} /></FormField>
              <FormField label="Prioritas sumber" help="Dipakai bila nama perintah bentrok."><Input className="font-mono" value={f.orderText} onChange={set("orderText")} /></FormField>
            </div>
            <Button className="mt-5" onClick={() => save({ prefixes: f.prefixText.split(/\s+/).filter(Boolean), mode: f.mode, cooldown: Number(f.cooldown), providerOrder: f.orderText.split(/[>\s,]+/).filter(Boolean) })}>Simpan</Button>
          </Section>
        </div>
        <div className="space-y-4 md:space-y-6">
          <Section title="Perilaku">
            <ToggleRow title="Tanpa prefix" description='Perintah juga jalan tanpa prefix (mis. "menu")' checked={s.noPrefix} onChange={(v) => save({ noPrefix: v })} />
            <ToggleRow title="Auto baca" description="Tandai semua pesan sudah dibaca" checked={s.autoRead} onChange={(v) => save({ autoRead: v })} />
            <ToggleRow title="Auto mengetik" description='Tampilkan "sedang mengetik..." saat memproses perintah' checked={s.autoTyping} onChange={(v) => save({ autoTyping: v })} />
            <ToggleRow title="Selalu online" description="Berlaku setelah sambung ulang" checked={s.alwaysOnline} onChange={(v) => save({ alwaysOnline: v })} />
            <ToggleRow title="Tolak panggilan" description="Tolak otomatis telepon ke nomor bot" checked={s.antiCall} onChange={(v) => save({ antiCall: v })} />
            <FormField label="Pesan saat menolak panggilan" className="mt-4">
              <Input value={f.antiCallMessage} onChange={set("antiCallMessage")} onBlur={() => save({ antiCallMessage: f.antiCallMessage })} />
            </FormField>
          </Section>
          <Section title="Default welcome & goodbye" description="Dipakai grup yang tidak punya teks sendiri. Placeholder: @user @name @group @count @desc" action={<Badge size="sm" color="info">{data.cardEngine}</Badge>}>
            <div className="space-y-4">
              <FormField label="Teks welcome"><Textarea rows={3} value={f.welcomeText} onChange={set("welcomeText")} /></FormField>
              <FormField label="Teks goodbye"><Textarea rows={3} value={f.goodbyeText} onChange={set("goodbyeText")} /></FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Warna welcome"><Input type="color" className="p-1" value={f.welcomeColor} onChange={set("welcomeColor")} /></FormField>
                <FormField label="Warna goodbye"><Input type="color" className="p-1" value={f.goodbyeColor} onChange={set("goodbyeColor")} /></FormField>
              </div>
              <FormField label="Latar default (URL)"><Input value={f.welcomeBackground} placeholder="kosong = gradien bawaan" onChange={set("welcomeBackground")} /></FormField>
              {img && <img src={img} alt="Pratinjau kartu" className="w-full rounded-xl border border-gray-200 dark:border-gray-800" />}
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => save({ welcomeText: f.welcomeText, goodbyeText: f.goodbyeText, welcomeColor: f.welcomeColor, goodbyeColor: f.goodbyeColor, welcomeBackground: f.welcomeBackground }).then(() => preview("welcome"))}>Simpan</Button>
                <Button variant="outline" onClick={() => preview("welcome")}>Pratinjau welcome</Button>
                <Button variant="outline" onClick={() => preview("goodbye")}>Pratinjau goodbye</Button>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}
