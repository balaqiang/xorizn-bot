// lib/ztsend.js — memasang helper pengirim vanXone ASLI (engine/lib/wraper-send/*) ke sock vanXone.
// sock.sendButtons / sendMessage({ buttons }) / sendProductList / sendLinkPreview / createAIRich dst. = kode vanXone apa adanya.
'use strict'

const path = require('path')
const { pathToFileURL } = require('url')

const dir = path.join(__dirname, '..', '..', 'engine', 'pulse', 'lib', 'wraper-send')
const load = (f) => import(pathToFileURL(path.join(dir, f)).href)

let mods = null
async function install(sock) {
  if (sock.__ztSend) return sock
  if (!mods) {
    const [b, a, r] = await Promise.all([load('buttons-send.js'), load('a2ui-send.js'), load('rich-send.js')])
    mods = { b, a, r }
  }
  if (!sock.db) {
    const polls = {}
    sock.db = { getPollCommands: () => polls, saveDatabase: () => {} }
  }
  mods.b.makeButtonsHelper(sock)
  mods.a.makeA2UIHelper(sock)
  mods.r.makeRichHelper(sock)
  // plugin vanXone memakai { interactiveButtons: [...] } (fork baileys lain) -> diteruskan ke format tombol vanXone
  const zt = sock.sendMessage.bind(sock)
  sock.sendMessage = (jid, content, options) => {
    if (content && Array.isArray(content.interactiveButtons) && !content.buttons) {
      const { interactiveButtons, caption, ...rest } = content
      content = { ...rest, ...(rest.text === undefined && caption !== undefined ? { text: caption } : {}), buttons: interactiveButtons }
    }
    // pesan daftar gaya fork lain: { text, title, buttonText, sections } -> tombol list vanXone
    if (content && Array.isArray(content.sections) && content.buttonText && !content.buttons && !content.listMessage) {
      const { sections, buttonText, ...rest } = content
      content = { ...rest, buttons: [{ title: buttonText, sections, icon: 'NONE' }] }
    }
    return zt(jid, content, options)
  }
  sock.__ztSend = true
  return sock
}

module.exports = { install }
