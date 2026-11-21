/**
 * MessageBuilder.js — AIRich (rich response / kartu Meta-AI WhatsApp) untuk Christy Bot.
 *
 * Port mandiri dari NIXCODE "MessageBuilderV4.7" (Created by Nixel) yang disesuaikan
 * agar BISA DIPAKAI DI SC CHRISTY TANPA MENGUBAH SATU FILE SC PUN:
 *  - TIDAK import paket 'baileys'/'sharp'/'fluent-ffmpeg' (SC ini memakai fork
 *    '@itsliaaa/baileys'), semua payload dibangun manual lalu dikirim lewat
 *    conn.relayMessage — pola yang sama dengan plugin bawaan (ping.js, monopoli, dll).
 *  - API yang dipakai plugin dipertahankan identik:
 *        const rich = new AIRich(conn)
 *        rich.addImage(url, { width, height })
 *        rich.addSection({ view_model: { ... } })
 *        rich.addText('...')
 *        await rich.send(m.chat, { quoted: m })
 *
 * Kredit asli: NIXEL — MessageBuilderV4.7
 * https://gist.github.com/ValdazGT/adc8b767a082d18d12ff3e7f01b78651
 */

'use strict';

import crypto from 'crypto';

const VERSION = '4.7';

/* ═══════════════ helper ═══════════════ */

// JSON stringify + escape karakter non-ASCII (sama persis dengan aslinya)
const ESCAPE_RE = new RegExp('[' + String.fromCharCode(0x7f) + '-' + String.fromCharCode(0xffff) + ']', 'g');

