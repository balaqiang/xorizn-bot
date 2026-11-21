// Port dari 'plugin baru' (pindl.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const axios = require('axios')
const cheerio = require('cheerio')

async function pindl(url) {
    try {
        let a = await axios.get(url, {
            headers: {
                'User-Agent': "Mozilla/5.0 (Linux; Android 12; SAMSUNG SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/17.0 Chrome/96.0.4664.104 Mobile Safari/537.36",
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            },
            timeout: 15000
        });

        let $ = cheerio.load(a.data);
        let x = $('script[data-test-id="leaf-snippet"]').text();
        let y = $('script[data-test-id="video-snippet"]').text();

        if (!x && !y) throw new Error('Data metadata Pinterest tidak ditemukan.');

        const info = x ? JSON.parse(x) : {};
        const videoInfo = y ? JSON.parse(y) : null;

        return {
            status: true,
            isVideo: Boolean(videoInfo?.contentUrl),
            info: info,
            image: info.image || '',
            video: videoInfo?.contentUrl || ''
        };
    } catch (e) {
        return {
            status: false,
            mess: e.message || "Gagal mengunduh media dari Pinterest."
        };
    }
}

const handler = async (m, { sock, text, usedPrefix, command, reply }) => {
    const p = usedPrefix || '.';
    const query = (text || (m.quoted ? (m.quoted.text || m.quoted.caption) : ''))?.trim();

    if (!query || !/^https?:\/\/(www\.)?(pinterest\.com|pin\.it)(?:[\/?#]|$)/i.test(query)) {
        return reply(`*Format Salah!*\n\nKirimkan link Pinterest yang valid.\n*Contoh:* ${p + command} https://pin.it/xxxxxx`);
    }

    await sock.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }).catch(() => null);

    try {
        const result = await pindl(query);

        if (!result.status) {
            throw new Error(result.mess);
        }

        const contextInfo = {
            isForwarded: true,
            forwardingScore: 9999,
            forwardedNewsletterMessageInfo: {
                newsletterName: global.namech || "xorizn-bot Channel",
                newsletterJid: global.idch || global.channelJid
            }
        };

        if (result.isVideo && result.video) {
            await sock.sendMessage(m.chat, {
                video: { url: result.video },
                caption: `✅ *Pinterest Video Downloader*`,
                contextInfo
            }, { quoted: m });
        } else if (result.image) {
            // Mengubah URL ke kualitas tertinggi (originals)
            const hdImage = result.image.replace(/\/(?:236x|474x|564x|736x)\//, '/originals/');

            await sock.sendMessage(m.chat, {
                image: { url: hdImage },
                caption: `✅ *Pinterest Image Downloader (HD)*`,
                contextInfo
            }, { quoted: m });
        } else {
            throw new Error('Media tidak dapat ditemukan.');
        }

        await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => null);

    } catch (e) {
        console.error('[PINDL NATIVE ERROR]:', e);
        await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
        reply(`❌ ${e.message || 'Gagal memproses link Pinterest.'}`);
    }
};

handler.help = ['pindl <link>', 'pinterestdl <link>'];
handler.tags = ['downloader'];
handler.command = ['pindl', 'pinterestdl'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "downloader"})
