/**
 * Shim "ruby-baileys".
 *
 * Paket asli `ruby-baileys` sudah ditarik dari npm (yang tersisa hanya versi 0.0.1-security),
 * jadi plugin Rubby diarahkan ke modul ini: semua ekspor Baileys resmi diteruskan apa adanya,
 * ditambah builder pesan interaktif (Button / ButtonV2 / Carousel), readRichMessage, dan AIRich
 * dengan API yang sama seperti yang dipakai plugin Rubby.
 */
import makeWASocket, {
  generateWAMessageFromContent,
  prepareWAMessageMedia
} from 'baileys'

export * from 'baileys'
export default makeWASocket

const BIZ_NODE = {
  tag: 'biz',
  attrs: {},
  content: [{
    tag: 'interactive',
    attrs: { type: 'native_flow', v: '1' },
    content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
  }]
}

const isUrl = (s) => typeof s === 'string' && /^https?:\/\//i.test(s)
const toMedia = (src) => (Buffer.isBuffer(src) ? src : isUrl(src) ? { url: src } : src)

async function relayInteractive(sock, jid, interactiveMessage, options = {}) {
  const content = {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage
      }
    }
  }
  const msg = generateWAMessageFromContent(jid, content, {
    userJid: sock.user?.id,
    quoted: options.quoted
  })
  await sock.relayMessage(jid, msg.message, {
    messageId: msg.key.id,
    additionalNodes: [BIZ_NODE, ...(options.additionalNodes || [])]
  })
  return msg
}

export class Button {
  constructor(sock) {
    this.sock = sock
    this.title = ''
    this.subtitle = ''
    this.body = ''
    this.footer = ''
    this.media = null
    this.thumbnail = null
    this.contextInfo = undefined
    this.buttons = []
    this._select = null
  }

  setTitle(v) { this.title = String(v ?? ''); return this }
  setSubtitle(v) { this.subtitle = String(v ?? ''); return this }
  setBody(v) { this.body = String(v ?? ''); return this }
  setFooter(v) { this.footer = String(v ?? ''); return this }
  setImage(src) { this.media = { type: 'image', src }; return this }
  setVideo(src) { this.media = { type: 'video', src }; return this }
  setDocument(src, mimetype = 'application/octet-stream', fileName = 'file') {
    this.media = { type: 'document', src, mimetype, fileName }
    return this
  }
  setThumbnail(buf) { if (buf) this.media = { type: 'image', src: buf }; return this }
  setRawThumbnail(buf) { this.thumbnail = buf; if (buf && !this.media) this.media = { type: 'image', src: buf }; return this }
  setContextInfo(ctx) { this.contextInfo = ctx; return this }

  addRawButton(btn) {
    if (btn?.name) {
      this.buttons.push({
        name: btn.name,
        buttonParamsJson: typeof btn.buttonParamsJson === 'string' ? btn.buttonParamsJson : JSON.stringify(btn.buttonParamsJson || {})
      })
    }
    return this
  }
  addButton(text, id) {
    return this.addRawButton({ name: 'quick_reply', buttonParamsJson: { display_text: String(text), id: String(id ?? text) } })
  }
  addReply(text, id) { return this.addButton(text, id) }
  addUrl(text, url) {
    return this.addRawButton({ name: 'cta_url', buttonParamsJson: { display_text: String(text), url, merchant_url: url } })
  }
  addCopy(text, code) {
    return this.addRawButton({ name: 'cta_copy', buttonParamsJson: { display_text: String(text), copy_code: String(code ?? '') } })
  }
  addCall(text, phone) {
    return this.addRawButton({ name: 'cta_call', buttonParamsJson: { display_text: String(text), phone_number: String(phone ?? '') } })
  }
  addSelection(title = 'Pilih') {
    this._select = { title: String(title), sections: [] }
    return this
  }
  makeSection(title = '', highlightLabel = '') {
    if (!this._select) this.addSelection()
    this._select.sections.push({ title: String(title), highlight_label: highlightLabel, rows: [] })
    return this
  }
  makeRow(header = '', title = '', description = '', id = '') {
    if (!this._select) this.addSelection()
    if (!this._select.sections.length) this.makeSection('')
    const section = this._select.sections[this._select.sections.length - 1]
    section.rows.push({ header: String(header), title: String(title), description: String(description), id: String(id) })
    return this
  }

  _allButtons() {
    const list = [...this.buttons]
    if (this._select) list.unshift({ name: 'single_select', buttonParamsJson: JSON.stringify(this._select) })
    return list
  }

  async _header() {
    const header = { title: this.title, subtitle: this.subtitle, hasMediaAttachment: false }
    if (!this.media?.src) return header
    try {
      const { type, src, mimetype, fileName } = this.media
      const payload = type === 'document' ? { document: toMedia(src), mimetype, fileName } : { [type]: toMedia(src) }
      const prepared = await prepareWAMessageMedia(payload, { upload: this.sock.waUploadToServer })
      return { ...header, hasMediaAttachment: true, ...prepared }
    } catch {
      return header
    }
  }

  async build() {
    return {
      header: await this._header(),
      body: { text: this.body },
      footer: { text: this.footer },
      nativeFlowMessage: { buttons: this._allButtons(), messageParamsJson: '' },
      ...(this.contextInfo ? { contextInfo: this.contextInfo } : {})
    }
  }

  async send(jid, options = {}) {
    try {
      return await relayInteractive(this.sock, jid, await this.build(), options)
    } catch (err) {
      // Cadangan: kirim sebagai teks biasa bila pesan interaktif ditolak
      const lines = [this.title && `*${this.title}*`, this.body, this.footer && `_${this.footer}_`].filter(Boolean)
      const ids = this._allButtons()
        .map((b) => { try { return JSON.parse(b.buttonParamsJson) } catch { return {} } })
        .filter((p) => p.display_text)
        .map((p) => `• ${p.display_text}${p.id ? ` → ${p.id}` : p.url ? ` → ${p.url}` : ''}`)
      return this.sock.sendMessage(jid, { text: [...lines, ...ids].join('\n\n') || String(err?.message || err) }, { quoted: options.quoted })
    }
  }
}

export class ButtonV2 extends Button {}

export class Carousel {
  constructor(sock) {
    this.sock = sock
    this.body = ''
    this.footer = ''
    this.cards = []
  }
  setBody(v) { this.body = String(v ?? ''); return this }
  setFooter(v) { this.footer = String(v ?? ''); return this }
  addCard(card) {
    for (const c of [].concat(card)) if (c) this.cards.push(c)
    return this
  }
  async send(jid, options = {}) {
    const cards = await Promise.all(this.cards.map((c) => (typeof c.build === 'function' ? c.build() : c)))
    try {
      return await relayInteractive(this.sock, jid, {
        body: { text: this.body },
        footer: { text: this.footer },
        carouselMessage: { cards, messageVersion: 1 }
      }, options)
    } catch {
      return this.sock.sendMessage(jid, { text: this.body || 'Carousel' }, { quoted: options.quoted })
    }
  }
}

/** Pesan teks + blok kode (dipakai sebagai global.AIRich oleh beberapa plugin). */
export class AIRich {
  constructor(sock) {
    this.sock = sock
    this.parts = []
  }
  addText(text) { this.parts.push(String(text ?? '')); return this }
  addCode(lang, code) { this.parts.push('```' + (code ?? '') + '```'); return this }
  async send(jid, options = {}) {
    return this.sock.sendMessage(jid, { text: this.parts.join('\n\n') }, { quoted: options.quoted })
  }
}

/** Ambil teks dari pesan "rich" (balasan AI / richResponse). Mengembalikan null bila bukan pesan rich. */
export function readRichMessage(input) {
  const msg = input?.message || input
  if (!msg || typeof msg !== 'object') return null
  const rich =
    msg.richResponseMessage ||
    msg.aiRichResponseMessage ||
    msg.botForwardedMessage?.message?.richResponseMessage
  if (!rich) return null
  const texts = []
  const walk = (node, depth = 0) => {
    if (!node || typeof node !== 'object' || depth > 8) return
    for (const [k, v] of Object.entries(node)) {
      if (k === 'text' && typeof v === 'string' && v.trim()) texts.push(v)
      else if (typeof v === 'object') walk(v, depth + 1)
    }
  }
  walk(rich)
  return texts.length ? { text: texts.join('\n'), raw: rich } : null
}
