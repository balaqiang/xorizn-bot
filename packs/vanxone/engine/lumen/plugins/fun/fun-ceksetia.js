import { generateFunCard } from '../../lib/canvas-fun.js'

const getCleanTag = (jid) => {
  if (!jid) return ''
  return String(jid).split('@')[0].split(':')[0]
}

const SETIA_REASONS = [
  'Karena hatinya hanya terpaut pada satu nama selamanya! 💖',
  'Karena anti melirik ke lawan jenis lain kalau udah sayang. 😍',
  'Karena kalau berjanji selalu ditepati sampai akhir. 🤝',
  'Masih agak sering lirak-lirik tapi tetap ingat jalan pulang. 😅',
  'Setia banget kalau lagi ada maunya aja nih! 🙈'
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

  const rate = Math.floor(Math.random() * 51) + 50
  const reason = SETIA_REASONS[Math.floor(Math.random() * SETIA_REASONS.length)]

  let ppUrl = null
  if (targetJid && client?.profilePictureUrl) {
    try { ppUrl = await client.profilePictureUrl(targetJid, 'image').catch(() => null) } catch (_) {}
  }

  const cardBuffer = await generateFunCard({
    title: '🔒 CEK TINGKAT KESETIAAN',
    badgeText: `💖 ${rate}% SETIA`,
    titleBg: '#16a34a',
    badgeBg: '#ffea00',
    name: targetName,
    rate,
    categoryLabel: 'Status Kesetiaan',
    categoryValue: rate > 75 ? 'Setia Setengah Mati 💎' : 'Cukup Setia 💚',
    descLabel: 'Catatan Kesetiaan',
    descValue: reason,
    footerText: 'Pertahankan kesetiaanmu karena setia itu mahal harganya!',
    barColor: '#22c55e',
    ppUrl
  }).catch(() => null)

  const caption = `🔒 *CEK TINGKAT KESETIAAN* 🔒\n\n• 👤 *Subjek:* ${captionTag}\n• 💖 *Persentase Kesetiaan:* *${rate}%*\n• 📜 *Catatan Kesetiaan:* _"${reason}"_\n\n_Pertahankan kesetiaanmu karena setia itu mahal harganya!_ 💎`

  await client?.sendMessage(m.chat, { react: { text: '🔒', key: m.key } }).catch(() => null)

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

handler.help = ['ceksetia']
handler.tags = ['fun']
handler.command = /^(ceksetia|setiacheck)$/i
handler.limit = true
handler.register = true

export default handler
