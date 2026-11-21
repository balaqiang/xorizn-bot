export const FEATURE_CREDIT = "Fitur By: xorizn-bot\nSaluran Resmi: https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R";


import config from '../../config.js';
const pluginConfig = {
    name: 'seleksif02',
    alias: ['f02', 'joinf02'],
    category: 'main',
    description: 'Seleksi masuk F02',
    usage: '.seleksif02',
    example: '.seleksif02',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function handler(m, { sock }) {

    const name = m.pushName || "Darling"

    const text1 = `
╭━━〔 💖 XORIZN-BOT SELECTION 💖 〕━━⬣
┃
┃ Wahh *${name}*~
┃ Darling mau seleksi *F02* yaa? 😋
┃
┃ Tapi baca syarat nya dulu ya!
┃
┃ 📜 *SYARAT MASUK F02*
┃
┃ • wajib bisa ngedit minimal
┃   *soft spoken style*
┃
┃ • umur *14+* wajib minimal 14
┃
┃ • *no drama basi*
┃
┃ • *good attitude*
┃
┃ • minimal punya pengalaman
┃   soal dunia editor
┃
┃ • *wajib CNTIKTOK*
┃
┃ Tunggu sebentar ya darling...
┃ xorizn-bot sedang menyiapkan
┃ akses masuk F02 💕
╰━━━━━━━━⬣
`

    await m.reply(text1)

    // delay 20 detik
    await sleep(20000)

    const text2 = `
╭━━〔 🚪 MASUK F02 〕━━⬣
┃
┃ Kalau darling sudah
┃ memenuhi semua syarat
┃
┃ Yuk langsung masuk
┃ ke grup F02 😋
┃
┃ Tekan tombol di bawah ya~
╰━━━━━━━━⬣
`

    await sock.sendMessage(m.chat, {
        text: text2,
        footer: "FAMOUS XORIZN-BOT",
        interactiveButtons: [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "🚀 Masuk Grup F02",
                    url: "https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R"
                })
            }
        ]
    }, { quoted: m })

}

export { pluginConfig as config, handler };
