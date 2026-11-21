import fs from 'fs'
import path from 'path'
import te from '../../src/lib/xorizn-error.js'
import { updateAssetUrl } from '../../src/lib/xorizn-uploader.js'
const pluginConfig = {
    name: 'ganti-xorizn-levelup.jpg',
    alias: ['gantixoriznlevelup', 'setxoriznlevelup'],
    category: 'owner',
    description: 'Ganti gambar xorizn-levelup.jpg',
    usage: '.ganti-xorizn-levelup.jpg (reply/kirim gambar)',
    example: '.ganti-xorizn-levelup.jpg',
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
    if (!isImage) return m.reply(`🖼️ *ɢᴀɴᴛɪ XORIZN-LEVELUP.JPG*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/xorizn-levelup.jpg`)
    try {
        let buffer = m.quoted && m.quoted.isMedia ? await m.quoted.download() : await m.download()
        if (!buffer) return m.reply('❌ Gagal mendownload gambar')
        await m.reply(`⏳ Sedang mengupload gambar...`)
        try {
            const newUrl = await updateAssetUrl('xorizn-levelup', buffer, 'xorizn-levelup.jpg')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar xorizn-levelup.jpg telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload gambar: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }