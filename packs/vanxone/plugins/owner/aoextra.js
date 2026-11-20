// Owner AutoOrder: .aoorder (order universal) .aoupload (Storage, otomatis chunk untuk file besar) .aofile (isi file .json/.txt)
const ao = require('../../lib/autoorder')
const { card, rows, btn } = require('../../lib/shopui')
const { getMedia } = require('../../lib/utils')

const TYPES = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage']
const cut = (s, n) => (String(s).length > n ? String(s).slice(0, n - 1) + '…' : String(s))
const extOf = (mime) => {
  try { return require('mime-types').extension(mime) || 'bin' } catch { return String(mime || '').split('/')[1]?.split(';')[0] || 'bin' }
}

module.exports = {
  name: 'aoextra',
  command: ['aoorder', 'aoupload', 'aofile'],
  category: 'owner',
  desc: 'AutoOrder: order universal, upload Storage, baca isi file',
  usage: '<aoorder id nokos|ptero|smm ...> | <aoupload [private]> | <aofile id>',
  run: async (ctx) => {
    const { command, args, prefix, isOwner, sock, msg } = ctx
    if (!isOwner) return ctx.reply(ctx.config.mess.only.owner)
    if (!ao.enabled()) return ctx.reply('API key AutoOrder belum diisi (settings.js -> global.autoorder.apiKey).')
    try {
      // ---------- order universal ----------
      if (command === 'aoorder') {
        const [productId, kind = '', ...rest] = args
        const USAGE = [
          '*ORDER UNIVERSAL*',
          '',
          `${prefix}aoorder <productId> nokos <economy|standard> [negara]`,
          `${prefix}aoorder <productId> ptero <username server>`,
          `${prefix}aoorder <productId> smm <target> <jumlah>`,
          '',
          'Memakai saldo AutoOrder milikmu.'
        ].join('\n')
        if (!productId) return ctx.reply(USAGE)
        const k = kind.toLowerCase()
        const body = { productId }
        if (k === 'nokos') { body.type = 'nokos'; if (rest[0]) body.tier = rest[0].toLowerCase(); if (rest[1]) body.country = rest[1].toLowerCase() }
        else if (k === 'ptero' || k === 'pterodactyl') { if (!rest[0]) return ctx.reply(USAGE); body.serverUsername = rest[0] }
        else if (k === 'smm') { const qty = parseInt(rest[1], 10); if (!rest[0] || !qty) return ctx.reply(USAGE); body.target = rest[0]; body.qty = qty }
        else if (k) return ctx.reply(USAGE)
        const r = await ao.universalOrder(body)
        const out = ['*ORDER DIKIRIM*', '', rows([['Produk', productId], ['Jenis', k || 'umum']]), '', 'Respon:', cut(JSON.stringify(r, null, 2), 1500)].join('\n')
        return card(ctx, { body: out, buttons: [], fallback: out })
      }

      // ---------- upload ke Storage ----------
      if (command === 'aoupload') {
        const media = await getMedia(sock, msg, TYPES).catch(() => null)
        if (!media) return ctx.reply(`Kirim atau balas gambar / video / audio / dokumen dengan caption ${prefix}aoupload [private]`)
        const info = media.info || {}
        const mime = info.mimetype || 'application/octet-stream'
        const filename = info.fileName || `vanxone-${Date.now()}.${extOf(mime)}`
        const isPublic = !args.some((a) => /^(private|privat|pribadi)$/i.test(a))
        await ctx.reply(`Mengunggah ${filename} (${(media.buffer.length / 1048576).toFixed(2)} MB)${media.buffer.length > 8 * 1048576 ? ' per potongan' : ''}...`)
        const r = await ao.storageUpload(media.buffer, { filename, mime, isPublic })
        const f = r.file || {}
        const url = r.url || f.url || f.downloadUrl || (f.id ? ao.storageLink(f.id) : '')
        const s = r.storage || {}
        const body = ['*UPLOAD BERHASIL*', '', rows([['Nama', f.name || filename], ['Ukuran', f.sizeFormatted || `${media.buffer.length} B`], ['Tipe', f.mimeType || mime], ['Akses', isPublic ? 'publik' : 'privat'], ['ID', f.id], ['Storage', s.usedFormatted ? `${s.usedFormatted} / ${s.maxFormatted} (${s.usedPercent}%)` : '']]), '', url].join('\n')
        const buttons = [url ? btn.copy('Salin link', url) : null, f.id ? btn.reply('Baca isi', `${prefix}aofile ${f.id}`) : null].filter(Boolean)
        return card(ctx, { body, buttons, fallback: body })
      }

      // ---------- isi file ----------
      if (command === 'aofile') {
        const id = args[0]
        if (!id) return ctx.reply(`Format: ${prefix}aofile <id file>\nHanya file .json / .txt yang bisa dibaca isinya.`)
        const r = await ao.storageContent(id)
        const content = typeof r === 'string' ? r : r.content !== undefined ? (typeof r.content === 'string' ? r.content : JSON.stringify(r.content, null, 2)) : JSON.stringify(r, null, 2)
        const out = ['*ISI FILE*', '', rows([['ID', id]]), '', cut(content, 3000), '', `Link: ${ao.storageLink(id)}`].join('\n')
        return card(ctx, { body: out, buttons: [btn.copy('Salin isi', cut(content, 1000))], fallback: out })
      }
    } catch (e) {
      console.log('[AOEXTRA]', command, e.message)
      return ctx.reply(`Gagal: ${e.message}${e.status ? ` (HTTP ${e.status})` : ''}`)
    }
  }
}
