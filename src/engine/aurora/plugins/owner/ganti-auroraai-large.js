const hsAsset = require('../../src/lib/assets')
const { uploadToCatbox } = require('../../src/lib/uploader')

const pluginConfig = {
    name: 'auroraai-large',
    alias: ['setauroraailarge', 'gantiauroraailarge'],
    category: 'owner',
    description: 'Preset: Ganti gambar auroraai.jpg, serta auroraai-v7 hingga auroraai-v11.jpg sekaligus',
    usage: '.auroraai-large (reply/kirim gambar atau URL)',
    example: '.auroraai-large',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

// Aset ini sekarang berupa URL di config.assets (bukan file di folder assets/)
const KEYS = ['images/auroraai', 'images/auroraai-v7', 'images/auroraai-v8', 'images/auroraai-v9', 'images/auroraai-v11']
const LABEL = 'auroraai-large (auroraai, v7, v8, v9, v11)'

async function handler(m, { sock }) {
    const arg = (m.args && m.args[0] ? String(m.args[0]) : '').trim()

    // .auroraai-large reset → balik ke URL bawaan di config.js
    if (arg.toLowerCase() === 'reset') {
        KEYS.forEach(k => hsAsset.setUrl(k, ''))
        return m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Override URL untuk ${LABEL} dihapus, balik pakai URL di config.js`)
    }

    // .auroraai-large https://... → set URL langsung
    if (/^https?:\/\//i.test(arg)) {
        KEYS.forEach(k => hsAsset.setUrl(k, arg))
        return m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> ${LABEL} sekarang pakai URL:\n> ${arg}`)
    }

    const isMedia = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
    if (!isMedia) {
        return m.reply(
            `🖼️ *ɢᴀɴᴛɪ ${LABEL.toUpperCase()}*\n\n` +
            `> Kirim/reply gambar, atau kirim link URL langsung\n` +
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
            return m.reply(`❌ *Ara ara~*\n\n> Ai gagal download gambarnya nih... coba lagi ya~ 🥺`)
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
