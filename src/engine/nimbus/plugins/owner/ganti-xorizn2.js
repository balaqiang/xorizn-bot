import fs from 'fs'
import path from 'path'
import te from '../../src/lib/xorizn-error.js'
import { updateAssetUrl } from '../../src/lib/xorizn-uploader.js'
const pluginConfig = {
    name: 'ganti-xorizn2.jpg',
    alias: ['gantixorizn2', 'setxorizn2'],
    category: 'owner',
    description: 'Ganti gambar xorizn2.jpg',
    usage: '.ganti-xorizn2.jpg (reply/kirim gambar)',
    example: '.ganti-xorizn2.jpg',
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
    
    if (!isImage) {
        return m.reply(`🖼️ *ɢᴀɴᴛɪ ᴏᴜʀɪɴ2.ᴊᴘɢ*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/xorizn2.jpg`)
    }
    
    try {
        let buffer
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download()
        } else if (m.isMedia) {
            buffer = await m.download()
        }
        
        if (!buffer) {
            return m.reply(`❌ Gagal mendownload gambar`)
        }
        
        await m.reply(`⏳ Sedang mengupload gambar...`)
        try {
            const newUrl = await updateAssetUrl('xorizn2', buffer, 'xorizn2.jpg')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar xorizn2.jpg telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload gambar: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }