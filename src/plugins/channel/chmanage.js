// .chcreate / .chname / .chdesc / .chpp — buat & kelola saluran
const ch = require('../../lib/channels')
const { getMedia } = require('../../lib/utils')

module.exports = {
  name: 'chmanage',
  command: ['chcreate', 'buatch', 'chname', 'chdesc', 'chpp'],
  category: 'channel',
  emoji: '🛠️',
  desc: 'Buat saluran baru, ubah nama/deskripsi/foto saluran',
  usage: 'chcreate <nama> | <deskripsi>  •  chname <nama>  •  chdesc <teks>  •  chpp (reply foto)',
  owner: true,
  run: async ({ sock, msg, command, body, prefix, reply }) => {
    const raw = String(body || '').replace(/^\S+\s*/, '')
    try {
      if (command === 'chcreate' || command === 'buatch') {
        ch.need(sock, 'newsletterCreate')
        const [name, ...d] = raw.split('|')
        const desc = d.join('|').trim()
        if (!name.trim()) return reply(`Format: ${prefix}chcreate <nama saluran> | <deskripsi>\nContoh: ${prefix}chcreate Info xorizn-bot | Pembaruan fitur bot`)
        if (name.trim().length > 100) return reply('Nama saluran maksimal 100 karakter.')
        const md = ch.normalize(await sock.newsletterCreate(name.trim(), desc || undefined))
        if (!md.id) throw new ch.ChannelError('Saluran dibuat, tetapi WhatsApp tidak mengembalikan datanya. Cek di aplikasi.')
        ch.setCurrent({ id: md.id, name: md.name || name.trim(), role: md.role || 'OWNER' })
        return reply(`✅ Saluran dibuat: *${md.name || name.trim()}*\n🆔 ${md.id}${md.invite ? `\n🔗 ${ch.link(md.invite)}` : ''}\nSudah dijadikan saluran bawaan (${prefix}swch, ${prefix}playch).`)
      }

      const t = await ch.pickTarget(sock, raw)
      ch.assertCanPost(t)

      if (command === 'chname') {
        ch.need(sock, 'newsletterUpdateName')
        if (!t.rest) return reply(`Isi nama baru.\nContoh: ${prefix}chname Info xorizn-bot`)
        if (t.rest.length > 100) return reply('Nama saluran maksimal 100 karakter.')
        await sock.newsletterUpdateName(t.id, t.rest)
        if (ch.getCurrent()?.id === t.id) ch.setCurrent({ ...ch.getCurrent(), name: t.rest })
        return reply(`✅ Nama saluran diubah menjadi *${t.rest}*.`)
      }
      if (command === 'chdesc') {
        ch.need(sock, 'newsletterUpdateDescription')
        if (!t.rest) return reply(`Isi deskripsi baru.\nContoh: ${prefix}chdesc Pembaruan fitur bot`)
        if (t.rest.length > 500) return reply('Deskripsi maksimal 500 karakter.')
        await sock.newsletterUpdateDescription(t.id, t.rest)
        return reply(`✅ Deskripsi saluran *${t.name}* diperbarui.`)
      }
      // chpp
      ch.need(sock, 'newsletterUpdatePicture')
      const media = await getMedia(sock, msg, ['imageMessage'])
      if (!media) return reply(`Kirim atau reply sebuah gambar dengan ${prefix}chpp.`)
      await sock.newsletterUpdatePicture(t.id, media.buffer)
      return reply(`✅ Foto saluran *${t.name}* diperbarui.`)
    } catch (err) {
      console.log(`[CH] ${command}:`, err.message)
      await reply(`❌ ${ch.explain(err)}`)
    }
  }
}
