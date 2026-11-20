import { generateFunCard } from '../../lib/canvas-fun.js'

const getCleanTag = (jid) => {
  if (!jid) return ''
  return String(jid).split('@')[0].split(':')[0]
}

const WATAK_LIST = [
  { tipe: 'Sanguinis (Periang & Ceria) ✨', desc: 'Suka bersosialisasi, ceria, & selalu jadi pusat perhatian.' },
  { tipe: 'Koleris (Pemimpin & Tegas) 👑', desc: 'Berjiwa pemimpin, mandiri, ambisius, & berani mengambil risiko.' },
  { tipe: 'Melankolis (Perasa & Detail) 🎨', desc: 'Pemikir mendalam, perfeksionis, sangat setia, & perasa halus.' },
  { tipe: 'Plegmatis (Damai & Santai) 🌿', desc: 'Penyabar, tidak suka konflik, pendengar yang baik, & tenang.' }
]

const getTarget = async (m, text, client) => {
  let targetJid = null
  let targetName = ''

  if (m.mentionedJid && m.mentionedJid.length > 0) {
    targetJid = m.mentionedJid[0]
  } else if (m.quoted && m.quoted.sender) {
    targetJid = m.quoted.sender
  } else if (text && text.trim().length > 0) {
    const cleanNum = text.replace(/[^0-9]/g, '')
    if (cleanNum.length >= 7 && cleanNum.length <= 15) {
      targetJid = cleanNum + '@s.whatsapp.net'
    } else {
      targetName = text.trim()
    }
  } else {
    targetJid = m.sender
  }

  let cardName = targetName
  let captionTag = targetName

  if (targetJid) {
    const cleanTag = getCleanTag(targetJid)
    captionTag = `@${cleanTag}`

    if (!cardName) {
      let foundName = null
      try {
        foundName = client.getName ? await client.getName(targetJid) : null
      } catch {}
      if (!foundName && global.db?.data?.users?.[targetJid]?.name) {
        foundName = global.db.data.users[targetJid].name
      }
      if (foundName && foundName !== 'User' && !/^\d+$/.test(foundName)) {
        cardName = foundName
      } else if (targetJid === m.sender && m.pushName) {
        cardName = m.pushName
      } else {
        cardName = `@${cleanTag}`
      }
    }
  }

  return { targetJid, targetName: cardName, captionTag: captionTag || cardName }
}

let handler = async (m, { conn, sock, text }) => {
  const client = conn || sock
  const { targetJid, targetName, captionTag } = await getTarget(m, text, client)

  const watak = WATAK_LIST[Math.floor(Math.random() * WATAK_LIST.length)]
  const empati = Math.floor(Math.random() * 50) + 50

  let ppUrl = null
  if (targetJid && client?.profilePictureUrl) {
    try { ppUrl = await client.profilePictureUrl(targetJid, 'image').catch(() => null) } catch (_) {}
  }

  const cardBuffer = await generateFunCard({
    title: '🧠 ANALISIS WATAK ASLI',
    badgeText: `💖 ${empati}% EMPATI`,
    titleBg: '#0284c7',
    badgeBg: '#ffea00',
    name: targetName,
    rate: empati,
    categoryLabel: 'Tipe Kepribadian',
    categoryValue: watak.tipe,
    descLabel: 'Karakteristik Utama',
    descValue: watak.desc,
    footerText: 'Kenali dirimu & hargai karakter kepribadian sesamamu!',
    barColor: '#38bdf8',
    ppUrl
  }).catch(() => null)

  const caption = `🧠 *ANALISIS SIFAT & WATAK ASLI* 🧠\n\n• 👤 *Subjek:* ${captionTag}\n• 🎭 *Tipe Kepribadian:* ${watak.tipe}\n• 💖 *Tingkat Empati:* *${empati}%*\n\n📝 *Karakteristik:* _"${watak.desc}"_`

  await client?.sendMessage(m.chat, { react: { text: '🧠', key: m.key } }).catch(() => null)

  const mentions = targetJid ? [targetJid] : []
  if (cardBuffer) {
    return client.sendMessage(m.chat, {
      image: cardBuffer,
      caption,
      mentions
    }, { quoted: m })
  } else {
    return client.sendMessage(m.chat, {
      text: caption,
      mentions
    }, { quoted: m })
  }
}

handler.help = ['cekwatak']
handler.tags = ['fun']
handler.command = /^(cekwatak|watakcheck)$/i
handler.limit = true
handler.register = true

export default handler
