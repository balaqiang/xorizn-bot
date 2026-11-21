// Port dari 'plugin baru' (ubah_foto.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const axios = require('axios')
const crypto = require('crypto')
const { fileTypeFromBuffer } = S
const fs = require('fs')
const path = require('path')

const branch = "main";
let repos = ["cdn1", "cdn2", "cdn3", "cdn4", "cdn5"];

async function ensureRepoExists(repo) {
	try {
		await axios.get(`https://api.github.com/repos/${global.userGh}/${repo}`, {
			headers: {
				Authorization: `Bearer ${global.ghTokens}`,
				"User-Agent": "Mozilla/5.0"
			}
		});
	} catch (e) {
		if (e.response?.status === 404) {
			await axios.post(
				"https://api.github.com/user/repos",
				{
					name: repo,
					private: false
				},
				{
					headers: {
						Authorization: `Bearer ${global.ghTokens}`,
						"User-Agent": "Mozilla/5.0"
					}
				}
			);

			if (!repos.includes(repo)) repos.push(repo);
		} else {
			throw e;
		}
	}
}

function generateRepoName() {
	return `cdn-${crypto.randomBytes(3).toString("hex")}`;
}

async function uploadFile(buffer, originalName = "file") {
	const detected = await fileTypeFromBuffer(buffer);
	const ext =
		detected?.ext ||
		originalName.split(".").pop() ||
		"bin";

	const code = crypto.randomBytes(3).toString("hex");
	const fileName = `${code}-${Date.now()}.${ext}`;
	const filePathGitHub = `uploads/${fileName}`;
	const base64Content = Buffer.from(buffer).toString("base64");

	let targetRepo =
		repos[Math.floor(Math.random() * repos.length)];

	try {
		await ensureRepoExists(targetRepo);
	} catch {
		targetRepo = generateRepoName();
		await ensureRepoExists(targetRepo);
	}

	await axios.put(
		`https://api.github.com/repos/${global.userGh}/${targetRepo}/contents/${filePathGitHub}`,
		{
			message: `Upload file ${fileName}`,
			content: base64Content,
			branch
		},
		{
			headers: {
				Authorization: `Bearer ${global.ghTokens}`,
				"User-Agent": "Mozilla/5.0",
				Accept: "application/vnd.github+json"
			},
			maxContentLength: Infinity,
			maxBodyLength: Infinity,
			timeout: 30000
		}
	);

	return `https://raw.githubusercontent.com/${global.userGh}/${targetRepo}/${branch}/${filePathGitHub}`;
}

function resolveImageSource(m) {
	if (m.quoted?.mtype === 'imageMessage' || m.quoted?.message?.imageMessage) {
		return m.quoted;
	}

	if (m.mtype === 'imageMessage' || m.message?.imageMessage) {
		return m;
	}

	return null;
}

const handler = async (m, { usedPrefix, command }) => {
	const target = resolveImageSource(m);
	const rawText = (m.text || m.quoted?.text || '').trim();
	const args = rawText.split(/\s+/).filter(Boolean);

	const type = args.find(a => ['thumb', 'reply'].includes(a.toLowerCase()))?.toLowerCase();

	if (!target || !type) {
		return m.reply(
			`*Contoh:*\n- Kirim foto dengan caption: ${usedPrefix + command} thumb\n- Reply foto lalu ketik: ${usedPrefix + command} reply\n\n*Pilihan:* thumb / reply`
		);
	}

	await m.react("⌛");

	try {
		const buf = await target.download();

		if (!buf) {
			return m.reply("❌ Gagal mendownload foto");
		}

		const link = await uploadFile(
			buf,
			`upload_${Date.now()}.jpg`
		);

		const settingsPath = path.resolve("./settings.js");
		let content = fs.readFileSync(settingsPath, "utf-8");

		if (type === "thumb") {
			const regex =
				/global\.thumbnail\s*=\s*['"`][^'"`]*['"`]/;

			if (!regex.test(content)) {
				return m.reply(
					"Variable `global.thumbnail` tidak ditemukan di settings.js"
				);
			}

			content = content.replace(
				regex,
				`global.thumbnail = '${link}'`
			);

			fs.writeFileSync(settingsPath, content);
			global.thumbnail = link;

			await m.reply(
				`Thumbnail menu berhasil diganti!\n\nURL: ${link}`
			);
		}

		if (type === "reply") {
			const regex =
				/global\.fotoreply\s*=\s*['"`][^'"`]*['"`]/;

			if (!regex.test(content)) {
				return m.reply(
					"Variable `global.fotoreply` tidak ditemukan di settings.js"
				);
			}

			content = content.replace(
				regex,
				`global.fotoreply = '${link}'`
			);

			fs.writeFileSync(settingsPath, content);
			global.fotoreply = link;

			delete global.fotoreplyThumb;

			await m.reply(
				`Thumbnail reply berhasil diganti!\n\nURL: ${link}`
			);
		}
	} catch (e) {
		console.error(e);
		await m.reply(`❌ Error: ${e.message}`);
	}
};

handler.command = ["change", "ubah"];
handler.owner = true;
handler.noJadiBot = true
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "owner"})
