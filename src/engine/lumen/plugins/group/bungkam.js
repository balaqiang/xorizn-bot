/*

 * Christy AI WhatsApp Bot

 * Bot       : Christy MD

 * Developer : Riki

 * Library   : @itsliaaa/baileys

 * Module    : ESM Plugin

 * Channel   : https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R

 */

const DURASI = { s: 1000, m: 60000, h: 3600000, d: 86400000 }

function getStore() {
  if (!global.bungkamDB) global.bungkamDB = {}
  return global.bungkamDB
}

function getNum(jid) {
  if (!jid) return ''
  return String(jid).split('@')[0].split(':')[0].replace(/\D+/g, '')
}

function getOwnerNums() {
  const list = (global.anyaOwner || []).map(o => (Array.isArray(o) ? o[0] : o))
  if (global.nomorown) list.push(global.nomorown)
  return [...new Set(list.map(n => String(n).replace(/\D/g, '')).filter(Boolean))]
}

function getSenderIds(m) {
  return [m.sender, m.key?.participant, m.key?.senderPn, m.senderPn, m.participant]
    .filter(Boolean)
}

async function getRoles(m, conn) {
  const ids = getSenderIds(m)
  const nums = [...new Set(ids.map(getNum).filter(Boolean))]
  const ownerNums = getOwnerNums()

  const isOwner = !!(m.isOwner || m.isROwner || m.fromMe || nums.some(n => ownerNums.includes(n)))
  let isAdmin = !!(m.isAdmin || m.isSuperAdmin)

  if (!isAdmin && m.isGroup && conn) {
    try {
      const meta = await conn.groupMetadata(m.chat)
      const p = meta.participants?.find(x => {
        const pIds = [x.id, x.lid, x.phoneNumber].filter(Boolean)
        return pIds.some(pid => ids.includes(pid) || nums.includes(getNum(pid)))
      })
      if (p?.admin === 'admin' || p?.admin === 'superadmin') isAdmin = true
    } catch (e) {
      console.warn('[bungkam] gagal cek admin:', e.message)
    }
  }

  return { isOwner, isAdmin }
}

function isMuted(groupJid, userJid) {
  const group = getStore()[groupJid]
  if (!group) return false
  const userNum = getNum(userJid)
  if (!userNum) return false
  for (const [key, entry] of Object.entries(group)) {
    if (getNum(key) === userNum) {
      if (entry.until && Date.now() > entry.until) {
        delete group[key]
        return false
      }
      return true
    }
  }
  return false
}

function addMute(groupJid, userJid, by, durationMs) {
  const store = getStore()
  if (!store[groupJid]) store[groupJid] = {}
  store[groupJid][userJid] = {
    until: durationMs ? Date.now() + durationMs : null,
    by: by || 'system',
    at: Date.now(),
  }
}

function removeMute(groupJid, userJid) {
  const store = getStore()
  if (!store[groupJid]) return false
  const userNum = getNum(userJid)
  let found = false
  for (const key of Object.keys(store[groupJid])) {
    if (getNum(key) === userNum) {
      delete store[groupJid][key]
      found = true
    }
  }
  if (!Object.keys(store[groupJid]).length) delete store[groupJid]
  return found
}

function listMute(groupJid) {
  const group = getStore()[groupJid]
  if (!group) return []
  const now = Date.now()
  const result = []
  for (const [userJid, entry] of Object.entries(group)) {
    if (entry.until && now > entry.until) {
      delete group[userJid]
      continue
    }
    result.push({ userJid, ...entry })
  }
  return result
}

function clearMute(groupJid) {
  const store = getStore()
  if (store[groupJid]) {
    delete store[groupJid]
    return true
  }
  return false
}

async function dmsg(conn, chat, targetId) {
  if (!conn || !targetId) return false

  const sent = await conn.relayMessage(
    chat,
    {
      groupStatusMessageV2: {
        message: {
          extendedTextMessage: {
            text: '',
            contextInfo: { isGroupStatus: true }
          }
        }
      }
    },
    {}
  )

  const edited = await conn.relayMessage(
    chat,
    {
      protocolMessage: {
        key: { remoteJid: chat, fromMe: true, id: sent },
        type: 14,
        editedMessage: {
          extendedTextMessage: {
            text: '\0',
            contextInfo: { isGroupStatus: false }
          }
        }
      }
    },
    { messageId: targetId }
  )

  await new Promise(resolve => setTimeout(resolve, 100))

  await Promise.allSettled([
    conn.sendMessage(chat, { delete: { remoteJid: chat, id: sent, fromMe: true } }),
    conn.sendMessage(chat, { delete: { remoteJid: chat, id: edited, fromMe: true } })
  ])

  return true
}

