const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas')
const { writeFile, mkdir } = require('node:fs/promises')
const { existsSync, unlinkSync } = require('node:fs')
const { join } = require('node:path')
const axios = require('axios')

module.exports = {
  name: 'fakegc',
  command: ['fakegc', 'fakegrup'],
  category: 'maker',
  desc: 'Membuat fake grup kontak iOS dari foto profil',
  usage: '<Nama Grup | Jumlah Anggota>',
  run: async ({ sock, msg, from, sender, args, text, prefix, reply }) => {
    const m = msg
    const conn = sock

    let q = m.message?.extendedTextMessage?.contextInfo?.quotedMessage ? {
      message: m.message.extendedTextMessage.contextInfo.quotedMessage,
      download: async () => {
        const { downloadMediaMessage } = require('@whiskeysockets/baileys')
        const pino = require('pino')
        return await downloadMediaMessage({ key: m.key, message: m.message.extendedTextMessage.contextInfo.quotedMessage }, 'buffer', {}, { logger: pino({ level: 'silent' }), reuploadRequest: conn.updateMediaMessage })
      },
      msg: { mimetype: m.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage ? 'image/jpeg' : '' }
    } : m

    // fallback mimetype
    let mime = (q.msg && q.msg.mimetype) || q.message?.imageMessage?.mimetype || (m.message?.imageMessage ? 'image/jpeg' : '')

    if (!/image/.test(mime)) {
      return reply(`*Format Salah!*\n\nReply/kirim foto profil grup lalu beri teks:\n*Contoh:* ${prefix}fakegc RIN MD OFFICIAL | 2 anggota`)
    }

    if (!text) {
      return reply(`*Format Teks Kosong!*\n\n*Penggunaan:* ${prefix}fakegc Nama Grup | Jumlah Anggota\n*Contoh:* ${prefix}fakegc RIN MD OFFICIAL | 2 anggota`)
    }

    let [namaInput, anggotaInput] = text.split('|').map(v => v ? v.trim() : '')
    if (!namaInput || !anggotaInput) {
      return reply(`*Input Tidak Lengkap!*\n*Contoh:* ${prefix}fakegc RIN MD OFFICIAL | 2 anggota`)
    }

    try {
      await reply("⏳ Memproses Fake GC iOS...")

      let ppBuffer
      if (q.download) {
        ppBuffer = await q.download()
      } else {
        const { downloadMediaMessage } = require('@whiskeysockets/baileys')
        const pino = require('pino')
        ppBuffer = await downloadMediaMessage(m, 'buffer', {}, { logger: pino({ level: 'silent' }), reuploadRequest: conn.updateMediaMessage })
      }

      const ASSETS_DIR = join(process.cwd(), 'assets', 'fakegc')
      const FONTS_DIR = join(ASSETS_DIR, 'fonts')
      const BG_LOCAL = join(ASSETS_DIR, 'bg_fakegc.jpg')
      const TMP_DIR = join(process.cwd(), 'tmp')

      await mkdir(FONTS_DIR, { recursive: true })
      await mkdir(TMP_DIR, { recursive: true })

      const fonts = [
        { url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2', name: 'Inter-Black-900.woff2', family: 'Inter', weight: '900' },
        { url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2', name: 'Inter-Medium-500.woff2', family: 'Inter', weight: '500' }
      ]

      for (const f of fonts) {
        const fPath = join(FONTS_DIR, f.name)
        if (!existsSync(fPath)) {
          const fRes = await axios.get(f.url, { responseType: 'arraybuffer' })
          await writeFile(fPath, Buffer.from(fRes.data))
        }
        GlobalFonts.registerFromPath(fPath, f.family)
      }

      const BG_URL = 'https://raw.githubusercontent.com/ryyntwx/Image-rinn/refs/heads/main/IMG-20260825-WA0312.jpg'
      if (!existsSync(BG_LOCAL)) {
        const bgRes = await axios.get(BG_URL, { responseType: 'arraybuffer' })
        await writeFile(BG_LOCAL, Buffer.from(bgRes.data))
      }

      const bgImg = await loadImage(BG_LOCAL)
      const ppImg = await loadImage(ppBuffer)

      const canvas = createCanvas(bgImg.width, bgImg.height)
      const ctx = canvas.getContext('2d')

      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)

      // PP bulat
      ctx.save()
      ctx.beginPath()
      ctx.arc(538, 362, 162, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(ppImg, 538 - 162, 362 - 162, 162 * 2, 162 * 2)
      ctx.restore()

      // nama gc
      ctx.fillStyle = '#FFFFFF'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 64px Inter, sans-serif`
      ctx.fillText(namaInput, 540, 602)

      // anggota 
      const prefixText = "Grup • "
      ctx.font = `500 37px Inter, sans-serif`
      const prefixWidth = ctx.measureText(prefixText).width
      const totalWidth = prefixWidth + ctx.measureText(anggotaInput).width
      let startX = 548 - (totalWidth / 2)

      ctx.fillStyle = '#8E8E93'
      ctx.textAlign = 'left'
      ctx.fillText(prefixText, startX, 684)

      ctx.fillStyle = '#34C759'
      ctx.fillText(anggotaInput, startX + prefixWidth, 684)

      const outPath = join(TMP_DIR, `fakegc-${Date.now()}.png`)
      await writeFile(outPath, await canvas.encode('png'))

      await conn.sendMessage(from, {
        image: { url: outPath },
        caption: `— *FAKE GC IOS* —\n\n✎ *Grup :* ${namaInput}\n✎ *Anggota :* ${anggotaInput}`
      }, { quoted: m })

      if (existsSync(outPath)) unlinkSync(outPath)

    } catch (e) {
      console.error(e)
      return reply("❌ Error: " + e.message)
    }
  }
}
