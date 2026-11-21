import fs from 'fs'
import path from 'path'
import te from '../../src/lib/orbit-error.js'
import { updateAssetUrl } from '../../src/lib/orbit-uploader.js'
const pluginConfig = {
    name: 'ganti-orbit.mp4',
    alias: ['gantiorbitvideo', 'setorbitvideo'],
    category: 'owner',
    description: 'Ganti video orbit.mp4',
    usage: '.ganti-orbit.mp4 (reply/kirim video)',
    example: '.ganti-orbit.mp4',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const isVideo = m.type === 'videoMessage' || (m.quoted && m.quoted.type === 'videoMessage')
    
    if (!isVideo) {
        return m.reply(`🎬 *ɢᴀɴᴛɪ ᴏᴜʀɪɴ.ᴍᴘ4*\n\n> Kirim/reply video untuk mengganti\n> File: assets/video/orbit.mp4`)
    }
    
    try {
        let buffer
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download()
        } else if (m.isMedia) {
            buffer = await m.download()
        }
        
        if (!buffer) {
            return m.reply(`❌ Gagal mendownload video`)
        }
        
        await m.reply(`⏳ Sedang mengupload gambar...`)
        try {
            const newUrl = await updateAssetUrl('orbit-mp4', buffer, 'orbit.mp4')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> File orbit.mp4 telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload file: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }