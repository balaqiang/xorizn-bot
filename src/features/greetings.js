/**
 * Event anggota grup: welcome, goodbye, notifikasi promote/demote.
 * Placeholder teks: @user @name @group @count @desc @number
 */
import bot from '../core/bot.js'
import logger from '../core/logger.js'
import { getGroup } from '../core/models.js'
import { participantPn, userPart } from '../core/jid.js'
import { renderCard } from './welcome-card.js'

const log = logger.child('welcome')

export function formatGreeting(template, { jid, name, groupName, count, desc }) {
  return String(template || '')
    .replace(/@user/g, `@${userPart(jid)}`)
    .replace(/@name/g, name || userPart(jid))
    .replace(/@number/g, userPart(jid))
    .replace(/@group/g, groupName || '')
    .replace(/@count/g, String(count ?? ''))
    .replace(/@desc/g, desc || '')
}

async function avatarUrl(sock, ...jids) {
  for (const j of jids.filter(Boolean)) {
    try {
      const url = await sock.profilePictureUrl(j, 'image')
      if (url) return url
    } catch {}
  }
  return null
}

/** Kirim welcome/goodbye untuk satu anggota (juga dipakai tombol "Tes" di dashboard). */
export async function sendGreeting(sock, groupJid, kind, participant, { metadata, preview = false } = {}) {
  const group = getGroup(groupJid)
  const settings = bot.settings
  const meta = metadata || (await bot.groupCache.get(sock, groupJid).catch(() => null))
  const jid = participantPn(participant)
  const lid = typeof participant === 'object' ? participant.lid || (participant.id?.endsWith('@lid') ? participant.id : '') : ''
  const user = bot.db.get('users', jid)
  const name = user?.name || userPart(jid)
  const vars = {
    jid,
    name,
    groupName: meta?.subject || group.name,
    count: meta?.participants?.length ?? meta?.size ?? 0,
    desc: meta?.desc || ''
  }
  const template = kind === 'welcome' ? group.welcomeText || settings.welcomeText : group.goodbyeText || settings.goodbyeText
  const caption = formatGreeting(template, vars)
  const mentions = [jid, lid].filter(Boolean)

  if (group.welcomeCard !== false) {
    try {
      const image = await renderCard(kind, {
        username: name,
        number: userPart(jid),
        groupName: vars.groupName,
        memberCount: vars.count,
        avatar: await avatarUrl(sock, jid, lid),
        background: group.cardBackground || settings.welcomeBackground,
        color: kind === 'welcome' ? settings.welcomeColor : settings.goodbyeColor
      })
      if (preview) return { image, caption }
      return sock.sendMessage(groupJid, { image, caption, mentions })
    } catch (err) {
      log.warn('gagal membuat kartu, kirim teks saja:', err.message)
    }
  }
  if (preview) return { image: null, caption }
  return sock.sendMessage(groupJid, { text: caption, mentions })
}

export async function onGroupParticipants(sock, ev) {
  const { id, participants = [], action, author } = ev
  bot.groupCache.applyParticipants(ev)
  const group = getGroup(id)
  const meIds = [sock.user?.id, sock.user?.lid].filter(Boolean).map(userPart)

  // Bot sendiri ditambahkan/dikeluarkan
  const selfHit = participants.some((p) => [p.id, p.lid, p.phoneNumber].filter(Boolean).map(userPart).some((u) => meIds.includes(u)))
  if (selfHit) {
    if (action === 'add') group.joinedAt = Date.now()
    bot.groupCache.allFetchedAt = 0
    bot.emit('groups')
    bot.db.save()
    if (action === 'remove') return
  }

  const meta = await bot.groupCache.get(sock, id).catch(() => null)
  if (meta?.subject) group.name = meta.subject

  for (const p of participants) {
    if ([p.id, p.lid, p.phoneNumber].filter(Boolean).map(userPart).some((u) => meIds.includes(u))) continue
    try {
      if (action === 'add' && group.welcome) await sendGreeting(sock, id, 'welcome', p, { metadata: meta })
      else if (action === 'remove' && group.goodbye) await sendGreeting(sock, id, 'goodbye', p, { metadata: meta })
      else if ((action === 'promote' || action === 'demote') && group.promoteNotify) {
        const jid = participantPn(p)
        const by = author ? ` oleh @${userPart(author)}` : ''
        await sock.sendMessage(id, {
          text: action === 'promote' ? `🎉 @${userPart(jid)} sekarang menjadi admin${by}.` : `📉 @${userPart(jid)} bukan admin lagi${by}.`,
          mentions: [jid, author].filter(Boolean)
        })
      }
    } catch (err) {
      log.error(`gagal mengirim ${action} di ${id}:`, err.message)
    }
  }
}
