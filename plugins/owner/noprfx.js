// Port dari 'plugin baru' (noprefix-owner.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const handler = async (m, { reply, args, usedPrefix, command, botSet, setNoPrefix }) => {
  const mode = (args[0] || '').toLowerCase()

  if (!['on', 'off'].includes(mode)) {
    return reply(`Example ${usedPrefix + command} on/off

Jika mode on bot dapat digunakan tanpa prefix (khususnya untuk owner)`)
  }

  const now = setNoPrefix(mode === 'on')
  reply(`No prefix ${now ? '*aktif*' : '*nonaktif*'}\n${now ? 'Owner bisa kirim command tanpa prefix' : 'User wajib pakai prefix!.'}`)
}

handler.command = ['noprfx']
handler.owner = true

module.exports = S.wrap(handler, {"category": "owner"})
