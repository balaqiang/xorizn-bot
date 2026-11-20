import fs from 'fs'
import path from 'path'
import te from '../../src/lib/vemzo-error.js'
import { updateAssetUrl } from '../../src/lib/vemzo-uploader.js'
const pluginConfig = {
    name: 'ganti-vemzo.mp3',
    alias: ['gantivemzoaudio', 'setvemzoaudio'],
    category: 'owner',
    description: 'Ganti audio vemzo.mp3',
    usage: '.ganti-vemzo.mp3 (reply/kirim audio)',
    example: '.ganti-vemzo.mp3',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const isAudio = m.type === 'audioMessage' || (m.quoted && m.quoted.type === 'audioMessage')
    
    if (!isAudio) {
        return m.reply(`🎵 *ɢᴀɴᴛɪ ᴏᴜʀɪɴ.ᴍᴘ3*\n\n> Kirim/reply audio untuk mengganti\n> File: assets/audio/vemzo.mp3`)
    }
    
    try {
        let buffer
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download()
        } else if (m.isMedia) {
            buffer = await m.download()
        }
        
        if (!buffer) {
            return m.reply(`❌ Gagal mendownload audio`)
        }
        
        await m.reply(`⏳ Sedang mengupload gambar...`)
        try {
            const newUrl = await updateAssetUrl('vemzo-mp3', buffer, 'vemzo.mp3')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> File vemzo.mp3 telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload file: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }