import fs from 'fs'
import { createTotalChatCard } from '../../lib/canvas-totalchat.js'

const dbPath = './engine/lumen/lib/chat.json'

const loadDB = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath))
  } catch {
    return {}
  }
}

const metadataCache = new Map()

const getGroupMeta = async (conn, jid) => {
  try {
    const cache = metadataCache.get(jid)
    if (cache && Date.now() - cache.time < 300000) return cache.data

    const meta = await conn.groupMetadata(jid)
    metadataCache.set(jid, { data: meta, time: Date.now() })
    return meta
  } catch (e) {
    console.log('Metadata Error:', e)
    return { participants: [], subject: 'Group Chat' }
  }
}

const cleanJid = jid => {
  if (!jid) return ''
  if (typeof jid !== 'string') jid = String(jid)
  return jid.replace(/:\d+@/g, '@')
}

const jidNum = jid => cleanJid(jid).split('@')[0].replace(/\D/g, '')

const isRealJid = jid => {
  jid = cleanJid(jid)
  return jid.endsWith('@s.whatsapp.net') && /^\d+$/.test(jidNum(jid))
}

const getRealJid = p => {
  const list = [
    p?.jid,
    p?.phoneNumber,
    p?.participant
  ].map(cleanJid)

  return list.find(isRealJid) || ''
}

const getLidJid = p => cleanJid(p?.id || p?.lid || '')

const sameUser = (a, b) => {
  a = jidNum(a)
  b = jidNum(b)
  return a && b && a === b
}

const findCount = (counts, ...jids) => {
  for (const key in counts) {
    for (const jid of jids) {
      if (sameUser(key, jid)) return counts[key] || 0
    }
  }
  return 0
}

let handler = async (m, { conn, sock, reply }) => {
  const client = conn || sock
  if (!m.isGroup) return reply('🍓 Fitur ini hanya dapat digunakan di dalam grup!')

  try {
    if (typeof global.react === 'function') await global.react(client, m, 'loading')
    const db = loadDB()

    if (!db[m.chat]) {
      return reply('Belum ada data pesan tercatat di database grup ini.')
    }

    const meta = await getGroupMeta(client, m.chat)
    const participants = meta.participants || []
    const counts = db[m.chat] || {}

    let data = []

    for (const p of participants) {
      const realJid = getRealJid(p)
      const lidJid = getLidJid(p)

      if (!realJid) continue

      data.push({
        jid: realJid,
        number: jidNum(realJid),
        total: findCount(counts, realJid, lidJid)
      })
    }

    data.sort((a, b) => b.total - a.total)

    const totalPesan = data.reduce((a, b) => a + b.total, 0)
    const top10 = data.slice(0, 10)

    // Fetch group avatar and member info in parallel
    const [groupPpUrl, ...topUsersData] = await Promise.all([
      (async () => {
        try {
          return client.profilePictureUrl ? await client.profilePictureUrl(m.chat, 'image').catch(() => null) : null
        } catch {
          return null
        }
      })(),
      ...top10.map(async (u, idx) => {
        let name = null
        try {
          name = client.getName ? await client.getName(u.jid) : null
        } catch {}
        if (!name && global.db?.data?.users?.[u.jid]?.name) {
          name = global.db.data.users[u.jid].name
        }
        let ppUrl = null
        try {
          ppUrl = client.profilePictureUrl ? await client.profilePictureUrl(u.jid, 'image').catch(() => null) : null
        } catch {}

        return {
          rank: idx + 1,
          push_name: name || `User ${u.number.slice(-4)}`,
          sender_number: u.number,
          count: u.total,
          ppUrl
        }
      })
    ])

    const canvasBuffer = await createTotalChatCard({
      groupName: meta.subject || 'Group Chat',
      groupPpUrl,
      totalChats: totalPesan,
      topUsers: topUsersData
    }).catch(err => {
      console.error('[TOTALCHAT CANVAS ERROR]', err)
      return null
    })

    let caption = `📊 *LEADERBOARD TOTAL CHAT* 📊\n\n`
    caption += `🏢 *Grup:* ${meta.subject || 'Group'}\n`
    caption += `💬 *Total Chat Grup:* *${totalPesan.toLocaleString('id-ID')}* pesan\n`
    caption += `👥 *Total Member:* ${participants.length} orang\n\n`
    caption += `🏆 *Top 1 - 10 Chatter:* Tertera pada gambar leaderboard 16:9 di atas! ✨\n`

    const mentions = []
    if (data.length > 10) {
      caption += `\n📜 *Rank 11 - Seterusnya:*\n`
      for (let i = 10; i < Math.min(data.length, 35); i++) {
        mentions.push(data[i].jid)
        caption += `• *#${i + 1}* @${data[i].number} ⋯ *${data[i].total.toLocaleString('id-ID')}* pesan\n`
      }
      if (data.length > 35) {
        caption += `\n_...dan ${data.length - 35} member lainnya._`
      }
    }

    if (canvasBuffer) {
      await client.sendMessage(
        m.chat,
        {
          image: canvasBuffer,
          caption: caption.trim(),
          mentions
        },
        { quoted: m }
      )
    } else {
      await client.sendMessage(
        m.chat,
        {
          text: caption.trim(),
          mentions
        },
        { quoted: m }
      )
    }

    if (typeof global.react === 'function') await global.react(client, m, 'success')

  } catch (e) {
    console.error('[TOTALPESAN ERROR]', e)
    if (typeof global.react === 'function') await global.react(client, m, 'error')
    reply('Error saat membuat leaderboard total chat.')
  }
}

handler.help = ['totalpesan']
handler.tags = ['group', 'info']
handler.command = /^(totalpesan|totalchat)$/i
handler.group = true
handler.admin = true
handler.register = false

export default handler