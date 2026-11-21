// Port dari 'plugin baru' (upch.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const path = require('path')
const {fileURLToPath} = require('url')


let handler = async (m, { sock, text }) => {
  const { prepareWAMessageMedia, generateMessageIDV2, proto } = await import('@whiskeysockets/baileys')

  let node

  if (m.quoted) {
    const mime = m.quoted.mimetype || ''
    const buffer = await m.quoted.download()
    const caption = text || '' 

    if (mime.startsWith('image')) {
      const mediaObj = { image: buffer }
      if (caption) mediaObj.caption = caption

      const msg = await prepareWAMessageMedia(mediaObj, { upload: sock.waUploadToServer, jid: '@newsletter' })
      node = buildNode(global.idch, generateMessageIDV2(), 'image', proto.Message.encode(msg).finish())

    } else if (mime.startsWith('video')) {
      const mediaObj = { video: buffer }
      if (caption) mediaObj.caption = caption

      const msg = await prepareWAMessageMedia(mediaObj, { upload: sock.waUploadToServer, jid: '@newsletter' })
      node = buildNode(global.idch, generateMessageIDV2(), 'video', proto.Message.encode(msg).finish())

    } else if (mime.startsWith('audio')) {
      const waveform = Buffer.from(Array.from({ length: 100 }, () => Math.floor(Math.random() * 100)))
      const msg = await prepareWAMessageMedia(
        { audio: buffer, mimetype: 'audio/ogg; codecs=opus', ptt: true, waveform },
        { upload: sock.waUploadToServer, jid: '@newsletter' }
      )
      node = buildNode(global.idch, generateMessageIDV2(), 'audio', proto.Message.encode(msg).finish())

    } else {
      // reply text biasa
      const txt = text || m.quoted.text || ''
      const msg = proto.Message.encode({ extendedTextMessage: { text: txt } }).finish()
      node = buildNode(global.idch, generateMessageIDV2(), 'text', msg)
    }

  } else if (text) {
    // text only
    const msg = proto.Message.encode({ extendedTextMessage: { text } }).finish()
    node = buildNode(global.idch, generateMessageIDV2(), 'text', msg)

  } else {
    return m.reply('Kirim teks, atau reply ke foto/video/audio (bisa dengan caption)')
  }

  await sock.query(node)
  const meta = await sock.newsletterMetadata("jid", global.idch)
  const link = `https://whatsapp.com/channel/${meta.thread_metadata.invite}`

  m.reply(`*up channel succes!*\n\n> result cek di: ${link}`)
}

function buildNode(to, id, contenttype, content) {
  return {
    tag: 'message',
    attrs: { to, id, type: 'media' },
    content: [
      { tag: 'meta', attrs: { contenttype } },
      { tag: 'plaintext', attrs: { mediatype: contenttype }, content }
    ]
  }
}

handler.command = ['upch']
handler.owner = true
handler.noJadiBot = true
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "channel"})
