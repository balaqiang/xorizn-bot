const fs = require('fs')
const { getMedia } = require('../../lib/utils')
const { paths } = require('../../lib/ytdlp')

module.exports = {
  name: 'ytcookies',
  command: ['ytcookies', 'setcookies'],
  category: 'owner',
  desc: 'Pasang cookies.txt (kirim/reply file) agar YouTube/Instagram tidak minta login',
  usage: '(kirim file cookies.txt) | status | hapus',
  owner: true,
  run: async ({ sock, msg, args, prefix, reply }) => {
    const sub = (args[0] || '').toLowerCase()
    if (sub === 'hapus') {
      fs.rmSync(paths.COOKIES_FILE, { force: true })
      return reply('🗑️ Cookies dihapus.')
    }
    if (sub === 'status') {
      return reply(fs.existsSync(paths.COOKIES_FILE) ? `✅ Cookies terpasang (${(fs.statSync(paths.COOKIES_FILE).size / 1024).toFixed(1)} KB, diubah ${new Date(fs.statSync(paths.COOKIES_FILE).mtime).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB).` : 'Belum ada cookies terpasang.')
    }

    const media = await getMedia(sock, msg, ['documentMessage']).catch(() => null)
    if (!media) {
      return reply(
        `Kirim file *cookies.txt* (format Netscape) dengan caption ${prefix}ytcookies, atau reply file itu dengan ${prefix}ytcookies.\n\n` +
          'Cara membuat: login YouTube di browser (disarankan akun cadangan), ekspor cookies dengan ekstensi "Get cookies.txt LOCALLY".\n' +
          '⚠️ Jangan pakai akun utama. Cookies bisa kedaluwarsa lebih cepat jika dipakai dari IP server.'
      )
    }
    const text = media.buffer.toString('utf8')
    const valid = /youtube\.com|google\.com|instagram\.com/.test(text) && text.split('\n').some((l) => l.split('\t').length >= 7)
    if (!valid || text.length > 2_000_000) return reply('File bukan cookies.txt format Netscape yang valid (harus berisi baris bertab untuk youtube.com / instagram.com).')

    fs.mkdirSync(paths.BIN_DIR, { recursive: true })
    fs.writeFileSync(paths.COOKIES_FILE, text.startsWith('# Netscape') ? text : `# Netscape HTTP Cookie File\n${text}`, { mode: 0o600 })
    const n = text.split('\n').filter((l) => l && !l.startsWith('#') && l.split('\t').length >= 7).length
    await reply(`✅ Cookies terpasang (${n} entri). Coba lagi tombol Putar / .ytmp3.\nPesan berisi file cookies sebaiknya dihapus dari chat.`)
  }
}
