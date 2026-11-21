import fs from 'fs'
import path from 'path'
import te from '../../src/lib/orbit-error.js'
import { updateAssetUrl } from '../../src/lib/orbit-uploader.js'
const pluginConfig = {
    name: 'ganti-orbit-levelup.jpg',
    alias: ['gantiorbitlevelup', 'setorbitlevelup'],
    category: 'owner',
    description: 'Ganti gambar orbit-levelup.jpg',
    usage: '.ganti-orbit-levelup.jpg (reply/kirim gambar)',
    example: '.ganti-orbit-levelup.jpg',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const isImage = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
    if (!isImage) return m.reply(`🖼️ *ɢᴀɴᴛɪ orbit-LEVELUP.JPG*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/orbit-levelup.jpg`)
    try {
        let buffer = m.quoted && m.quoted.isMedia ? await m.quoted.download() : await m.download()
        if (!buffer) return m.reply('❌ Gagal mendownload gambar')
        await m.reply(`⏳ Sedang mengupload gambar...`)
        try {
            const newUrl = await updateAssetUrl('orbit-levelup', buffer, 'orbit-levelup.jpg')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar orbit-levelup.jpg telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload gambar: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }