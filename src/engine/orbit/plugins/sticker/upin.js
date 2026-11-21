import fs from 'fs';
import path from 'path';
import config from '../../config.js';
import te from '../../src/lib/orbit-error.js';
import { renderBoardText } from './board-text-renderer.js';

const pluginConfig = {
  name: 'upin',
  alias: ['upinboard'],
  category: 'sticker',
  description: 'Stiker Upin dengan teks hitam besar dan emoji/WEmoji',
  usage: '.upin <teks>',
  example: '.upin HALO SEMUA! 😎🔥',
  isOwner: false, isPremium: false, isGroup: false, isPrivate: false,
  cooldown: 8, energi: 1, isEnabled: true,
};

const SOURCE = path.join(process.cwd(), 'assets', 'image', 'upin-board.png');
// Native 1536x1536 coordinates of the actual white board area.
const BOARD = { centerX: 965, centerY: 955, width: 820, height: 720, angle: 1.0, padX: 34, padY: 30 };

const norm = (t) => String(t ?? '').replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();

async function handler(m, { sock }) {
  const text = norm(m.text);
  if (!text) return m.reply(`🪧 *UPIN BOARD*\\n\\nMasukkan kata-kata yang mau ditulis di papan.\\nEmoji/WEmoji didukung.\\n\\nContoh: ${m.prefix}upin HALO SEMUA! 😎🔥`);
  try {
    if (!fs.existsSync(SOURCE)) throw new Error('Template Upin tidak ditemukan');
    await m.react('🕕');
    const buffer = await renderBoardText({
      source: SOURCE,
      sourceWidth: 1536,
      sourceHeight: 1536,
      outSize: 512,
      board: BOARD,
      text,
      fontStart: 106,
      fontMin: 34,
      lineGap: 0.10,
    });
    await sock.sendImageAsSticker(m.chat, buffer, m, {
      packname: config.sticker.packname,
      author: config.sticker.author,
    });
    await m.react('✅');
  } catch (error) {
    console.error('UPIN BOARD ERROR:', error);
    await m.react('❌');
    await m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
