import fs from 'fs'
import path from 'path'
import te from '../../src/lib/xorizn-error.js'
import { updateAssetUrl } from '../../src/lib/xorizn-uploader.js'
const pluginConfig = {
    name: 'ganti-xorizn-games.jpg',
    alias: ['gantigames', 'setxorizngames'],
    category: 'owner',
    description: 'Ganti gambar xorizn-games.jpg (thumbnail games)',
    usage: '.ganti-xorizn-games.jpg (reply/kirim gambar)',
    example: '.ganti-xorizn-games.jpg',
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
        return m.reply(`🖼️ *ɢᴀɴᴛɪ ᴏᴜʀɪɴ-ɢᴀᴍᴇs.ᴊᴘɢ*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/xorizn-games.jpg`)
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
            const newUrl = await updateAssetUrl('xorizn-games', buffer, 'xorizn-games.jpg')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar xorizn-games.jpg telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload gambar: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }