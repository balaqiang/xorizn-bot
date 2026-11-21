import { config, httpRequest } from "../../src/lib/zenith-rioo-bridge.js";

const pluginConfig = {
  name: "zenith-blackbox",
  alias: ["blackbox", "bbox"],
  category: "ai",
  description: "Blackbox AI dari xorizn-bot, dipasang sebagai plugin native xorizn-bot",
  usage: ".blackbox <pertanyaan>",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m) {
  const text = m.args.join(" ").trim();
  if (!text) return m.reply(`Contoh: ${m.prefix}blackbox Halo, jelaskan JavaScript`);
  m.react?.("⏳");
  try {
    const base = config.riooApi.blackbox.baseUrl;
    const url = `${base}?text=${encodeURIComponent(text)}`;
    const data = await httpRequest(url, "json");
    const result = data?.result ?? data?.data?.result ?? data?.response;
    if (!result) throw new Error("API tidak mengembalikan hasil.");
    m.react?.("✅");
    return m.reply(String(result));
  } catch (error) {
    m.react?.("❌");
    return m.reply(`❌ Blackbox gagal: ${error.message}`);
  }
}

export { pluginConfig as config, handler };
