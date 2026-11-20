const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const sharp = require('sharp');
const pino = require('pino');

module.exports = {
  name: 'sticker',
  command: ['s', 'sticker', 'stiker'],
  category: 'sticker',
  desc: 'Membuat sticker dari gambar/video via reply atau caption',
  usage: '.s (reply gambar)',
  run: async ({ sock, msg, from, sender, args, text, prefix, reply }) => {
    
    let targetMsg = null;
    let isVideo = false;

    // 1. Cek reply gambar/video
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted?.imageMessage || quoted?.videoMessage) {
      targetMsg = {
        key: msg.key,
        message: quoted
      };
      isVideo = !!quoted.videoMessage;
    } 
    // 2. Cek gambar/video dengan caption .s
    else if (msg.message?.imageMessage || msg.message?.videoMessage) {
      targetMsg = msg;
      isVideo = !!msg.message?.videoMessage;
    }

    if (!targetMsg) {
      return reply(`Reply gambar/video atau kirim gambar dengan caption *${prefix}s*`);
    }

    try {
      const buffer = await downloadMediaMessage(
        targetMsg,
        'buffer',
        {},
        { 
          logger: pino({ level: 'silent' }),
          reuploadRequest: sock.updateMediaMessage 
        }
      );

      let stickerBuffer;

      if (isVideo) {
        // Untuk video/gif < 10 detik, kirim langsung sebagai sticker animasi
        // Baileys akan handle jadi webp animasi
        stickerBuffer = buffer;
      } else {
        // Untuk gambar, resize ke 512x512 biar HD & gak pecah
        stickerBuffer = await sharp(buffer)
          .resize(512, 512, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .webp()
          .toBuffer();
      }

      await sock.sendMessage(from, { sticker: stickerBuffer }, { quoted: msg });

    } catch (e) {
      console.error(e);
      return reply(`Gagal bikin sticker: ${e.message}`);
    }
  }
}
