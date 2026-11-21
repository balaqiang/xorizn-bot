// Port dari 'plugin baru' (eval.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const util = require('util')
const {exec} = require('child_process')
const {createRequire} = require('module')
const baileys = require('@whiskeysockets/baileys')

const _require = createRequire(__filename)

const {
  delay, generateWAMessageFromContent, prepareWAMessageMedia,
  generateWAMessage, areJidsSameUser, jidNormalizedUser,
  getContentType, downloadContentFromMessage, generateMessageID,
  makeCacheableSignalKeyStore, makeInMemoryStore, proto,
  WAMessageStubType, DisconnectReason, Browsers
} = baileys

let handler = async (m, { sock, reply, mess, command, text, usedPrefix }) => {
  const baseCommand = command.toLowerCase()

  let codeBody = text
  if (baseCommand === '>' || baseCommand === '$') {
    codeBody = m.text.slice(usedPrefix.length + baseCommand.length).trim()
  }
  if (!codeBody && m.quoted?.text) {
    codeBody = m.quoted.text.trim()
  }

  const transformCode = (code) => {
    code = code.replace(
      /import\s+(\w+)\s+from\s+['"](.+?)['"]/g,
      `const $1 = await import('$2').then(m => m.default ?? m)`
    )
    
    code = code.replace(
      /import\s+\{([^}]+)\}\s+from\s+['"](.+?)['"]/g,
      `const {$1} = await import('$2')`
    )

    code = code.replace(
      /import\s+\*\s+as\s+(\w+)\s+from\s+['"](.+?)['"]/g,
      `const $1 = await import('$2')`
    )

    code = code.replace(/\brequire\s*\(/g, `_require(`)
    return code
  }

  switch (baseCommand) {
    case 'ambilq':
    case 'q': {
      try {
        if (!m.quoted) return reply(`Ex: ${usedPrefix}q (reply pesannya)`)
        const output = util.inspect(m.quoted, { depth: 5 })
        await sock.sendMessage(m.chat, { text: output }, { quoted: m })
      } catch (err) {
        await sock.sendMessage(m.chat, { text: util.format(err) }, { quoted: m })
      }
      break
    }

    case 'eval': {
      try {
        const code = transformCode(codeBody)
        if (!code) return reply(`Ex: ${usedPrefix}eval [kode] atau reply pesan kode`)

        const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
        const fn = new AsyncFunction(
          'sock', 'm', 'reply', 'text', 'mess', 'util', 'usedPrefix', '_require',
          'delay', 'generateWAMessageFromContent', 'prepareWAMessageMedia',
          'generateWAMessage', 'areJidsSameUser', 'jidNormalizedUser',
          'getContentType', 'downloadContentFromMessage', 'generateMessageID',
          'proto', 'WAMessageStubType', 'DisconnectReason', 'Browsers',
          code
        )
        const result = await fn(
          sock, m, reply, text, mess, util, usedPrefix, _require,
          delay, generateWAMessageFromContent, prepareWAMessageMedia,
          generateWAMessage, areJidsSameUser, jidNormalizedUser,
          getContentType, downloadContentFromMessage, generateMessageID,
          proto, WAMessageStubType, DisconnectReason, Browsers
        )

        const output = typeof result === 'string' ? result : util.inspect(result)
        await sock.sendMessage(m.chat, { text: output }, { quoted: m })
      } catch (err) {
        await sock.sendMessage(m.chat, { text: util.format(err) }, { quoted: m })
      }
      break
    }

    case '>': {
      try {
        const code = transformCode(codeBody)
        if (!code) return reply(`Ex: ${usedPrefix}> kodenya`)

        let result = await (async () => eval(code))()
        if (typeof result !== 'string') result = util.inspect(result)

        await sock.sendMessage(m.chat, { text: result }, { quoted: m })
      } catch (err) {
        await sock.sendMessage(m.chat, { text: util.format(err) }, { quoted: m })
      }
      break
    }

    case '$': {
      if (!codeBody) return reply(`Ex: ${usedPrefix}$ command nya`)
      exec(codeBody, (err, stdout, stderr) => {
        const out = err?.toString() || stdout || stderr || 'Done (No output)'
        sock.sendMessage(m.chat, { text: util.format(out) }, { quoted: m })
      })
      break
    }
  }
}

handler.command = ['ambilq', 'q', 'eval', '>', '$']
handler.owner = true
handler.noJadiBot = true
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "owner", "mainOnly": true})
