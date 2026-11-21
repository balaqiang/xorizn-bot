/**
 * .ai — tanya AI. Memakai penyedia OpenAI-compatible bila API key diisi (dashboard → AI),
 * kalau belum, otomatis memakai OpenCode (.oc) di komputer ini.
 */
import { aiReady, chat, clearHistory } from '../../../features/aichat.js'
import { readMessageMedia, mediaSourcesOf } from '../../../features/media-reader.js'

export default [
  {
    command: ['ai', 'ask', 'tanya', 'gpt'],
    category: 'ai',
    description: 'Tanya AI (bisa membaca gambar, stiker, PDF, DOCX — kirim/reply lampirannya)',
    usage: '<pertanyaan>',
    limit: 1,
    cooldown: 5,
    async run(m, ctx) {
      const { text, prefix, command, bot } = ctx
      const hasMedia = mediaSourcesOf(m).length > 0
      if (!text && !hasMedia) return m.reply(`Contoh: *${prefix}${command} jelaskan fotosintesis singkat*\nBisa juga kirim / reply gambar atau dokumen dengan *${prefix}${command} <pertanyaan>*.\nHapus riwayat: *${prefix}aireset*`)

      // Belum ada API key → teruskan ke OpenCode
      if (!aiReady()) {
        const oc = bot.registry.resolve('oc')
        if (!oc) return m.reply('AI belum dikonfigurasi. Owner perlu mengisi API key di dashboard → AI.')
        return oc.exec(m, { ...ctx, command: 'oc' }).then((r) => {
          ctx.spendLimit()
          return r
        })
      }

      await m.react('🤔')
      const media = hasMedia ? await readMessageMedia(m) : null
      try {
        const res = await chat(m, text, media)
        await m.reply(res.text + (media?.notes?.length ? `\n\n_${media.notes.join(' • ')}_` : ''))
        ctx.spendLimit()
        return m.react('✅')
      } catch (err) {
        await m.react('❌')
        return m.reply(`❌ ${err.message}`)
      }
    }
  },
  {
    command: ['aireset', 'resetai', 'aiclear'],
    category: 'ai',
    description: 'Hapus riwayat percakapan AI kamu di chat ini',
    async run(m) {
      return m.reply(clearHistory(m) ? '🧹 Riwayat percakapan AI dihapus.' : 'Belum ada riwayat percakapan.')
    }
  }
]
