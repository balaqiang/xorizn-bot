// Pabrik plugin downloader berbasis yt-dlp (satu definisi untuk banyak situs)
const net = require('net')
const { getUrl, hostIs, maxItems } = require('./downloader')
const { fetchAndSend } = require('./mediadl')

// Tolak alamat internal supaya .dl tidak bisa dipakai memindai jaringan server (SSRF)
function isPublicHttp(raw) {
  let u
  try {
    u = new URL(raw)
  } catch {
    return false
  }
  if (!/^https?:$/.test(u.protocol)) return false
  const h = u.hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (!h.includes('.') && !net.isIPv6(h)) return false // "localhost", nama host internal
  if (/(^|\.)(localhost|local|internal|lan|home|corp)$/.test(h)) return false
  if (net.isIPv4(h)) {
    const [a, b] = h.split('.').map(Number)
    return !(a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224)
  }
  if (net.isIPv6(h)) return false
  return true
}

function make({ name, command, desc, hosts, example, audio = false, playlist = false, label }) {
  return {
    name,
    command,
    category: 'downloader',
    desc,
    usage: '<link>',
    run: async ({ sock, msg, from, args, prefix, reply }) => {
      const url = getUrl(args)
      const ok = url && (hosts ? hostIs(url, hosts) && isPublicHttp(url) : isPublicHttp(url))
      if (!ok) return reply(`Masukkan link yang valid.\nContoh: ${prefix}${command[0]} ${example}`)

      await reply(`⏳ Mengunduh${audio ? ' audio' : ''}...`)
      try {
        await fetchAndSend(sock, from, msg, url, { audio, playlist, max: maxItems(), caption: label && `*${label}*` })
      } catch (err) {
        await reply(`❌ ${err.message}`)
      }
    }
  }
}

module.exports = { make, isPublicHttp }
