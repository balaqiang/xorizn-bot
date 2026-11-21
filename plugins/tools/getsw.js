// Port dari 'plugin baru' (getsw.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
let handler = async (m, { sock }) => {
  let ctx = m.message?.[m.mtype]?.contextInfo
  let quotedMsg = ctx?.quotedMessage

  if (!quotedMsg) {
    return m.reply('Reply status/story nya')
  }

  try {
    let type = Object.keys(quotedMsg)[0]
    let content = quotedMsg

    if (type === 'groupStatusMessageV2') {
      content = quotedMsg[type].message
      type = Object.keys(content)[0]
    }

    if (content?.[type]?.contextInfo) {
      delete content[type].contextInfo
    }

    await sock.relayMessage(m.chat, content, {})
    m.reply('Berhasil mengambil story')
  } catch (e) {
    console.error(e)
    m.reply('Gagal mengambil story\n\n' + e.message)
  }
}

handler.command = ['getsw', 'gsw']

module.exports = S.wrap(handler, {"category": "tools"})
