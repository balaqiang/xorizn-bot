// plugins/channel-status.mjs
// Channel Status Manager — Post, React, Revoke, List
// Based on @whiskeysockets/baileys

import fs from 'node:fs'
import sharp from 'sharp'

// ============================================================
// CONSTANTS
// ============================================================

// Ganti ke ID saluran Tuan
const DEFAULT_CHANNEL = global.channelJid

// ============================================================
// HELPERS
// ============================================================

function formatDuration(sec) {
    sec = parseInt(sec) || 0
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return h > 0
        ? `${h}j ${m}m ${s}s`
        : m > 0
            ? `${m}m ${s}s`
            : `${s}s`
}

function timeAgo(ts) {
    if (!ts) return '-'
    const sec = Math.floor(Date.now() / 1000 - ts)
    if (sec < 60) return `${sec}s lalu`
    if (sec < 3600) return `${Math.floor(sec / 60)}m lalu`
    if (sec < 86400) return `${Math.floor(sec / 3600)}j lalu`
    return `${Math.floor(sec / 86400)}h lalu`
}

// ============================================================
// HANDLER
// ============================================================

let handler = async (m, {
    conn,
    text,
    command,
    usedPrefix
}) => {
    const cmd = (command || '').toLowerCase()

    // ============================================================
    // .cs — Posting Status Channel
    // ============================================================
    if (cmd === 'cs' || cmd === 'channelstatus') {
        if (!text) {
            return m.reply(
                `📌 *Channel Status Manager*\n\n` +
                `*Posting:*\n` +
                `• \`${usedPrefix}cs <teks>\` — text\n` +
                `• Reply/kirim gambar + \`${usedPrefix}cs <caption>\`\n` +
                `• Reply/kirim video + \`${usedPrefix}cs <caption>\`\n\n` +
                `*Fitur lain:*\n` +
                `• \`${usedPrefix}cscheck\` — cek izin posting\n` +
                `• \`${usedPrefix}cslist\` — list status\n` +
                `• \`${usedPrefix}csreact <id> <emoji>\` — react\n` +
                `• \`${usedPrefix}csrevoke <id>\` — hapus status\n\n` +
                `*Contoh:*\n` +
                `• \`${usedPrefix}cs Halo semua! 🌸\`\n` +
                `• Reply gambar: \`${usedPrefix}cs Promo hari ini\``
            )
        }

        // Cek izin dulu
        try {
            const check = await conn.newsletterCanPostStatus(DEFAULT_CHANNEL)
            if (!check?.canPost) {
                return m.reply(
                    `❌ *Saluran gak punya izin Channel Status*\n\n` +
                    `📋 Capabilities: ${JSON.stringify(check?.capabilities || {}, null, 2)}\n\n` +
                    `💡 Mungkin:\n` +
                    `• Saluran belum di-grant WhatsApp\n` +
                    `• Bot bukan admin saluran\n` +
                    `• Fitur belum rollout di region ini`
                )
            }
        } catch (e) {
            console.error('[CS] cek izin:', e)
        }

        try {
            // Cek media di-reply atau dikirim
            const q = m.quoted || m
            const hasImage = q?.message?.imageMessage
            const hasVideo = q?.message?.videoMessage
            const hasAudio = q?.message?.audioMessage
            const hasGif = q?.message?.videoMessage?.gifPlayback

            let payload = {}
            let mediaType = 'text'

            if (hasImage) {
                const buffer = await q.download()
                payload = { image: buffer, caption: text }
                mediaType = 'image'
            } else if (hasVideo) {
                const buffer = await q.download()
                payload = { video: buffer, caption: text }
                mediaType = hasGif ? 'gif' : 'video'
            } else if (hasAudio) {
                const buffer = await q.download()
                payload = { audio: buffer }
                mediaType = 'audio'
            } else {
                payload = { text }
            }

            // Kirim status
            const posted = await conn.sendNewsletterStatus(DEFAULT_CHANNEL, payload)

            let out = `✅ *Channel Status Terkirim!*\n\n`
            out += `📝 *Tipe:* ${mediaType}\n`
            out += `🆔 *Server ID:* ${posted?.newsletterStatusServerId || 'pending'}\n`
            out += `📅 *Waktu:* ${new Date().toLocaleString('id-ID')}\n`
            out += `⏰ *Expired:* 24 jam\n\n`

            if (posted?.newsletterStatusServerId) {
                out += `💡 *Simpan ID ini* buat react/revoke:\n`
                out += `\`${posted.newsletterStatusServerId}\``
            } else {
                out += `⚠️ Server ID belum ke-detect. Gema dari server belum dateng, coba \`${usedPrefix}cslist\` nanti.`
            }

            return m.reply(out)

        } catch (e) {
            console.error('[CS] error:', e)
            return m.reply(`❌ *Gagal kirim status:*\n\n${e?.message || e}`)
        }
    }

    // ============================================================
    // .cscheck — Cek izin posting
    // ============================================================
    if (cmd === 'cscheck') {
        try {
            const check = await conn.newsletterCanPostStatus(DEFAULT_CHANNEL)

            let out = `🔍 *Channel Status Permission*\n\n`
            out += `📡 *Channel:* \`${DEFAULT_CHANNEL}\`\n\n`
            out += `✅ *Can Post:* ${check?.canPost ? 'Ya' : 'Tidak'}\n`
            out += `🎵 *Can Post Music:* ${check?.canPostMusic ? 'Ya' : 'Tidak'}\n\n`

            if (check?.capabilities) {
                out += `📋 *Capabilities:*\n`
                for (const [k, v] of Object.entries(check.capabilities)) {
                    out += `  • ${k}: ${v ? '✅' : '❌'}\n`
                }
            }

            return m.reply(out)
        } catch (e) {
            return m.reply(`❌ ${e?.message || e}`)
        }
    }

    // ============================================================
    // .cslist — List status
    // ============================================================
    if (cmd === 'cslist') {
        try {
            const args = text?.trim().split(/\s+/).filter(Boolean) || []
            const opts = { count: 20 }

            // Support --before / --after
            for (let i = 0; i < args.length; i++) {
                if (args[i] === '--before' && args[i + 1]) opts.before = parseInt(args[i + 1])
                else if (args[i] === '--after' && args[i + 1]) opts.after = parseInt(args[i + 1])
                else if (args[i] === '--count' && args[i + 1]) opts.count = parseInt(args[i + 1])
            }

            const result = await conn.getNewsletterStatuses(DEFAULT_CHANNEL, opts)
            const statuses = result?.statuses || []

            if (!statuses.length) {
                return m.reply('📭 Belum ada status di saluran ini.')
            }

            let out = `📊 *Channel Status List*\n\n`
            out += `📡 \`${DEFAULT_CHANNEL}\`\n`
            out += `📊 Total: ${statuses.length}\n\n`

            for (const s of statuses) {
                out += `━━━━━━━━━━━━━━━━━━\n`
                out += `🆔 *ID:* \`${s.serverId}\`\n`
                out += `📝 *Type:* ${s.type || 'unknown'}\n`
                out += `👁️ *Views:* ${s.viewsCount || 0}\n`
                out += `💬 *Responses:* ${s.responsesCount || 0}\n`

                if (s.adminProfile?.name) {
                    out += `👤 *Admin:* ${s.adminProfile.name}\n`
                }

                if (s.reactionCounts?.length) {
                    out += `😀 *Reactions:* `
                    out += s.reactionCounts.map(r => `${r.code} × ${r.count}`).join(', ')
                    out += `\n`
                }

                if (s.timestamp) {
                    out += `🕐 *Waktu:* ${timeAgo(s.timestamp)}\n`
                }
            }

            out += `━━━━━━━━━━━━━━━━━━\n\n`
            out += `💡 *Navigate:*\n`
            out += `• \`${usedPrefix}cslist --before <id>\`\n`
            out += `• \`${usedPrefix}cslist --after <id>\`\n`
            out += `• \`${usedPrefix}cslist --count <n>\``

            return m.reply(out)
        } catch (e) {
            return m.reply(`❌ ${e?.message || e}`)
        }
    }

    // ============================================================
    // .csreact — React ke status
    // ============================================================
    if (cmd === 'csreact') {
        const parts = text?.trim().split(/\s+/) || []
        const statusId = parseInt(parts[0])
        const emoji = parts[1]

        if (!statusId) {
            return m.reply(
                `📌 *React Channel Status*\n\n` +
                `• \`${usedPrefix}csreact <id> <emoji>\`\n` +
                `• \`${usedPrefix}csreact <id> off\` — hapus reaction\n\n` +
                `*Contoh:*\n` +
                `• \`${usedPrefix}csreact 175 🔥\`\n` +
                `• \`${usedPrefix}csreact 175 off\``
            )
        }

        try {
            let reaction = emoji

            if (!reaction || reaction === 'off' || reaction === '0') {
                reaction = undefined
            }

            await conn.sendNewsletterStatusReaction(DEFAULT_CHANNEL, statusId, reaction)

            if (reaction) {
                return m.reply(`✅ Reaction *${reaction}* terkirim ke status #${statusId}`)
            } else {
                return m.reply(`✅ Reaction dihapus dari status #${statusId}`)
            }
        } catch (e) {
            return m.reply(`❌ ${e?.message || e}`)
        }
    }

    // ============================================================
    // .csrevoke — Hapus status
    // ============================================================
    if (cmd === 'csrevoke') {
        const statusId = parseInt(text?.trim())

        if (!statusId) {
            return m.reply(
                `📌 *Revoke Channel Status*\n\n` +
                `• \`${usedPrefix}csrevoke <id>\`\n\n` +
                `*Contoh:*\n` +
                `• \`${usedPrefix}csrevoke 175\``
            )
        }

        try {
            await conn.revokeNewsletterStatus(DEFAULT_CHANNEL, statusId)
            return m.reply(`✅ Status #${statusId} berhasil dihapus.`)
        } catch (e) {
            return m.reply(`❌ ${e?.message || e}`)
        }
    }

    // ============================================================
    // .csu — Get updates (perubahan sejak timestamp)
    // ============================================================
    if (cmd === 'csu' || cmd === 'csupdates') {
        try {
            const args = text?.trim().split(/\s+/).filter(Boolean) || []
            const opts = { count: 20 }

            for (let i = 0; i < args.length; i++) {
                if (args[i] === '--since' && args[i + 1]) {
                    opts.since = parseInt(args[i + 1])
                } else if (args[i] === '--count' && args[i + 1]) {
                    opts.count = parseInt(args[i + 1])
                } else if (!isNaN(args[i])) {
                    opts.since = parseInt(args[i])
                }
            }

            if (!opts.since) {
                // Default: 24 jam terakhir
                opts.since = Math.floor(Date.now() / 1000) - 86400
            }

            const updates = await conn.getNewsletterStatusUpdates(DEFAULT_CHANNEL, opts)

            let out = `📡 *Channel Status Updates*\n\n`
            out += `📅 Since: ${new Date(opts.since * 1000).toLocaleString('id-ID')}\n`
            out += `📊 Total: ${updates?.length || 0}\n\n`

            if (!updates?.length) {
                out += `_Gak ada update._`
            } else {
                for (const u of updates) {
                    out += `• \`${u.serverId || '-'}\` — ${u.type || '-'}\n`
                }
            }

            return m.reply(out)
        } catch (e) {
            return m.reply(`❌ ${e?.message || e}`)
        }
    }

    // ============================================================
    // .csq — Posting question status
    // ============================================================
    if (cmd === 'csq' || cmd === 'csquestion') {
        const q = m.quoted || m
        const hasImage = q?.message?.imageMessage

        if (!hasImage) {
            return m.reply(
                `📌 *Question Status*\n\n` +
                `Question status *HARUS* di atas media (gambar/video).\n\n` +
                `*Cara pakai:*\n` +
                `• Reply gambar + \`${usedPrefix}csq <pertanyaan>\`\n\n` +
                `*Contoh:*\n` +
                `• Reply gambar: \`${usedPrefix}csq Tanya apa aja tentang bot\``
            )
        }

        try {
            const buffer = await q.download()

            const posted = await conn.sendNewsletterStatus(DEFAULT_CHANNEL, {
                image: buffer,
                caption: text || '',
                question: {
                    text: text || 'Tanya apa saja'
                }
            })

            return m.reply(
                `✅ *Question Status Terkirim!*\n\n` +
                `🆔 Server ID: \`${posted?.newsletterStatusServerId || 'pending'}\`\n` +
                `❓ Question: ${text || 'Tanya apa saja'}\n\n` +
                `_Follower bakal bisa jawab langsung dari status._`
            )
        } catch (e) {
            return m.reply(`❌ ${e?.message || e}`)
        }
    }
}

// ============================================================
// META
// ============================================================

handler.help = [
    'cs <teks>',
    'cs (reply media)',
    'cscheck',
    'cslist [--before|--after|--count]',
    'csreact <id> <emoji>',
    'csrevoke <id>',
    'csu [--since <ts>]',
    'csq (reply gambar)'
]
handler.tags = ['tools', 'channel']
handler.command = /^(cs|channelstatus|cscheck|cslist|csreact|csrevoke|csu|csupdates|csq|csquestion)$/i
handler.owner = true
handler.limit = true

export default handler