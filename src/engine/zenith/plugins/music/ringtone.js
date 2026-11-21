export const FEATURE_CREDIT = "Fitur By: xorizn-bot\nSaluran Resmi: https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R";


// plugins/ringtone.js
// Ringtone Downloader
// API : https://anabot.my.id
// Author : xorizn-bot

import fetch from "node-fetch"

const pluginConfig = {
  name: "ringtone",
  alias: [],
  category: "music",
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

async function handler(m, { sock, text, prefix, command }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
  if (!text) throw `Contoh: ${usedPrefix + command} Iphone`

  await m.reply('✨cihuy otw cari ringtone...')

  try {
    let url = `https://anabot.my.id/api/download/ringtone?query=${encodeURIComponent(text)}&apikey=freeApikey`
    let res = await fetch(url)
    let json = await res.json()

    if (!json.success || !json.data?.result?.length) 
      throw '❌ Ringtone tidak ditemukan.'

    let result = json.data.result

    for (let audio of result) {
      // kirim audio biasa 
      await conn.sendFile(
        m.chat,
        audio.audio,
        `${audio.title}.mpeg`,
        `🎵 *${audio.title}*`,
        m,
        false, 
        {
          mimetype: 'audio/mpeg'
        }
      )
      await new Promise(resolve => setTimeout(resolve, 1500)) // delay 1.5s biar ga spam
    }

  } catch (e) {
    console.error(e)
    m.reply('⚠️ Error: ' + e.message)
  }
}

export { pluginConfig as config, handler };
