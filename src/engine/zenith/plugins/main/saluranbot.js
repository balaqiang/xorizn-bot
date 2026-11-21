import fs from 'fs';
import path from 'path';
export const FEATURE_CREDIT = "Fitur By: xorizn-bot\nSaluran Resmi: https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R";
const pluginConfig = {
    name: 'saluran',
    alias: ['channel','ch','joinch'],
    category: 'main',
    description: 'Join saluran resmi xorizn-bot 😈',
    usage: '.saluran',
    cooldown: 5,
    isEnabled: true
}

async function handler(m, { sock }) {

    const chBot = 'https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R'
    const chOwner = 'https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R'
    const chSticker = 'https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R'

    // 🖼️ ambil gambar
    const imgPath = path.join(process.cwd(), 'assets', 'images', 'zerotwo2.jpg')
    let imageBuffer = null

    if (fs.existsSync(imgPath)) {
        imageBuffer = fs.readFileSync(imgPath)
    } else {
        return m.reply('❌ Gambar zerotwo2.jpg gak ditemukan di assets/images/')
    }

    const caption = 
`╭━━━〔 💗 XORIZN-BOT CHANNEL 💗 〕━━━⬣
┃
┃ Ara ara~ 😏
┃ Kamu mau tetap dekat denganku kan, darling?
┃
┃ Jangan sampai ketinggalan info penting ya…
┃ Aku gak suka kalau kamu telat tau sesuatu 😌
┃
┣━━━〔 📢 WAJIB DI IKUTI 〕━━━⬣
┃ 💗 Saluran Bot (WAJIB)
┃ Tempat update, info, dan fitur baru!
┃
┃ ⚠️ Tidak join?
┃ ➜ Fitur bisa dibatasi 😈
┃
┣━━━〔 🌸 OPTIONAL 〕━━━⬣
┃ 👑 Saluran Owner
┃ Liat update & behind the scene~
┃
┃ 🎭 Saluran Sticker xorizn-bot
┃ Biar chat kamu makin hidup 💕
┃
╰━━━⬣
“Kalau kamu mengabaikanku…
aku bisa saja mengabaikanmu juga, darling 😌💔”
`

    try {

        await sock.sendMessage(m.chat, {
            image: imageBuffer,
            caption: caption,
            footer: 'xorizn-bot 💗',
            interactiveButtons: [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '💗 Join Saluran Bot',
                        url: chBot
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '👑 Saluran Owner',
                        url: chOwner
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🎭 Sticker xorizn-bot',
                        url: chSticker
                    })
                }
            ]
        }, { quoted: m })

    } catch (err) {
        console.log(err)
        m.reply('❌ Gagal kirim saluran 😢')
    }

}

export { pluginConfig as config, handler };
