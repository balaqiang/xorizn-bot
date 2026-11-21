import { UnlimitedAI } from "../../src/scraper/unlimitedai.js";
import te from "../../src/lib/vemzo-error.js";

const pluginConfig = {
  name: "vemzo-ai",
  alias: ["vemzoai", "vemzo"],
  category: "ai",
  description: "Chat dengan vanXone — Asisten bot cerdas",
  usage: ".vemzo-ai <pertanyaan>",
  example: ".vemzo-ai Apa itu Node.js?",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.args.join(" ");
  if (!text) {
    return m.reply(
      `🤖 *vanXone*\n\n` +
        `> Asisten cerdas siap membantu\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}vemzo-ai <pertanyaan>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}vemzo-ai Apa itu Node.js?*`
    );
  }

  await m.react("🕕");

  try {
    const result = await UnlimitedAI(text, "vemzo-ai");

    if (!result.status) {
      await m.react("☢");
      return m.reply(`❌ *vanXone Error*\n\n> ${result.error || "Gagal mendapatkan respons"}`);
    }

    await m.react("✅");
    const reply = result.answer;
    await m.reply(reply.length > 4096 ? reply.slice(0, 4096) + "..." : reply);
  } catch (e) {
    console.error(e);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