function stringifyEscaped(obj) {
	return JSON.stringify(obj).replace(ESCAPE_RE, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
}

async function waitAllPromises(input) {
	const isPromise = (v) => v && typeof v.then === 'function';
	const isObject = (v) => v && typeof v === 'object' && v !== null;
	const deep = async (v) => {
		if (isPromise(v)) return deep(await v);
		if (Array.isArray(v)) return Promise.all(v.map(deep));
		if (isObject(v)) {
			const entries = await Promise.all(Object.entries(v).map(async ([k, val]) => [k, await deep(val)]));
			return Object.fromEntries(entries);
		}
		return v;
	};
	return deep(await input);
}

// Parser markdown [teks](url) / []citation / [latex](url) -> inline_entities
function extractIE(text, { extract = true, hyperlink = true, citation = true, latex = true } = {}) {
	if (!extract) return { text, ie: [], inline_entities: [] };

	const createIE = (type, ie) => {
		if (type == 'hyperlink') {
			return {
				key: ie.key,
				metadata: { display_name: ie.text, is_trusted: ie.is_trusted, url: ie.url, __typename: 'GenAIInlineLinkItem' },
			};
		}
		if (type == 'citation') {
			return {
				key: ie.key,
				metadata: {
					reference_id: ie.reference_id,
					reference_url: ie.url,
					reference_title: ie.url,
					reference_display_name: ie.url,
					sources: [],
					__typename: 'GenAISearchCitationItem',
				},
			};
		}
		if (type == 'latex') {
			return {
				key: ie.key,
				metadata: {
					latex_expression: ie.text,
					latex_image: { url: ie.url, width: Number(ie.width) || 100, height: Number(ie.height) || 100 },
					font_height: Number(ie.font_height) || 83.333333333333,
					padding: Number(ie.padding) || 15,
					__typename: 'GenAILatexItem',
				},
			};
		}
	};

	let ie = [];
	let inline_entities = [];
	let result = '';
	let last = 0;
	let citation_index = 1;
	let hyperlink_index = 0;
	let latex_index = 0;
	const stack = [];

	for (let i = 0; i < text.length; i++) {
		if (text[i] == '[' && text[i - 1] != '\\') {
			stack.push(i);
		} else if (text[i] == ']' && (text[i + 1] == '(' || text[i + 1] == '<')) {
			const start = stack.pop();
			if (start == null) continue;

			const open = text[i + 1];
			const close = open == '(' ? ')' : '>';
			const type = open == '(' ? 'link' : 'latex';
			let end = i + 2;
			let depth = 1;

			while (end < text.length && depth) {
				if (text[end] == open && text[end - 1] != '\\') depth++;
				else if (text[end] == close && text[end - 1] != '\\') depth--;
				end++;
			}
			if (depth) continue;

			const raw = text.slice(start + 1, i).trim();
			let url = text.slice(i + 2, end - 1).trim();

			let key;
			let tag;
			let data;

			if (type == 'latex') {
				if (!latex) continue;
				const [txt = '', width = null, height = null, font_height = null, padding = null] = raw.split('|');
				key = 'NIXEL_LATEX_' + latex_index++;
				tag = '{{' + key + '}}' + (txt || 'image') + '{{/' + key + '}}';
				data = { type: 'latex', ie: { key, text: txt, url, width, height, font_height, padding } };
			} else if (raw) {
				if (!hyperlink) continue;
				const trusted = !url.startsWith('!');
				if (!trusted) url = url.slice(1);
				key = 'NIXEL_HYPERLINK_' + hyperlink_index++;
				tag = '{{' + key + '}}' + url + '{{/' + key + '}}';
				data = { type: 'hyperlink', ie: { key, text: raw, url, is_trusted: trusted } };
			} else {
				if (!citation) continue;
				key = 'NIXEL_CITATION_' + (citation_index - 1);
				tag = '{{' + key + '}}' + url + '{{/' + key + '}}';
				data = { type: 'citation', ie: { reference_id: citation_index++, key, text: '', url } };
			}

			result += text.slice(last, start) + tag;
			last = end;
			ie.push(data);
			const entity = createIE(data.type, data.ie);
			if (entity) inline_entities.push(entity);
			i = end - 1;
		}
	}

	result += text.slice(last);
	return { text: result, ie, inline_entities };
}

function guessMime(url) {
	const u = String(url || '').split('?')[0].toLowerCase();
	if (u.endsWith('.jpg') || u.endsWith('.jpeg')) return 'image/jpeg';
	if (u.endsWith('.webp')) return 'image/webp';
	if (u.endsWith('.gif')) return 'image/gif';
	return 'image/png';
}

function generateMessageID() {
	return '3EB0' + crypto.randomBytes(9).toString('hex').toUpperCase();
}

/* ═══════════════ AIRich ═══════════════ */

export class AIRich {
	#client;

	constructor(client, { dynamic = true } = {}) {
		if (!client) throw new Error('Socket is required');
		this.#client = client;
		this._title = '';
		this._footer = '';
		this._contextInfo = {};
		this._nodes = [];
		this._dynamic = !!dynamic;
		this._lastMessageKey = null;
		this.refreshIds();
	}

	refreshIds() {
		this._responseId = crypto.randomUUID();
		this._botResponseId = crypto.randomUUID();
		return this;
	}

	get client() {
		return this.#client;
	}

	static newLayout(name, data) {
		return {
			view_model: {
				[Array.isArray(data) ? 'primitives' : 'primitive']: data,
				__typename: 'GenAI' + name + 'LayoutViewModel',
			},
		};
	}

	static stringifyEscaped(obj) {
		return stringifyEscaped(obj);
	}

	static generateVerificationMetadata() {
		const signatureMaterial = Buffer.from('NIXEL.MessageBuilderV' + VERSION + '-VerificationSignature.Metadata');
		const certificateMaterial = Buffer.from('NIXEL.MessageBuilderV' + VERSION + '-CertificateChain.Metadata');
		const signature = Buffer.concat([signatureMaterial, crypto.randomBytes(Math.max(0, 64 - signatureMaterial.length))]).toString('base64');
		const certificateChain = [
			Buffer.concat([certificateMaterial, crypto.randomBytes(Math.max(0, 684 - certificateMaterial.length))]).toString('base64'),
			Buffer.concat([certificateMaterial, crypto.randomBytes(Math.max(0, 892 - certificateMaterial.length))]).toString('base64'),
		];
		return { proofs: [{ version: 1, useCase: 1, signature, certificateChain }] };
	}

	setTitle(title) {
		if (typeof title !== 'string') throw new TypeError('Title must be a string');
		this._title = title;
		return this;
	}

	setFooter(footer) {
		if (typeof footer !== 'string') throw new TypeError('Footer must be a string');
		this._footer = footer;
		return this;
	}

	setContextInfo(obj) {
		if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) throw new TypeError('ContextInfo must be a plain object');
		this._contextInfo = obj;
		return this;
	}

	_addContent(sections, submessages) {
		for (const s of [].concat(sections || [])) this._nodes.push({ section: s, submessage: null });
		for (const sb of [].concat(submessages || [])) this._nodes.push({ section: null, submessage: sb });
		return this;
	}

	get _sections() {
		return this._nodes.filter((n) => n.section !== null).map((n) => n.section);
	}

	get _submessages() {
		return this._nodes.filter((n) => n.submessage !== null).map((n) => n.submessage);
	}

	#resolveMedia(media) {
		if (typeof media === 'string') return media;
		if (media && typeof media === 'object' && typeof media.url === 'string') return media.url;
		if (Buffer.isBuffer(media)) {
			if (!this.#client?.waUploadToServer) throw new TypeError('Buffer butuh conn.waUploadToServer — kirim URL saja');
			return this.#client.waUploadToServer(media, {}).then((r) => r?.mediaUrl || r?.url || '');
		}
		throw new TypeError('imageUrl must be string | buffer | {url}');
	}

	addText(text, { extract = true, hyperlink = true, citation = true, latex = true } = {}) {
		if (typeof text !== 'string') throw new TypeError('Text must be a string');
		const { text: extractedText, inline_entities } = extractIE(text, { extract, hyperlink, citation, latex });
		const section = AIRich.newLayout('Single', {
			text: extractedText,
			...(inline_entities.length && { inline_entities }),
			__typename: 'GenAIMarkdownTextUXPrimitive',
		});
		return this._addContent(section, [{ messageType: 2, messageText: text }]);
	}

	addImage(imageUrl, { width, height, status = 'READY', update_text } = {}) {
		const urls = (Array.isArray(imageUrl) ? imageUrl : [imageUrl]).map((v) => this.#resolveMedia(v));
		const sections = urls.map((url) =>
			AIRich.newLayout('Single', {
				media: { url, mime_type: guessMime(url), width, height },
				imagine_type: 'IMAGE',
				status: { status, update_text },
				__typename: 'GenAIImaginePrimitive',
			})
		);
		const submessage = {
			messageType: 1,
			gridImageMetadata: {
				gridImageUrl: { imagePreviewUrl: urls[0] },
				imageUrls: urls.map((url) => ({ imagePreviewUrl: url, imageHighResUrl: url, sourceUrl: url })),
			},
		};
		return this._addContent(sections, submessage);
	}

	/**
	 * Compatibility adapter for plugins using addCompact(options).
	 * Composes a compact social action row and optional supporting text.
	 * Image is avatar metadata only, never a full-size image block.
	 * This is not an implementation of every third-party builder API.
	 * Credit: original AIRich/NIXEL implementation retained above.
	 */
	addCompact(options = {}) {
		if (!options || typeof options !== 'object' || Array.isArray(options)) {
			throw new TypeError('addCompact options must be an object');
		}
		const {
			title = '', subtitle = '', secondary_subtitle = '', image,
			entity_id, entity_url, entity_type = 'WEBSITE',
			action_type = 'OPEN_URL', is_verified,
		} = options;

		for (const [key, value] of Object.entries({ title, subtitle, secondary_subtitle })) {
			if (typeof value !== 'string') throw new TypeError(key + ' must be a string');
		}
		if (entity_url != null && typeof entity_url !== 'string') {
			throw new TypeError('entity_url must be a string');
		}
		if (action_type !== 'OPEN_URL') {
			throw new TypeError('addCompact supports OPEN_URL only');
		}
		let url;
		if (entity_url) {
			url = new URL(entity_url);
			if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
				throw new TypeError('entity_url must be an HTTP(S) URL without credentials');
			}
		}
		if (is_verified != null && typeof is_verified !== 'boolean') {
			throw new TypeError('is_verified must be a boolean when provided');
		}
		// Resolve first so invalid media does not leave a half-built card.
		const mediaUrl = image == null ? null : this.#resolveMedia(image);
		// Compact layout: image is only social-entity avatar metadata.
		// Never create a large GenAIImaginePrimitive for a compact card.
		if (url) {
			const key = 'compact_' + crypto.randomBytes(6).toString('hex');
			const label = title || subtitle || url.hostname;
			const metadata = {
				__typename: 'GenAISocialEntityItem',
				entity_id: String(entity_id ?? url.href),
				entity_name: label,
				entity_full_name: label,
				entity_url: url.href,
				entity_type,
				...(mediaUrl ? { entity_picture_url: mediaUrl } : {}),
				...(typeof is_verified === 'boolean' ? { is_verified } : {}),
			};
			this.addSection(AIRich.newLayout('ActionRow', [{
				text: '{{' + key + '}}' + label.replace(/[{}]/g, '') + '{{/' + key + '}}',
				inline_entities: [{ key, metadata }],
				__typename: 'GenAIMarkdownTextUXPrimitive',
			}]));
			// Keep a text fallback in the rich-response submessages.
			this._addContent(null, [{ messageType: 2, messageText: label + '\n' + url.href }]);
		}
		if (!url && title) this.addText(title, { extract: false });
		const details = [subtitle, secondary_subtitle].filter(Boolean).join(' · ');
		if (details && details !== title) this.addText(details, { extract: false });
		return this;
	}

	/** Minimal profile layout. Actual rendering is controlled by WhatsApp. */
	addProfileCard(options = {}) {
		if (!options || typeof options !== 'object' || Array.isArray(options)) {
			throw new TypeError('addProfileCard options must be an object');
		}
		const { username, image, posts, followers, following, biography = '' } = options;
		if (typeof username !== 'string' || !/^[a-zA-Z0-9._]{1,30}$/.test(username)) {
			throw new TypeError('A valid Instagram username is required');
		}
		if (typeof biography !== 'string') throw new TypeError('biography must be a string');
		let picture;
		if (image != null) {
			if (typeof image !== 'string') throw new TypeError('Profile image must be a URL string');
			const parsed = new URL(image);
			if (parsed.protocol !== 'https:' || parsed.username || parsed.password) {
				throw new TypeError('Profile image must use HTTPS without credentials');
			}
			picture = parsed.href;
		}
		const key = 'profile_' + crypto.randomBytes(6).toString('hex');
		const profileUrl = 'https://www.instagram.com/' + encodeURIComponent(username) + '/';
		// Avatar lives inside the social entity: no duplicated large image block.
		this.addSection(AIRich.newLayout('ActionRow', [{
			text: '{{' + key + '}}@' + username + '{{/' + key + '}}',
			inline_entities: [{ key, metadata: {
				__typename: 'GenAISocialEntityItem',
				entity_id: username,
				entity_name: username,
				entity_url: profileUrl,
				entity_type: 'IG_PROFILE',
				...(picture ? { entity_picture_url: picture } : {}),
			} }],
			__typename: 'GenAIMarkdownTextUXPrimitive',
		}]));
		this._addContent(null, [{ messageType: 2, messageText: '@' + username + '\n' + profileUrl }]);
		const stat = value => value == null || String(value).trim() === '' ? '—' : String(value).replace(/\s+/g, ' ').slice(0, 40);
		this.addText([
			stat(posts) + ' postingan',
			stat(followers) + ' pengikut',
			stat(following) + ' mengikuti',
		].join('  ·  '), { extract: false });
		const bio = biography.replace(/\s+/g, ' ').trim();
		if (bio) this.addText(bio.length > 220 ? bio.slice(0, 219) + '…' : bio, { extract: false });
		return this;
	}

	addSection(section) {
		if (!section || typeof section !== 'object') throw new TypeError('Section must be an object');
		return this._addContent([section], null);
	}

	async build(jid, { forwarded = true, notification = false, includesUnifiedResponse = true, includesSubmessages = true, quoted, quotedParticipant, messageId } = {}) {
		const forward = forwarded
			? { forwardingScore: 1, isForwarded: true, forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' }, forwardOrigin: 4 }
			: {};

		const notif = notification
			? { sessionTransparencyMetadata: { disclaimerText: '', hcaId: 'hca_' + Date.now(), sessionTransparencyType: 1 } }
			: {};

		const qObj = quoted
			? {
					stanzaId: quoted?.key?.id || quoted?.id,
					participant: quotedParticipant || quoted?.key?.participant || quoted?.participant || quoted?.key?.remoteJid,
					quotedType: 0,
					quotedMessage: typeof quoted === 'object' && quoted !== null ? (quoted.message ?? quoted) : undefined,
				}
			: {};

		const sections = [...(await waitAllPromises(this._sections))];
		if (this._footer) {
			sections.push(
				AIRich.newLayout('Single', {
					text: this._footer,
					__typename: 'GenAIMetadataTextPrimitive',
				})
			);
		}

		if (this._dynamic) this.refreshIds();

		const message = {
			messageContextInfo: {
				deviceListMetadata: {},
				deviceListMetadataVersion: 2,
				botMetadata: {
					messageDisclaimerText: this._title,
					...notif,
					verificationMetadata: AIRich.generateVerificationMetadata(),
					botResponseId: this._botResponseId,
				},
			},
			botForwardedMessage: {
				message: {
					richResponseMessage: {
						messageType: 1,
						submessages: includesSubmessages ? await waitAllPromises(this._submessages) : [],
						unifiedResponse: {
							data: includesUnifiedResponse
								? Buffer.from(stringifyEscaped({ response_id: this._responseId, sections })).toString('base64')
								: '',
						},
						contextInfo: { ...forward, ...qObj, ...this._contextInfo },
					},
				},
			},
		};

		const id = messageId || generateMessageID();
		return { key: { id, remoteJid: jid, fromMe: true }, message };
	}

	async send(jid, { bypassDownload = true, ...options } = {}) {
		const msg = await this.build(jid, options);
		await this.#client.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
		if ((options.includesUnifiedResponse ?? true) && bypassDownload) {
			await this.sendEdit(jid, msg.key.id, { msg: msg.message });
		}
		this._lastMessageKey = msg.key;
		return msg;
	}

	async buildEdit(targetJid, targetId, { msg, messageId } = {}) {
		if (!msg) msg = (await this.build(targetJid)).message;
		const message = {
			botForwardedMessage: {
				message: {
					protocolMessage: {
						key: { remoteJid: targetJid, fromMe: true, id: targetId },
						type: 14,
						editedMessage: msg,
					},
				},
			},
		};
		return { key: { id: messageId || generateMessageID(), remoteJid: targetJid, fromMe: true }, message };
	}

	async sendEdit(jid, id, { msg, messageId } = {}) {
		jid = jid ?? this._lastMessageKey?.remoteJid;
		id = id ?? this._lastMessageKey?.id;
		if (!jid) throw new Error('JID is required');
		if (!id) throw new Error('Message id is required');
		const msgEdit = await this.buildEdit(jid, id, { msg, messageId });
		await this.#client.relayMessage(jid, msgEdit.message, { messageId: msgEdit.key.id });
		return msgEdit;
	}
}

export default AIRich;