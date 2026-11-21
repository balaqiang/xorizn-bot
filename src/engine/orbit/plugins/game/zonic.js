import { readFileSync } from "node:fs";
import { AIRich } from "../../src/lib/orbit-builder.js";

const pluginConfig = {
  name: "zonic",
  alias: ["sonicorbit"],
  category: "game",
  description: "ZONIC Speed Adventure - Dual Platforms Edition",
  usage: ".zonic",
  example: ".zonic",
  cooldown: 5,
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  isEnabled: true,
};

const htmlUrl = new URL("./zonic.html", import.meta.url);

const handler = async (m, { sock }) => {
  if (!m?.chat || !sock) return;

  try {
    // Read the provided HTML directly; do not rewrite or transform the game source.
    const html = readFileSync(htmlUrl, "utf8");
    const aiRich = new AIRich(sock)
      .addSubmessage({
        messageType: 2,
        messageText: "🔵 ZONIC SPEED ADVENTURE",
      })
      .addSection(
        AIRich.newLayout("Single", {
          __typename: "GenAIaeacdsnwHtmlPrimitive",
          payload: html,
          trusted_sources: [],
        }),
      );

    await aiRich.send(m.chat, { quoted: m });
    try { await m.react("🎮"); } catch {}
    return { handled: true };
  } catch (error) {
    console.error("[ZONIC] Error:", error);
    try { await m.react("❌"); } catch {}
    return m.reply(`❌ *Gagal menjalankan ZONIC*\n\n> ${error.message}`);
  }
};

export { pluginConfig as config, handler };
