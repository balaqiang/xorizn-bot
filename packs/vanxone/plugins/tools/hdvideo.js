// Port dari 'plugin baru' (hdvideo.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const axios = require('axios')
const FormData = require('form-data')
const crypto = require('crypto')
const {downloadMediaMessage} = require('@whiskeysockets/baileys')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const handler = async (m, { sock, reply, usedPrefix, command }) => {
	const botName = global.namaBot;
	const targetMsg = m.quoted ? m.quoted : m;
	const mime = (targetMsg.msg || targetMsg).mimetype || '';

	if (!/video/.test(mime)) {
		return reply(
			`🎬 *AI HD VIDEO ENHANCER*\n\n` +
			`Tingkatkan resolusi & kualitas video buram menjadi HD/2K.\n\n` +
			`*Cara Penggunaan:*\n` +
			`• Kirim video dengan caption \`${usedPrefix + command}\`\n` +
			`• Atau balas/reply video dengan \`${usedPrefix + command}\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);
	await reply('⏳ _Sedang memproses video dengan AI, mohon tunggu sebentar (dapat memakan waktu 1–3 menit)..._');

	try {
		let videoBuffer;
		if (typeof targetMsg.download === 'function') {
			videoBuffer = await targetMsg.download();
		} else {
			videoBuffer = await downloadMediaMessage(
				targetMsg,
				'buffer',
				{},
				{ logger: console }
			);
		}

		if (!videoBuffer || !Buffer.isBuffer(videoBuffer)) {
			throw new Error('Gagal mengunduh buffer video dari WhatsApp.');
		}

		const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
		const SERIAL = crypto.createHash('md5').update(UA + Date.now()).digest('hex');

		const getHeaders = (extra = {}) => Object.assign({
			'accept': '*/*',
			'product-serial': SERIAL,
			'user-agent': UA,
			'Referer': 'https://unblurimage.ai/'
		}, extra);

		// 1. Registrasi File
		const fileName = `${crypto.randomBytes(4).toString('hex')}_video.mp4`;
		const formReg = new FormData();
		formReg.append('video_file_name', fileName);

		const reg = await axios.post('https://api.unblurimage.ai/api/upscaler/v1/ai-video-enhancer/upload-video', formReg, {
			headers: Object.assign(getHeaders(), formReg.getHeaders()),
			timeout: 30000
		});

		const { url: ossUrl, object_name: objectName } = reg.data?.result || {};
		if (!ossUrl || !objectName) {
			throw new Error('Gagal mendapatkan sesi upload OSS server.');
		}

		// 2. Upload video ke OSS
		await axios.put(ossUrl, videoBuffer, {
			headers: { 'Content-Type': 'video/mp4', 'User-Agent': UA },
			maxBodyLength: Infinity,
			maxContentLength: Infinity,
			timeout: 120000
		});

		// 3. Buat Job Enhance
		const formJob = new FormData();
		formJob.append('original_video_file', `https://cdn.unblurimage.ai/${objectName}`);
		formJob.append('resolution', '');
		formJob.append('is_preview', 'false');

		const create = await axios.post('https://api.unblurimage.ai/api/upscaler/v2/ai-video-enhancer/create-job', formJob, {
			headers: Object.assign(getHeaders(), formJob.getHeaders()),
			timeout: 30000
		});

		const jobId = create.data?.result?.job_id;
		if (!jobId) {
			throw new Error('Gagal membuat antrean tugas pemrosesan video.');
		}

		// 4. Polling status Job (Maksimal 5 menit)
		let outputUrl = null;
		for (let i = 0; i < 60; i++) {
			await sleep(5000);
			const check = await axios.get(`https://api.unblurimage.ai/api/upscaler/v2/ai-video-enhancer/get-job/${jobId}`, {
				headers: getHeaders(),
				timeout: 15000
			});

			if (check.data?.result?.output_url) {
				outputUrl = check.data.result.output_url;
				break;
			}
		}

		if (!outputUrl) {
			throw new Error('Proses AI timeout atau server sedang overload.');
		}

		const caption = [
			'✨ *AI VIDEO ENHANCED (HD/2K)*',
			'─────────────────────────',
			'• 📊 *Status:* Berhasil Ditingkatkan',
			'• 🔍 *Teknologi:* Deep AI Upscaler',
			'',
			`© ${botName}`
		].join('\n');

		await sock.sendMessage(m.chat, {
			video: { url: outputUrl },
			caption,
			mimetype: 'video/mp4'
		}, { quoted: m });

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[HDVIDEO ERROR]:', e.response?.data || e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Terjadi kesalahan saat memproses video: ${e.message || e}`);
	}
};

handler.help = ['hdvideo', 'unblurvideo', 'vhd'];
handler.tags = ['tools', 'maker'];
handler.command = ['hdvideo', 'unblurvideo', 'vhd'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "tools"})
