// Port dari 'plugin baru' (beautify.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const beautifyJS = (code) => {
	try {
		return code
			.replace(/([=+\-*/%<>!&|^])\s*([=+\-*/%<>!&|^])/g, '$1 $2')
			.replace(/([=+\-*/%<>!&|^])\s*([^=+\-*/%<>!&|^])/g, '$1 $2')
			.replace(/,(?!\s)/g, ', ')
			.replace(/;(?!\s|\n)/g, '; ')
			.replace(/function\s*\(/g, 'function (') 			.replace(/\)\s*{/g, ') {')
			.replace(/(if|for|while|switch)\s*\(/g, '$1 (')
			.replace(/:\s*(?!\s)/g, ': ')
			.replace(/\[\s+/g, '[') 			.replace(/\s+\]/g, ']')
			.replace(/{\s*([^}]+)\s*}/g, (match, content) => {
				if (content.includes(';') || content.includes('{')) {
					return '{\n    ' + content.trim().replace(/;\s*/g, ';\n    ').replace(/\n\s*$/, '\n') + '}';
				}
				return match;
			})
			.replace(/;\s*}/g, ';\n}')
			.replace(/}\s*else\s*{/g, '} else {')
			.replace(/}\s*catch\s*\(/g, '} catch (')
			.replace(/}\s*finally\s*{/g, '} finally {');
	} catch {
		return code;
	}
};

const beautifyCSS = (code) => {
	try {
		return code
			.replace(/([^{\s])\s*{/g, '$1 {')
			.replace(/:\s*([^;]+)/g, ': $1')
			.replace(/,(?!\s)/g, ', ')
			.replace(/{([^}]+)}/g, (match, content) => {
				const props = content.split(';').filter(p => p.trim());
				if (props.length > 1) {
					return '{\n    ' + props.map(p => p.trim()).join(';\n    ') + ';\n}';
				}
				return match;
			});
	} catch {
		return code;
	}
};

const beautifyHTML = (code) => {
	try {
		return code
			.replace(/>\s*</g, '>\n<')
			.replace(/(<[^\/][^>]*>)([^<]*<)/g, '$1\n    $2')
			.replace(/([^\/])>/g, '$1 >')
			.replace(/\s+>/g, '>')
			.replace(/\s+/g, ' ')
			.replace(/>\s+</g, '><')
			.trim();
	} catch {
		return code;
	}
};

const beautifyJSON = (code) => {
	try {
		const parsed = JSON.parse(code);
		return JSON.stringify(parsed, null, 2);
	} catch {
		return code;
	}
};

const detectLang = (code) => {
	if (/^\s*[\{\[]/.test(code) && /[\}\]]\s*$/.test(code)) return 'json';
	if (/<html|<div|<body|<head|<!DOCTYPE/i.test(code)) return 'html';
	if (/\{[\s\S]*:\s*[\s\S]*\}/.test(code) && /@media|#|\./.test(code)) return 'css';
	return 'javascript';
};

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const input = text || (m.quoted && (m.quoted.text || m.quoted.caption));

	if (!input) {
		return reply(`*BEAUTIFY CODE*\n\n*Contoh Penggunaan:*\nBalas pesan kode atau ketik:\n\`${pfx + command} <code>\``);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	const lang = detectLang(input);
	let result = input;

	try {
		const res = await fetch('https://api.beautifier.io/api/beautify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ source: input, type: lang, options: { indent_size: 2 } }),
			signal: AbortSignal.timeout(6000)
		});

		if (res.ok) {
			const d = await res.json();
			result = d.data || d.beautified || d.result || input;
		} else {
			throw new Error('Fallback local beautifier');
		}
	} catch {
		if (lang === 'json') result = beautifyJSON(input);
		else if (lang === 'html') result = beautifyHTML(input);
		else if (lang === 'css') result = beautifyCSS(input);
		else result = beautifyJS(input);
	}

	await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	return await reply(`✨ *BEAUTIFY CODE (${lang.toUpperCase()})*\n\n\`\`\`${result}\`\`\``);
};

handler.help = ['beautify <reply/kode>'];
handler.tags = ['tools'];
handler.command = ['beautify', 'beautycode', 'formatcode'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "tools"})
