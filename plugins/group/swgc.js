// Port dari 'plugin baru' (swgc.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const {PassThrough} = require('stream')
const ffmpeg = require('fluent-ffmpeg')
const {prepareWAMessageMedia} = require('@whiskeysockets/baileys')

let handler = async (m, { sock, text, usedPrefix }) => {
	let args = (text || '')
		.split('|')
		.map(v => v.trim())
		.filter(v => v)

	let teks = ''
	let warna = ''
	let target = ''

	for (let v of args) {
		if (/chat\.whatsapp\.com\//i.test(v)) {
			target = v
		} else if (/@g\.us$/.test(v) || /^\d+$/.test(v)) {
			target = v
		} else if (!teks) {
			teks = v
		} else if (!warna) {
			warna = v
		}
	}

	let jid = m.chat

	if (target) {
		if (/chat\.whatsapp\.com\//i.test(target)) {
			const code = target.split('chat.whatsapp.com/')[1]
			try {
				const info = await sock.groupGetInviteInfo(code)
				jid = info.id
			} catch {
				return m.reply('Link grup tidak valid / bot belum join')
			}
		} else {
			jid = /^\d+$/.test(target) ? target + '@g.us' : target
		}
	}
	
	const quoted = m.quoted || m
	const mime = quoted.mimetype || ''
	const hasMedia = !!mime
	const caption = teks || quoted.caption || ''

	const warnaMap = {
		biru: '#34B7F1',
		hijau: '#25D366',
		kuning: '#FFD700',
		jingga: '#FF8C00',
		merah: '#FF3B30',
		ungu: '#9C27B0',
		abu: '#9E9E9E',
		cyan: '#00BCD4'
	}

	const colors = Object.values(warnaMap)
	const bgColor = warna
		? warnaMap[warna.toLowerCase()]
		: colors[Math.floor(Math.random() * colors.length)]

	if (!caption && !hasMedia) {
		return m.reply(`${usedPrefix}swgc text nya, atau reply video, foto, sticker, atau audio`)
	}

	try {
		if (/image/i.test(mime)) {
			const buffer = await quoted.download()
			await sendGroupStatus(jid, sock, {
				message: { imageMessage: { download: async () => buffer, caption } }
			})
		}

		if (/video/i.test(mime)) {
			const buffer = await quoted.download()
			await sendGroupStatus(jid, sock, {
				message: { videoMessage: { download: async () => buffer, caption } }
			})
		}

		if (/audio/i.test(mime)) {
			const buffer = await quoted.download()
			const vn = await toVN(buffer)
			await sendGroupStatus(jid, sock, {
				message: {
					audioMessage: {
						download: async () => vn,
						mimetype: 'audio/ogg; codecs=opus',
						ptt: true,
						seconds: quoted.seconds || 0
					}
				}
			})
		}

		if (/sticker/i.test(mime)) {
			const buffer = await quoted.download()
			await sock.sendMessage(jid, {
				sticker: buffer,
				contextInfo: { isGroupStatus: true }
			})
		}

		await sendGroupStatus(jid, sock, {
			text: caption,
			background: bgColor
		})
	} catch (e) {
		return m.reply(`Gagal upload status!\n${e.message || e}`)
	}
}

async function toVN(buffer) {
	return new Promise((resolve, reject) => {
		const input = new PassThrough()
		const output = new PassThrough()
		const chunks = []

		input.end(buffer)

		ffmpeg(input)
			.noVideo()
			.audioCodec('libopus')
			.format('ogg')
			.on('error', reject)
			.on('end', () => resolve(Buffer.concat(chunks)))
			.pipe(output)

		output.on('data', c => chunks.push(c))
	})
}

async function sendGroupStatus(jid, sock, options = {}) {
	const { text, background, message } = options
	let msg = {}

	const baseContext = {
		forwardingScore: 0,
		featureEligibilities: {
			canBeReshared: true,
			canReceiveMultiReact: true
		},
		statusSourceType: 4,
		statusAttributions: [{ type: 10 }],
		isGroupStatus: true,
		pairedMediaType: 'NOT_PAIRED_MEDIA',
		statusAudienceMetadata: { audienceType: 1 }
	}

	if (message) {
		const type = Object.keys(message)[0]
		const content = message[type]

		if (type === 'audioMessage') {
			let audio, mimetype, ptt, seconds
			if (content.download) {
				audio = await content.download()
				mimetype = content.mimetype || content.msg?.mimetype
				ptt = content.ptt
				seconds = content.seconds
			} else {
				audio = content.audio
				mimetype = content.mimetype
				ptt = content.ptt
				seconds = content.seconds
			}
			const media = await prepareWAMessageMedia({ audio }, {
				upload: sock.waUploadToServer
			})
			msg = {
				audioMessage: {
					...media.audioMessage,
					mimetype: mimetype || 'audio/ogg; codecs=opus',
					ptt,
					seconds,
					contextInfo: baseContext
				}
			}
		} else if (type === 'imageMessage' || type === 'videoMessage') {
			let baper
			if (content.download) {
				baper = await content.download()
			} else {
				baper = content[type === 'imageMessage' ? 'image' : 'video']
			}
			const media = await prepareWAMessageMedia({
				[type === 'imageMessage' ? 'image' : 'video']: baper
			}, {
				upload: sock.waUploadToServer
			})
			msg = {
				[type]: {
					...(type === 'imageMessage' ? media.imageMessage : media.videoMessage),
					caption: content.caption || '',
					contextInfo: baseContext
				}
			}
		}
	} else {
		msg = {
			extendedTextMessage: {
				text,
				backgroundArgb: background ? parseInt(background.replace('#', 'FF'), 16) : undefined,
				font: 5,
				contextInfo: baseContext
			}
		}
	}

	return await sock.relayMessage(jid, msg, {})
}

handler.command = ['swgc']
handler.owner = true
handler.noJadiBot = true
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "group", "extra": ["statusgrup", "gcstatus", "upswgc"]})
