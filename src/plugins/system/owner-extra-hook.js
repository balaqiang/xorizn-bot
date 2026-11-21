// Hook owner: banchat, autoread, autotyping, anticall
const st = require('../../lib/ownerx')
const seen = new WeakSet()

module.exports = {
  name: 'owner-extra-hook',
  hook: true,
  init(sock) {
    if (seen.has(sock)) return
    seen.add(sock)
    sock.ev.on('call', async (calls) => {
      if (!st.data.anticall) return
      for (const c of calls || []) {
        if (c.status !== 'offer') continue
        try {
          await sock.rejectCall(c.id, c.from)
          await sock.sendMessage(c.from, { text: '📵 Maaf, bot tidak menerima panggilan. Silakan chat saja ya.' })
        } catch (e) { console.log('[ANTICALL]', e.message) }
      }
    })
  },
  async passive({ sock, msg, from, body, prefix, isOwner }) {
    const isCmd = !!body && body.startsWith(prefix)
    if (!isOwner && isCmd && st.data.banchat.includes(from)) return true
    if (!msg.key.fromMe) {
      if (st.data.autoread) sock.readMessages([msg.key]).catch(() => {})
      if (st.data.autotyping && isCmd) sock.sendPresenceUpdate('composing', from).catch(() => {})
    }
    return false
  }
}
