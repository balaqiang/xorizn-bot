/**
 * Auto-respon kata kunci. Disimpan per grup (group.autoResponses) dan global (settings.autoResponses).
 * Format item: { trigger: 'halo', response: 'Halo juga @user', exact: true }
 */
import bot from '../core/bot.js'
import { userPart } from '../core/jid.js'

function match(item, text) {
  const t = String(text || '').trim().toLowerCase()
  const trig = String(item.trigger || '').trim().toLowerCase()
  if (!trig) return false
  return item.exact === false ? t.includes(trig) : t === trig
}

export async function autoRespond(sock, m, group) {
  if (!m.text) return false
  const list = [...(group?.autoResponses || []), ...(bot.settings.autoResponses || [])]
  const hit = list.find((item) => match(item, m.text))
  if (!hit) return false
  const text = String(hit.response || '')
    .replace(/@user/g, `@${userPart(m.sender)}`)
    .replace(/@name/g, m.pushName || '')
  await m.reply({ text, mentions: [m.sender] })
  return true
}
