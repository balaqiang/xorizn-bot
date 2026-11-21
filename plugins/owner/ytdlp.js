const ytdlp = require('../../lib/ytdlp')

module.exports = {
  name: 'ytdlp',
  command: ['ytdlp', 'dlstatus'],
  category: 'owner',
  desc: 'Status / pasang / update downloader yt-dlp',
  usage: 'status | install | update',
  owner: true,
  run: async ({ args, prefix, reply }) => {
    const sub = (args[0] || 'status').toLowerCase()

    if (sub === 'install' || sub === 'update') {
      await reply('⏳ Mengunduh yt-dlp terbaru dari GitHub (±35 MB)...')
      try {
        const f = await ytdlp.update()
        return reply(`✅ yt-dlp terpasang, versi ${f.version}`)
      } catch (err) {
        return reply(`❌ ${err.message}`)
      }
    }

    if (sub === 'proxy') {
      const fs = require('fs')
      const val = (args[1] || '').trim()
      if (!val) return reply(`Format: ${prefix}ytdlp proxy http://user:pass@host:port\nMatikan: ${prefix}ytdlp proxy off`)
      if (val === 'off') {
        fs.rmSync(ytdlp.paths.PROXY_FILE, { force: true })
        return reply('Proxy dimatikan.')
      }
      if (!/^(https?|socks5h?):\/\/\S+$/i.test(val)) return reply('Alamat proxy tidak valid. Contoh: http://user:pass@1.2.3.4:8080')
      fs.mkdirSync(ytdlp.paths.BIN_DIR, { recursive: true })
      fs.writeFileSync(ytdlp.paths.PROXY_FILE, val, { mode: 0o600 })
      return reply('✅ Proxy tersimpan untuk yt-dlp. Hapus pesan ini dari chat karena berisi kredensial.')
    }

    const s = ytdlp.status()
    await reply(
      [
        '*STATUS DOWNLOADER*',
        '',
        `▬ *yt-dlp:* ${s.installed ? `terpasang (${s.version})` : s.canInstall ? 'belum ada — dipasang otomatis saat pertama dipakai' : 'belum ada & tidak bisa otomatis'}`,
        `▬ *ffmpeg:* ${s.ffmpeg ? 'ada (MP3 & video 720p+audio)' : 'tidak ada (audio m4a, video 360p-720p progresif)'}`,
        `▬ *JS runtime:* ${s.js}${s.js === 'tidak ada' ? ' (YouTube bisa gagal; pakai Node 22+ atau pasang deno)' : ''}`,
        `▬ *Cookies:* ${s.cookies ? 'terpasang' : 'tidak ada'} • *Proxy:* ${s.proxy ? 'aktif' : 'tidak ada'}`,
        '',
        `${prefix}ytdlp install  → pasang / perbarui yt-dlp`,
        `${prefix}ytdlp proxy <url|off> • ${prefix}ytcookies • ${prefix}ytdebug <link>`,
        'Kalau YouTube minta verifikasi bot: pasang cookies (.ytcookies) atau proxy residensial.'
      ].join('\n')
    )
  }
}
