// Port dari 'plugin baru' (ocr.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const Tesseract = require('tesseract.js')

const handler = async (m, { sock, qmsg, mime, reply, usedPrefix, command }) => {
  const isImage = /image/.test(mime || "");

  if (!isImage) {
    return reply(
      `⚠️ *CARA PAKAI*\n\n` +
        `> Reply/kirim gambar dengan \`${usedPrefix + command}\`\n\n` +
        `> Media yang didukung: JPG, PNG, GIF, WEBP`
    );
  }

  // Reaction Loading
  await sock.sendMessage(m.chat, { react: { text: "🕒", key: m.key } }).catch(() => null);

  try {
    const buffer = await qmsg.download().catch(() => null);

    if (!buffer || buffer.length === 0) {
      await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => null);
      return reply(`❌ *GAGAL*\n\n> Tidak dapat mendownload gambar`);
    }

    const {
      data: { text: ocrText },
    } = await Tesseract.recognize(buffer, "eng", {});

    const extractedText = ocrText ? ocrText.trim() : "";

    if (!extractedText || extractedText.length === 0) {
      await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => null);
      return reply(
        `❌ *TIDAK ADA TEKS*\n\n> Tidak ada teks yang terdeteksi di gambar`
      );
    }

    // Reaction Sukses
    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } }).catch(() => null);

    const responseText =
      `📖 *OCR RESULT*\n\n` +
      `╭┈┈⬡「 📝 *TEKS* 」\n` +
      `${extractedText
        .split("\n")
        .map((l) => `┃ ${l}`)
        .join("\n")}\n` +
      `╰┈┈┈┈┈┈┈┈⬡\n\n` +
      `> Total: ${extractedText.length} karakter`;

    // Kirim Hasil dengan ContextInfo Saluran
    await sock.sendMessage(m.chat, {
      text: responseText,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 9999,
        forwardedNewsletterMessageInfo: {
          newsletterName: global.namech || "vanXone Channel",
          newsletterJid: global.idch || "120363429363092398@newsletter"
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error("[OCR ERROR]", e);
    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => null);
    reply(`❌ Terjadi kesalahan saat memproses OCR: ${e.message || e}`);
  }
};

handler.help = ["ocr (reply gambar)", "totext (reply gambar)", "imagetotext (reply gambar)", "readtext (reply gambar)"];
handler.tags = ["tools", "ai"];
handler.command = ["ocr", "totext", "imagetotext", "readtext"];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "tools"})
