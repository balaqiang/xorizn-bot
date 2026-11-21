const hsAsset = require('../../src/lib/assets')
const { uploadToCatbox } = require('../../src/lib/uploader')

const pluginConfig = {
    name: 'ganti-auroraai.mp3',
    alias: ['gantiauroraaiaudio', 'setauroraaiaudio'],
    category: 'owner',
    description: 'Ganti audio auroraai.mp3',
    usage: '.ganti-auroraai.mp3 (reply/kirim audio atau URL)',
    example: '.ganti-auroraai.mp3',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

// Aset ini sekarang berupa URL di config.assets (bukan file di folder assets/)
const KEYS = ['audio/auroraai']
const LABEL = 'auroraai.mp3'

async function handler(m, { sock }) {
    const arg = (m.args && m.args[0] ? String(m.args[0]) : '').trim()

    // .ganti-auroraai.mp3 reset → balik ke URL bawaan di config.js
    if (arg.toLowerCase() === 'reset') {
        KEYS.forEach(k => hsAsset.setUrl(k, ''))
        return m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Override URL untuk ${LABEL} dihapus, balik pakai URL di config.js`)
    }

    // .ganti-auroraai.mp3 https://... → set URL langsung
    if (/^https?:\/\//i.test(arg)) {
        KEYS.forEach(k => hsAsset.setUrl(k, arg))
        return m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> ${LABEL} sekarang pakai URL:\n> ${arg}`)
    }

    const isMedia = m.type === 'audioMessage' || (m.quoted && m.quoted.type === 'audioMessage')
    if (!isMedia) {
        return m.reply(
            `🎵 *ɢᴀɴᴛɪ ${LABEL.toUpperCase()}*\n\n` +
            `> Kirim/reply audio, atau kirim link URL langsung\n` +
            `> Key config: ${KEYS.join(', ')}\n` +
            `> Ketik \`reset\` untuk balik ke URL di config.js`
        )
    }

    try {
        await m.react('🕕')
        let buffer
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download()
        } else if (m.isMedia) {
            buffer = await m.download()
        }

        if (!buffer) {
            await m.react('❌')
            return m.reply(`❌ *Gomen ne~* Gagal mendownload audio~ 🥺`)
        }

        // upload ke hosting (Catbox = permanen), lalu simpan URL-nya
        const hostedUrl = await uploadToCatbox(buffer, LABEL)
        KEYS.forEach(k => hsAsset.setUrl(k, hostedUrl))

        await m.react('✅')
        m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> ${LABEL} telah diganti\n> URL: ${hostedUrl}\n> Tersimpan di database/main/assetUrls.json`)
    } catch (error) {
        await m.react('❌')
        m.reply(`❌ *Gomen ne~* ✦\n\n> ${error.message}\n\n_Ai udah coba yang terbaik tapi gagal juga... coba lagi nanti ya~ 🌸_`)
    }
}

module.exports = {
    config: pluginConfig,
    handler
}
