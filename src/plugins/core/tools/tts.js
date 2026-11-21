import { tts, translate, langCode } from '../../../features/google.js'
import { toVoiceNote } from '../../../features/media.js'

/** "[bahasa] teks" → { lang, text }. Teks bisa juga dari pesan yang di-reply. */
function langAndText(args, m, fallback) {
  const words = [...args]
  const code = langCode(words[0])
  if (code && (words.length > 1 || m.quoted?.text)) words.shift()
  return { lang: code && (words.length || m.quoted?.text) ? code : fallback, text: (words.join(' ') || m.quoted?.text || '').trim() }
}

export default [
  {
    command: ['tts', 'say', 'suara'],
    category: 'tools',
    description: 'Ubah teks jadi suara (voice note). Bahasa opsional: id, en, ja, ko, ar, jawa, sunda, ...',
    usage: '[bahasa] <teks>',
    cooldown: 5,
    async run(m, { sock, args, prefix, command }) {
      const { lang, text } = langAndText(args, m, 'id')
      if (!text) return m.reply(`Contoh: *${prefix}${command} halo semuanya*\nBahasa lain: *${prefix}${command} en good morning*`)
      if (text.length > 1000) return m.reply('Teks terlalu panjang (maks 1000 karakter).')
      await m.react('⏳')
      const mp3 = await tts(text, lang)
      const audio = await toVoiceNote(mp3, 'audio/mpeg')
      await sock.sendMessage(m.chat, { audio, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: m.raw })
      return m.react('✅')
    }
  },
  {
    command: ['translate', 'tr', 'terjemah'],
    category: 'tools',
    description: 'Terjemahkan teks (bawaan ke bahasa Indonesia)',
    usage: '[bahasa] <teks>',
    cooldown: 3,
    async run(m, { args, prefix, command }) {
      const { lang, text } = langAndText(args, m, 'id')
      if (!text) return m.reply(`Contoh: *${prefix}${command} en selamat pagi*\nAtau reply pesan dengan *${prefix}${command}* / *${prefix}${command} ja*`)
      const res = await translate(text, lang)
      return m.reply(`🌐 *Terjemahan* (${res.from} → ${lang})\n\n${res.text}`)
    }
  }
]
