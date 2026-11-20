// Port dari 'plugin baru' (convert_idch.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const handler = async (m, { sock, text, usedPrefix, command }) => {
  let idch = ''

  if (text) {
    const match = text.match(/\d+@newsletter/)
    if (match) idch = match[0]
  } else if (m.quoted) {
    const q = m.quoted.text || m.quoted.caption || ''
    const match = q.match(/\d+@newsletter/)
    if (match) idch = match[0]
  }

  if (!idch || !idch.match(/^\d+@newsletter$/)) {
    return m.reply(`ex: ${usedPrefix + command} xxxx@newsletter\natau reply pesan yang mengandung newsletter id`)
  }

  try {
    const meta = await sock.newsletterMetadata("jid", idch)
    const invite = meta.thread_metadata.invite
    const name = meta.thread_metadata.name?.text || 'Unknown'
    const subs = meta.thread_metadata.subscribers_count || '0'
    const link = `https://whatsapp.com/channel/${invite}`

    m.reply(`*channel info*\n\n- name: ${name}\n- followers: ${subs}\n- ID: ${idch}\n- link: ${link}`)
  } catch (e) {
    m.reply(`*ERROR!*\n\n${e.message}`)
  }
}

handler.command = ['cvidch', 'cidch']
handler.limit = true;

module.exports = S.wrap(handler, {"category": "channel"})
