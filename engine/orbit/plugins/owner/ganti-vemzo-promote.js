import fs from 'fs'
import path from 'path'
import te from '../../src/lib/vemzo-error.js'
import { updateAssetUrl } from '../../src/lib/vemzo-uploader.js'
const pluginConfig = {
    name: 'ganti-vemzo-promote.jpg',
    alias: ['gantivemzopromote', 'setvemzopromote'],
    category: 'owner',
    description: 'Ganti gambar vemzo-promote.jpg',
    usage: '.ganti-vemzo-promote.jpg (reply/kirim gambar)',
    example: '.ganti-vemzo-promote.jpg',
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
    if (!isImage) return m.reply(`🖼️ *ɢᴀɴᴛɪ vemzo-PROMOTE.JPG*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/vemzo-promote.jpg`)
    try {
        let buffer = m.quoted && m.quoted.isMedia ? await m.quoted.download() : await m.download()
        if (!buffer) return m.reply('❌ Gagal mendownload gambar')
        await m.reply(`⏳ Sedang mengupload gambar...`)
        try {
            const newUrl = await updateAssetUrl('vemzo-promote', buffer, 'vemzo-promote.jpg')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar vemzo-promote.jpg telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload gambar: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }