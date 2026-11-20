/**
 * Mengubah WAMessage mentah menjadi objek `m` yang mudah dipakai plugin native.
 */
import { normalizeMessageContent, getContentType, downloadMediaMessage, jidNormalizedUser, isLidUser } from 'baileys'
import { resolvePn, rememberLid } from './jid.js'
import bot from './bot.js'

const MEDIA_TYPES = new Set(['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage', 'ptvMessage'])

/** Ambil teks/caption/id tombol dari isi pesan yang sudah dinormalisasi. */
export function extractText(content) {
  if (!content) return ''
  const flow = content.interactiveResponseMessage?.nativeFlowResponseMessage
  if (flow?.paramsJson) {
    try {
      const p = JSON.parse(flow.paramsJson)
      const id = p.id || p.selectedId || p.row_id || p.rowId
      if (id) return String(id)
    } catch {}
  }
  return (
    content.conversation ||
    content.extendedTextMessage?.text ||
    content.imageMessage?.caption ||
    content.videoMessage?.caption ||
    content.documentMessage?.caption ||
    content.buttonsResponseMessage?.selectedButtonId ||
    content.listResponseMessage?.singleSelectReply?.selectedRowId ||
    content.templateButtonReplyMessage?.selectedId ||
    content.interactiveResponseMessage?.body?.text ||
    content.pollCreationMessage?.name ||
    content.pollCreationMessageV3?.name ||
    content.eventMessage?.name ||
    ''
  )
}

function mediaDownloader(sock, msg) {
  return () =>
    downloadMediaMessage(msg, 'buffer', {}, { logger: undefined, reuploadRequest: sock.updateMediaMessage })
}

export async function serialize(sock, raw) {
  const key = raw.key || {}
  const chat = jidNormalizedUser(key.remoteJid) || key.remoteJid || ''
  const isGroup = chat.endsWith('@g.us')
  const fromMe = !!key.fromMe

  // ---- Pengirim: utamakan nomor telepon (PN) agar cocok dengan daftar owner/premium ----
  let senderRaw
  let senderAlt
  if (isGroup) {
    senderRaw = key.participant || raw.participant || ''
    senderAlt = key.participantAlt || ''
  } else {
    senderRaw = fromMe ? sock.user?.id || '' : chat
    senderAlt = fromMe ? '' : key.remoteJidAlt || ''
  }
  if (fromMe) senderRaw = sock.user?.id || senderRaw
  let sender = jidNormalizedUser(senderRaw) || senderRaw
  let senderLid = ''
  if (isLidUser(sender)) {
    senderLid = sender
    if (senderAlt && !isLidUser(senderAlt)) {
      sender = jidNormalizedUser(senderAlt)
      rememberLid(senderLid, sender)
    } else {
      sender = await resolvePn(sock, sender)
    }
  } else if (senderAlt && isLidUser(senderAlt)) {
    senderLid = jidNormalizedUser(senderAlt)
    rememberLid(senderLid, sender)
  }

  const content = normalizeMessageContent(raw.message) || {}
  const type = getContentType(content) || ''
  const node = content[type] || {}
  const text = extractText(content)
  const contextInfo = node?.contextInfo || null

  const m = {
    raw,
    key,
    id: key.id,
    chat,
    isGroup,
    fromMe,
    sender,
    senderLid,
    pushName: raw.pushName || '',
    timestamp: Number(raw.messageTimestamp || 0) * 1000,
    message: content,
    type,
    msg: node,
    text,
    body: text,
    mimetype: node?.mimetype || '',
    isMedia: MEDIA_TYPES.has(type),
    mentionedJid: [],
    quoted: null
  }

  m.mentionedJid = await Promise.all((contextInfo?.mentionedJid || []).map((j) => resolvePn(sock, j)))

  if (contextInfo?.quotedMessage) {
    const qContent = normalizeMessageContent(contextInfo.quotedMessage) || {}
    const qType = getContentType(qContent) || ''
    const qNode = qContent[qType] || {}
    const qSenderRaw = contextInfo.participant || (isGroup ? '' : chat)
    const qSender = await resolvePn(sock, qSenderRaw)
    const qKey = {
      remoteJid: chat,
      id: contextInfo.stanzaId,
      fromMe: qSender ? jidNormalizedUser(qSender) === jidNormalizedUser(sock.user?.id) : false,
      participant: isGroup ? contextInfo.participant : undefined
    }
    const qMsg = { key: qKey, message: contextInfo.quotedMessage }
    m.quoted = {
      key: qKey,
      id: contextInfo.stanzaId,
      sender: qSender,
      fromMe: qKey.fromMe,
      type: qType,
      message: qContent,
      msg: qNode,
      text: extractText(qContent),
      mimetype: qNode?.mimetype || '',
      isMedia: MEDIA_TYPES.has(qType),
      raw: qMsg,
      download: mediaDownloader(sock, qMsg),
      delete: () => sock.sendMessage(chat, { delete: qKey })
    }
  }

  m.download = mediaDownloader(sock, raw)

  /** Balas pesan: string → teks; objek → konten Baileys apa adanya. */
  m.reply = (content, options = {}) => {
    const payload = typeof content === 'string' || typeof content === 'number' ? { text: String(content) } : content
    if (payload.text && !payload.mentions) {
      const tags = [...String(payload.text).matchAll(/@(\d{5,16})/g)].map((x) => `${x[1]}@s.whatsapp.net`)
      if (tags.length) payload.mentions = tags
    }
    return sock.sendMessage(chat, payload, { quoted: raw, ...options })
  }
  m.react = (emoji) => sock.sendMessage(chat, { react: { text: emoji, key } }).catch(() => {})
  m.delete = () => sock.sendMessage(chat, { delete: key })

  bot.runtime.messages++
  return m
}