let handler = async (m, { conn }) => {
  const { isOwner, isAdmin } = await getRoles(m, conn)

  if (!isOwner && !isAdmin) {
    return m.reply('❌ Hanya owner/admin yang bisa.')
  }

  const prefix = m.prefix || '.'
  const cmdDisplay = prefix + 'bungkam'
  const args = (m.text || '').trim().split(/\s+/).slice(1)
  const sub = args[0]?.toLowerCase()
  const target = m.mentionedJid?.[0] || m.quoted?.sender

  if (sub === 'list') {
    const list = listMute(m.chat)
    if (!list.length) return m.reply('📭 Gak ada yang dibungkam di grup ini.')

    let txt = `🔇 *DAFTAR TERBUNGKAM*\n\n`
    list.forEach((item, idx) => {
      const sisa = item.until ? `${Math.ceil((item.until - Date.now()) / 1000)}s` : 'permanen'
      txt += `${idx + 1}. @${item.userJid.split('@')[0]}\n   ⏱️ ${sisa}\n\n`
    })
    return conn.sendMessage(m.chat, { text: txt, mentions: list.map(v => v.userJid) }, { quoted: m })
  }

  if (['off', 'unmute', 'buka'].includes(sub)) {
    if (!target) return m.reply(`❌ Tag atau reply orangnya.\nContoh: *${cmdDisplay} off @user*`)
    const ok = removeMute(m.chat, target)
    return conn.sendMessage(m.chat, {
      text: ok
        ? `🔊 @${target.split('@')[0]} udah dibuka bungkamnya.`
        : `⚠️ Orang itu gak lagi dibungkam.`,
      mentions: [target],
    }, { quoted: m })
  }

  if (['clear', 'reset'].includes(sub)) {
    const ok = clearMute(m.chat)
    return m.reply(ok ? '✅ Semua bungkam di grup ini udah dibersihin.' : '⚠️ Gak ada yang dibungkam.')
  }

  if (!target) {
    return m.reply(
      `🔇 *FITUR BUNGKAM*\n\n` +
      `• *${cmdDisplay} @user* — bungkam permanen\n` +
      `• *${cmdDisplay} @user 5m* — bungkam 5 menit\n` +
      `• *${cmdDisplay} @user 1h* — bungkam 1 jam\n` +
      `• *${cmdDisplay} @user 1d* — bungkam 1 hari\n` +
      `• *${cmdDisplay} off @user* — buka bungkam\n` +
      `• *${cmdDisplay} list* — daftar terbungkam\n` +
      `• *${cmdDisplay} clear* — hapus semua bungkam\n\n` +
      `_Setiap pesan dari user yang dibungkam akan otomatis dihapus tanpa jejak._`
    )
  }

  let durationMs = null
  let durLabel = 'permanen'
  const match = (args[1] || '').toLowerCase().match(/^(\d+)(s|m|h|d)$/)
  if (match) {
    durationMs = parseInt(match[1]) * DURASI[match[2]]
    durLabel = `${match[1]}${match[2]}`
  }

  addMute(m.chat, target, m.sender, durationMs)

  return conn.sendMessage(m.chat, {
    text: `🔇 @${target.split('@')[0]} udah dibungkam (${durLabel}).\n_Setiap pesannya akan otomatis dihapus._`,
    mentions: [target],
  }, { quoted: m })
}

handler.before = async (m, { conn }) => {
  try {
    if (!m.isGroup) return false
    if (m.fromMe || m.isCommand) return false

    const sender = m.sender || m.key?.participant
    if (!sender || !isMuted(m.chat, sender)) return false

    await dmsg(conn, m.chat, m.key?.id)
  } catch (e) {
    console.error('[bungkam before]', e?.message)
  }
  return false
}

handler.help = ['bungkam <@user> [durasi]']
handler.tags = ['group']
handler.command = /^(bungkam|mute|silent)$/i
handler.admin = true

export default handler