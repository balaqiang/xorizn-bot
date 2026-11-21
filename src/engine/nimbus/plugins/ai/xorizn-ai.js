import { UnlimitedAI } from "../../src/scraper/unlimitedai.js";
import te from "../../src/lib/xorizn-error.js";

const pluginConfig = {
  name: "xorizn-ai",
  alias: ["xoriznai", "xorizn"],
  category: "ai",
  description: "Chat dengan xorizn-bot — Asisten bot cerdas",
  usage: ".xorizn-ai <pertanyaan>",
  example: ".xorizn-ai Apa itu Node.js?",
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
      `🤖 *xorizn-bot*\n\n` +
        `> Asisten cerdas siap membantu\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}xorizn-ai <pertanyaan>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}xorizn-ai Apa itu Node.js?*`
    );
  }

  await m.react("🕕");

  try {
    const result = await UnlimitedAI(text, "xorizn-ai");

    if (!result.status) {
      await m.react("☢");
      return m.reply(`❌ *xorizn-bot Error*\n\n> ${result.error || "Gagal mendapatkan respons"}`);
    }

    await m.react("✅");
    const reply = result.answer;
    await m.reply(reply.length > 4096 ? reply.slice(0, 4096) + "..." : reply);
  } catch (e) { globalThis.__xoriznCatch?.(e);
    console.error(e);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
