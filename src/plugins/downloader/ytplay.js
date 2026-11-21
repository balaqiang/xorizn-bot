'use strict';
const axios = require('axios');
const { Innertube } = require('youtubei.js');
const { randomUUID } = require('crypto');

let youtube = null;
async function getYoutube() {
  if (!youtube) youtube = await Innertube.create();
  return youtube;
}

async function resolvePreview(url) {
  try {
    const guestId = randomUUID();
    const response = await axios.post('https://scriptmind.co/api/media/resolve/preview',
      { url, platform: 'youtube', pageType: 'video', guestId },
      { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
    );
    return response.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || e.message };
  }
}

async function getLyrics(query) {
  try {
    const res = await axios.get('https://api-faa.my.id/faa/lyrics', { params: { q: query }, timeout: 15000 });
    if (!res.data?.status) return null;
    return res.data.result || null;
  } catch { return null; }
}

async function YouTubeplay(query) {
  const yt = await getYoutube();
  const search = await yt.search(query, { type: 'video' });
  const video = search.videos?.[0];
  if (!video) return { success: false, message: 'Video tidak ditemukan' };
  const url = `https://www.youtube.com/watch?v=${video.id}`;
  const resolved = await resolvePreview(url);
  if (!resolved?.success) return { success: false, message: resolved?.message || 'Gagal resolve' };
  const data = resolved.result || {};
  let media;
  try { media = typeof data.resolvedMediaJson === 'string'? JSON.parse(data.resolvedMediaJson) : data.resolvedMediaJson; } catch { return { success: false, message: 'Gagal baca media' }; }
  const audio = media?.tunnel?.[1] || null;
  if (!audio) return { success: false, message: 'URL audio tidak ditemukan' };
  const lyrics = await getLyrics(video.title?.text || '').catch(()=>null);
  return {
    success: true,
    result: {
      title: video.title?.text || data.title,
      channel: video.author?.name || data.author || 'YouTube',
      videoId: video.id,
      url,
      thumbnail: video.thumbnails?.[video.thumbnails.length-1]?.url || null,
      duration: video.duration?.text || null,
      audio,
      lyrics
    }
  };
}

module.exports = {
  name: 'ytplay-xorizn-bot',
  command: ['ytplay', 'ytp'],
  category: 'downloader',
  desc: 'Play YT + lirik by xorizn-bot',
  creator: 'xorizn-bot',
  run: async ({ sock, msg, from, args, reply }) => {
    const query = args.join(' ').trim();
    if (!query) return reply(`❌ Mana judulnya wok?\n\nContoh:\n.ytplay alan walker faded\n.ytp https://youtu.be/xxxxx`);

    await reply('⏳ *Memproses... - xorizn-bot* 🎵');
    try {
      const res = await YouTubeplay(query);
      if (!res.success) throw new Error(res.message);
      const data = res.result;

      const caption = `🎵 *${data.title}*\n👤 ${data.channel}\n⏱️ ${data.duration || '-'}\n🔗 ${data.url}\n\n© xorizn-bot`;

      // kirim thumbnail + info
      if (data.thumbnail) {
        await sock.sendMessage(from, { image: { url: data.thumbnail }, caption }, { quoted: msg });
      } else {
        await sock.sendMessage(from, { text: caption }, { quoted: msg });
      }

      // kirim audio
      await sock.sendMessage(from, { audio: { url: data.audio }, mimetype: 'audio/mpeg', fileName: `${data.title}.mp3` }, { quoted: msg });

      // kirim lirik jika ada
      if (data.lyrics?.lyrics) {
        let lirikText = `📜 *LIRIK - ${data.lyrics.title || data.title}*\n👤 ${data.lyrics.artist || data.channel}\n\n${data.lyrics.lyrics.slice(0, 3500)}`;
        await sock.sendMessage(from, { text: lirikText }, { quoted: msg });
      }

    } catch (e) {
      reply(`❌ Gagal: ${e.message}\n\n© xorizn-bot`);
    }
  }
};
