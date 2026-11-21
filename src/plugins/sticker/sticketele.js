// Port dari 'plugin baru' (sticketele.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const zlib = require('zlib')
const sharp = require('sharp')
const {sendCustomStickerPack} = require('../../lib/engine/core/pack')
const {videoToWebp, addExif} = S

const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	if (!text) {
		return reply(
			`⚙️ *FORMAT SALAH!*\n\n` +
			`Gunakan:\n` +
			`*${usedPrefix}${command} <link_atau_nama_pack_telegram>*\n\n` +
			`Contoh:\n` +
			`• *${usedPrefix}${command} https://t.me/addstickers/CatMemes*\n` +
			`• *${usedPrefix}${command} CatMemes*`
		);
	}

	const rawInput = text.trim();
	let packNameInput = rawInput;
	let customAuthor = global.author || 'Elysia Bot';

	if (rawInput.includes('|')) {
		const parts = rawInput.split('|');
		packNameInput = parts[0]?.trim();
		customAuthor = parts[1]?.trim() || customAuthor;
	}

	const match = packNameInput.match(/(?:t\.me\/addstickers\/|https:\/\/t\.me\/addstickers\/)?([a-zA-Z0-9_]+)/i);
	const packName = match ? match[1] : packNameInput;

	if (!packName) return reply('⚙️ Link/nama sticker pack Telegram tidak valid!');

	const defaultPackName = global.packname || 'Sticker by Elysia';

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

	try {
		const token = global.tgToken;
		if (!token) {
			await sock.sendMessage(m.chat, { react: { text: '⚠', key: m.key } });
			return reply('❌ Konfigurasi bot gagal: `global.tgToken` belum diset di settings.');
		}

		const apiUrl = `https://api.telegram.org/bot${token}/getStickerSet?name=${encodeURIComponent(packName)}`;

		const res = await fetch(apiUrl);
		if (!res.ok) {
			throw new Error(`Gagal mengambil data dari Telegram (Status ${res.status}). Pastikan nama/link sticker pack valid.`);
		}

		const data = await res.json();
		if (!data.ok || !data.result || !data.result.stickers?.length) {
			await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
			return reply(`❌ Sticker pack Telegram *${packName}* tidak ditemukan atau kosong!`);
		}

		const totalStickers = data.result.stickers.length;
		const packTitle = data.result.title || packName;
		const MAX_PACK_SIZE = 30;
		const totalPacks = Math.ceil(totalStickers / MAX_PACK_SIZE);

		await reply(`⏳ *Memproses sticker pack Telegram (${packTitle})...*\n📊 *Total Stiker:* ${totalStickers}\n📦 *Total Pack:* ${totalPacks} pack (Maks. ${MAX_PACK_SIZE} stiker/pack)`);

		const processSticker = async (st) => {
			try {
				const fileRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${st.file_id}`);
				const fileData = await fileRes.json();
				if (!fileData.ok || !fileData.result?.file_path) return null;

				const downloadUrl = `https://api.telegram.org/file/bot${token}/${fileData.result.file_path}`;
				const bufRes = await fetch(downloadUrl);
				if (!bufRes.ok) return null;

				const buffer = Buffer.from(await bufRes.arrayBuffer());
				const filePath = fileData.result.file_path;

				if (filePath.endsWith('.tgs')) {
					try {
						const jsonBuf = zlib.gunzipSync(buffer);
						return {
							buffer: jsonBuf,
							ext: 'json',
							isAnimated: true,
							isLottie: true,
							mimetype: 'application/json'
						};
					} catch (_) {
						return null;
					}
				} else if (filePath.endsWith('.webm')) {
					const webpBuf = await videoToWebp(buffer).catch(() => null);
					if (webpBuf) {
						const withExif = await addExif(webpBuf, defaultPackName, customAuthor).catch(() => webpBuf);
						return {
							buffer: withExif,
							ext: 'webp',
							isAnimated: true,
							isLottie: false,
							mimetype: 'image/webp'
						};
					}
					return null;
				} else {
					const formattedWebp = await sharp(buffer, { animated: false })
						.resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
						.webp({ quality: 35, effort: 4, lossless: false, reductionEffort: 4 })
						.toBuffer()
						.catch(() => buffer);

					const withExif = await addExif(formattedWebp, defaultPackName, customAuthor).catch(() => formattedWebp);

					return {
						buffer: withExif,
						ext: 'webp',
						isAnimated: false,
						isLottie: false,
						mimetype: 'image/webp'
					};
				}
			} catch (err) {
				console.error('[STICKETELE ITEM ERROR]', err.message);
				return null;
			}
		};

		let successPacksCount = 0;
		const CONCURRENCY = 6;

		for (let packIndex = 0; packIndex < totalPacks; packIndex++) {
			const packStickers = data.result.stickers.slice(packIndex * MAX_PACK_SIZE, (packIndex + 1) * MAX_PACK_SIZE);
			const processedPack = [];

			for (let i = 0; i < packStickers.length; i += CONCURRENCY) {
				const batch = packStickers.slice(i, i + CONCURRENCY);
				const results = await Promise.all(batch.map(st => processSticker(st)));
				for (const resItem of results) {
					if (resItem) processedPack.push(resItem);
				}
			}

			if (processedPack.length > 0) {
				const packLabel = totalPacks > 1 ? ` Part ${packIndex + 1}/${totalPacks}` : '';
				await sendCustomStickerPack(sock, m.chat, processedPack, {
					name: `${defaultPackName} - ${packTitle}${packLabel}`,
					publisher: customAuthor,
					description: packTitle + packLabel,
					quoted: m
				});
				successPacksCount++;
			}
		}

		if (successPacksCount === 0) {
			await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
			return reply('❌ Gagal mengunduh atau mengkonversi stiker dari pack tersebut.');
		}

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

	} catch (e) {
		console.error('[STICKETELE ERROR]', e);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		return reply(`❌ Gagal memproses sticker pack Telegram!\n${e.message}`);
	}
};

handler.help = ['sticketele <link/name>', 'telestick <link/name>'];
handler.tags = ['convert', 'maker'];
handler.command = ['sticketele', 'stiktele'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "sticker"})
