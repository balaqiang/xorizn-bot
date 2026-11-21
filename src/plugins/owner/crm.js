module.exports = {
  name: 'crm',
  command: ['crm'],
  category: 'owner',
  owner: true,
  desc: 'Buat file CRM relay dari pesan reply',
  run: async ({ sock, msg, args, prefix, reply, isOwner }) => {
    const m = msg
    const conn = sock
    const from = msg.key.remoteJid
    const usedPrefix = prefix
    const command = 'crm'

    // =========================
    // CEK OWNER (status owner dari handler bot; flag owner: true juga sudah memblokir non-owner)
    // =========================
    if (!isOwner) {
      return reply('Fitur ini khusus owner bot.')
    }

    // =========================
    // CEK REPLY
    // =========================
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ? { message: m.message.extendedTextMessage.contextInfo.quotedMessage, key: { id: m.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, participant: m.message.extendedTextMessage.contextInfo.participant } }
      : null

    // kalau lu pakai lib yang sudah ada m.quoted
    const q = msg.quoted || quoted
    if (!q) {
      return reply(`Reply pesan target dulu, lalu kirim *${usedPrefix}${command}* ya kak~ 🌸`)
    }

    // =========================
    // CEK VIEW ONCE
    // =========================
    function crmHasViewOnce(obj, visited = new WeakSet()) {
      if (!obj || typeof obj !== 'object') return false
      if (visited.has(obj)) return false
      visited.add(obj)
      if (obj.viewOnceMessage || obj.viewOnceMessageV2 || obj.viewOnceMessageV2Extension) {
        return true
      }
      for (const value of Object.values(obj)) {
        if (crmHasViewOnce(value, visited)) return true
      }
      return false
    }

    if (crmHasViewOnce(q)) {
      return reply('❌ Pesan view-once tidak bisa disimpan.')
    }

    // =========================
    // BUAT CRM
    // =========================
    try {
      const crmPayload = JSON.parse(JSON.stringify(q))

      const crmData = {
        type: 'bot-crm-relay',
        version: 1,
        createdAt: new Date().toISOString(),
        creator: global.botname || 'xorizn-bot',
        payload: crmPayload
      }

      const crmCode = `module.exports = ${JSON.stringify(crmData, null, 2)};\n`

      // =========================
      // KIRIM FILE
      // =========================
      await sock.sendMessage(from, {
        document: Buffer.from(crmCode),
        mimetype: 'application/javascript',
        fileName: 'relay.js',
        caption: `✅ *CRM berhasil dibuat*\n\nReply file ini lalu kirim:\n*${usedPrefix}runcrm*`
      }, { quoted: m })

      // =========================
      // REACTION
      // =========================
      await sock.sendMessage(from, {
        react: {
          text: '✅',
          key: m.key
        }
      })
    } catch (e) {
      console.error('CRM ERROR:', e)
      try {
        if (typeof global.sendAdminLog === 'function') {
          await global.sendAdminLog(conn, 'crm', m.sender?.split('@')[0] || m.sender, e)
        }
      } catch {}
      return reply('❌ Gagal membuat CRM.\n\n' + (e?.message || String(e)))
    }
  }
}
