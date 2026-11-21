// plugins/pinlive.js
// Pinterest Live Search
// ESM Plugin
// Sumber  :  https://whatsapp.com/channel/0029VbDvzjlDzgTJY34zxT1H

'use strict'

import {
    pinterest,
    createHTML,
    DEFAULT_COUNT,
    MAX_COUNT
} from '../../lib/scrape/pinlive.js';

async function sendHTML(conn, chat, html, query, m) {
    try {
        const messageContent = {
            aiRichMessage: {
                template: {
                    body: {
                        text: `Pinterest Search: ${query}`
                    },
                    header: {
                        title: '📌 PinLive Gallery',
                        subtitle: 'vanXone Edition • Pinterest Live'
                    }
                },
                buttonParamsJson: JSON.stringify({
                    display_text: 'Buka PinLive',
                    url: 'about:blank'
                }),
                nativeFlowMessage: {
                    messageParamsJson: JSON.stringify({
                        html: html
                    })
                }
            }
        }

        if (typeof conn.generateWAMessageFromContent === 'function') {
            const constWAMessage = await conn.generateWAMessageFromContent(chat, messageContent, { quoted: m })
            await conn.relayMessage(chat, constWAMessage.message, { messageId: constWAMessage.key.id })
            return true
        }

        await conn.relayMessage(chat, messageContent, { messageId: `${Date.now()}` })
        return true

    } catch (error) {
        console.error('[PINLIVE SEND ERROR]', error?.message || error)
        return false
    }
}

// ============================================================
// HANDLER
// ============================================================

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text?.trim()) {
        return m.reply(
`📌 *PinLive*

Cari gambar Pinterest dalam viewer HTML.

*Penggunaan:*
${usedPrefix + command} <query> <jumlah>

*Contoh:*
${usedPrefix + command} ryo yamada
${usedPrefix + command} vanXone forger 20
${usedPrefix + command} anime wallpaper 30

✨ Hasil bisa di-scroll sampai bawah.`
        )
    }

    let input = text.trim()
    let count = DEFAULT_COUNT

    const match = input.match(/\s+(\d+)\s*$/)
    if (match) {
        count = parseInt(match[1], 10)
        input = input.slice(0, match.index).trim()
    }

    if (!input) {
        return m.reply(`Query Pinterest-nya mana? 🤔`)
    }

    if (!Number.isFinite(count) || count < 1) {
        count = DEFAULT_COUNT
    }
    count = Math.min(count, MAX_COUNT)

    await m.reply(`📌 *PinLive*\n\n🔎 Mencari *${input}*...\n⏳ Tunggu sebentar yaa~`)

    try {
        const results = await pinterest(input, count)

        if (!results.length) {
            return m.reply(
`❌ *Tidak ada hasil.*

Query: ${input}

Coba kata kunci lain yaa~`
            )
        }

        const html = createHTML(input, results)

        const sent = await sendHTML(
            conn,
            m.chat,
            html,
            input,
            m
        )

        if (!sent) {
            return m.reply(
`⚠️ *PinLive gagal dibuka.*

Pinterest berhasil mendapatkan ${results.length} gambar, tetapi fitur Airich response gagal merespons.`
            )
        }

    } catch (error) {
        console.error('[PINLIVE ERROR]', error)
        return m.reply(
`❌ *Terjadi kesalahan.*

Pinterest sedang tidak bisa diakses atau responsnya berubah.
Coba beberapa saat lagi yaa~`
        )
    }
}

// ============================================================
// COMMAND CONFIG
// ============================================================

handler.help = ['pinlive <query> <jumlah>']
handler.tags = ['search']
handler.command = ['pinlive', 'pinlive2']
handler.limit = true
handler.register = true

export default handler