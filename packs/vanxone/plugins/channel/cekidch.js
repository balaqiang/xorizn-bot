// Port dari 'plugin baru' (cekidch.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const fetch = S.fetch
const sharp = require('sharp')

const handler = async (m, { sock, text, reply, example }) => {

  if (!text)
    return reply(example("linkchnya"))

  if (!text.includes("https://whatsapp.com/channel/"))
    return reply("⚠️ Link tautan tidak valid!")

  try {
    const inviteCode = text.split("https://whatsapp.com/channel/")[1].trim()
    
    // 1. Ambil ID channel menggunakan fungsi Baileys
    const res = await sock.newsletterMetadata("invite", inviteCode)
    if (!res?.id)
      return reply("Tidak dapat menemukan ID channel dari link tersebut.")

    const channelId = res.id

    // 2. Ambil nama channel asli langsung dari title web WhatsApp via fetch
    let channelName = "WhatsApp Channel"
    try {
      const htmlRes = await fetch(text.trim(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      })
      const htmlText = await htmlRes.text()
      // Ekstrak title halaman web (biasanya formatnya "Nama Channel | WhatsApp")
      const match = htmlText.match(/<title>(.*?)<\/title>/i)
      if (match && match[1]) {
        let titleClean = match[1].replace(/<\/?[^>]+(>|$)/g, "").trim()
        // Bersihkan akhiran "| WhatsApp" atau sejenisnya
        channelName = titleClean.split('|')[0].trim() || titleClean
      }
    } catch (e) {
      console.error("Gagal scrap title web channel:", e)
    }
    
    const teks = `*• Nama Channel:* ${channelName}\n*• Channel ID:* ${channelId}`

    let thumb = null
    try {
      const thumbRes = await fetch(global.thumbnail || "https://raw.githubusercontent.com/sahrilcode/cdn4/main/uploads/fc27a3-1791278710771.jpg")
      if (!thumbRes.ok) throw new Error(`HTTP ${thumbRes.status}`)
      const buff = Buffer.from(await thumbRes.arrayBuffer())
      thumb = await sharp(buff).resize(300, 300, { fit: 'cover' }).jpeg().toBuffer()
    } catch (err) {
      console.error('[THUMB]', err?.message || err)
    }

    await S.sendLocationCard(sock, m.chat, {
      location: {
        degreesLatitude: -0,
        degreesLongitude: 0,
        address: '© ' + (global.namaBot || 'ZeroTwo Bot'),
        ...(thumb ? { jpegThumbnail: thumb } : {})
      },
      text: teks,
      footer: '© sahril2nd',
      contextInfo: { mentionedJid: [m.sender] },
      messageParams: {
        limited_time_offer: {
          text: 'ジャー',
          url: 'https://t.me/sahril2nd',
        },
      },
      buttons: [
        {
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({
            display_text: 'Salin ID Channel',
            copy_code: channelId,
            id: 'copy_channel_id',
          }),
        },
      ]
    }, { quoted: m })

  } catch (err) {
    console.error("❌ cekidch Error:", err)
    m.reply("Terjadi kesalahan saat mengambil ID channel!")
  }
}

handler.command = ["cekidch", "idch"]
handler.limit = true;

module.exports = S.wrap(handler, {"category": "channel"})
