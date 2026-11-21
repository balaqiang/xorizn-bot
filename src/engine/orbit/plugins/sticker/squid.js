import fs from 'fs';
import path from 'path';
import config from '../../config.js';
import te from '../../src/lib/orbit-error.js';
import { renderBoardText } from './board-text-renderer.js';

const pluginConfig = {
  name: 'squid',
  alias: ['squidboard', 'squidward'],
  category: 'sticker',
  description: 'Stiker Squid 3D dengan teks hitam besar dan emoji/WEmoji',
  usage: '.squid <teks>',
  example: '.squid JANGAN LUPA SENYUM! 😎🔥',
  isOwner: false, isPremium: false, isGroup: false, isPrivate: false,
  cooldown: 8, energi: 1, isEnabled: true,
};

const SOURCE = path.join(process.cwd(), 'assets', 'image', 'squid-board-3d.png');
const BOARD = { centerX: 717, centerY: 315, width: 842, height: 414, angle: 5.4, padX: 32, padY: 22 };

const norm = (t) => String(t ?? '').replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();

async function handler(m, { sock }) {
  const text = norm(m.text);
  if (!text) return m.reply(`🪧 *SQUID 3D BOARD*\\n\\nMasukkan kata-kata yang mau ditulis di papan.\\nEmoji/WEmoji didukung.\\n\\nContoh: ${m.prefix}squid TURUNKAN HARGA PANEL! 😎🔥`);
  try {
    if (!fs.existsSync(SOURCE)) throw new Error('Template Squid 3D tidak ditemukan');
    await m.react('🕕');
    const buffer = await renderBoardText({
      source: SOURCE,
      sourceWidth: 1254,
      sourceHeight: 1254,
      outSize: 512,
      board: BOARD,
      text,
      fontStart: 128,
      fontMin: 42,
      lineGap: 0.10,
    });
    await sock.sendImageAsSticker(m.chat, buffer, m, {
      packname: config.sticker.packname,
      author: config.sticker.author,
    });
    await m.react('✅');
  } catch (error) {
    console.error('SQUID BOARD ERROR:', error);
    await m.react('❌');
    await m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
