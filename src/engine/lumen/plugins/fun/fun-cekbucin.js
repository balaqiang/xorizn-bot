import { generateFunCard } from '../../lib/canvas-fun.js'

const getCleanTag = (jid) => {
  if (!jid) return ''
  return String(jid).split('@')[0].split(':')[0]
}

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

const getPercentage = () => Math.floor(Math.random() * 101)

const getAnalysis = (pct) => {
  let comment = '', categoryVal = ''
  if (pct > 85) { comment = 'Bucin stadium 4! Rela jadi babu asal dia senyum!'; categoryVal = 'Bucin Akut 🫠' }
  else if (pct > 60) { comment = 'Suka salah tingkah kalo dichat ayang.'; categoryVal = 'Bucin Standar 🥰' }
  else if (pct > 30) { comment = 'Masih pake logika, belum dibutakan cinta.'; categoryVal = 'Cinta Logis 🧠' }
  else { comment = 'Batu karang! Hatinya beku gak mempan digombalin!'; categoryVal = 'Hati Baja 🗿' }
  return { comment, categoryVal }
}

let handler = async (m, { conn, sock, text }) => {
  const client = conn || sock
  const { targetJid, targetName, captionTag } = await getTarget(m, text, client)
  const percentage = getPercentage()
  const { comment, categoryVal } = getAnalysis(percentage)

  let ppUrl = null
  if (targetJid && client?.profilePictureUrl) {
    try { ppUrl = await client.profilePictureUrl(targetJid, 'image').catch(() => null) } catch (_) {}
  }

  const cardBuffer = await generateFunCard({
    title: '💖 CEK TINGKAT BUCIN',
    badgeText: `🥰 ${percentage}% BUCIN`,
    titleBg: '#ec4899',
    badgeBg: '#ffea00',
    name: targetName,
    rate: percentage,
    categoryLabel: 'Level Bucin',
    categoryValue: categoryVal,
    descLabel: 'Catatan Analisis',
    descValue: comment,
    footerText: 'Cinta boleh, tapi jangan lupa masa depan ya!',
    barColor: '#f472b6',
    ppUrl
  }).catch(() => null)

  const caption = `🎯 *HASIL CHECK* 🎯\n\n• 👤 *Target:* ${captionTag}\n• 📊 *Persentase:* *${percentage}%*\n• 🏷️ *Status:* ${categoryVal}\n• 💬 *Catatan:* _"${comment}"_`

  await client?.sendMessage(m.chat, { react: { text: '🥰', key: m.key } }).catch(() => null)

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

handler.help = ['cekbucin']
handler.tags = ['fun']
handler.command = /^(cekbucin|bucincheck)$/i
handler.limit = true
handler.register = true

export default handler
