// Feature: Pull Latest Updates from GitHub

import { exec } from "node:child_process";
import { promisify } from "node:util";

const execPromise = promisify(exec);

const handler = async (m) => {
  await m.react("⏳");
  await m.reply("🚀 Sedang memeriksa dan mengunduh update terbaru dari GitHub...");

  try {
    const { stdout, stderr } = await execPromise("git pull origin main");
    const result = stdout.trim() || stderr.trim();

    await m.react("✅");
    await m.reply(
      "📦 *HASIL UPDATE BOT:*\n\n" +
      "```\n" + result + "\n```\n\n" +
      "Memulai ulang bot untuk menerapkan perubahan..."
    );

    setTimeout(() => {
      process.exit(0);
    }, 1500);
  } catch (err) {
    console.error("[UPDATE ERROR]", err);
    await m.react("❌");
    return m.reply("❌ Gagal memperbarui bot: " + (err.message || String(err)));
  }
};

handler.help = ["update"];
handler.tags = ["owner"];
handler.command = /^(update|gitpull|pull)$/i;
handler.owner = true;
handler.register = false;

export default handler;
