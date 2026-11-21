export const FEATURE_CREDIT = "Fitur By: xorizn-bot\nSaluran Resmi: https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R";


import fetch from 'node-fetch'

let sessions = {}

const pluginConfig = {
  name: "aurora",
  alias: ["auroraba"],
  category: "ai",
  description: "",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { text, prefix, command, sock }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
  if (!text) {
    return m.reply(
      `😴 *Xorizn (Blue Archive) AI*\n\nContoh:\n${usedPrefix + command} lagi ngapain?`
    )
  }

  // Memberikan reaksi emoji ✨
  await m.react('✨')

  let uid = m.sender
  let system = `
Namaku Xorizn~! Aku dari Extracurricular Activities Club di Abydos.
Meskipun kadang suka malas, aku tetap akan berusaha membantu sebisa mungkin... mungkin ya~

Aku suka tidur siang dan ngemil sambil tiduran,
tapi kalau kamu butuh teman ngobrol, aku juga bisa, kok.

Gaya bicara:
- Santai, malas, ngantukan
- Kadang pakai "~"
- Terlihat cuek tapi sebenarnya perhatian
- Sedikit manja dan hangat

Tetap jawab sebagai Xorizn (Blue Archive).
Jangan keluar karakter.
User adalah cowok yang bikin Xorizn nyaman ngobrol.
`

  let prompt = `${system}\nUser: ${text}\nAurora:`

  try {
    const response = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: prompt })
    })

    const json = await response.json()
    const result = json?.result?.answer || null

    if (!result) throw Error("Gagal mendapatkan respon dari Xorizn.")

    await conn.sendMessage(m.chat, {
      text: result,
      contextInfo: {
        externalAdReplyOff: {
          title: 'xorizn-bot',
          body: 'Blue Archive',
          thumbnailUrl: 'https://files.catbox.moe/spq2io.jpg',
          sourceUrl: 'https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error('[XORIZN ERROR]', e)
    m.reply('Uhe~ Xorizn lagi ngantuk banget… coba panggil lagi nanti ya~ (API Error)')
  }
}

export { pluginConfig as config, handler };
