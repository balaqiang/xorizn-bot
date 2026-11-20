import { GlobalFonts, loadImage } from '@napi-rs/canvas';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONT_DIR = join(__dirname, '../../data/trash');
export const DEFAULT_AVATAR_PATH = join(process.cwd(), 'media/avatar_contact.png');

const FONT_SOURCES = [
	{
		// Font Inter dari CDN jsDelivr (cepat & tidak limit 404)
		url: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf',
		file: 'Inter.ttf',
		family: 'Inter',
	},
	{
		// URL alternatif Noto Color Emoji yang valid
		url: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@main/fonts/NotoColorEmoji.ttf',
		file: 'NotoColorEmoji.ttf',
		family: 'NotoEmoji',
	},
];

let fontsReady = false;

export async function ensureCanvasFonts() {
	if (fontsReady) return;
	if (!existsSync(FONT_DIR)) mkdirSync(FONT_DIR, { recursive: true });
	
	try {
		const { default: axios } = await import('axios');
		for (const f of FONT_SOURCES) {
			const p = join(FONT_DIR, f.file);
			if (!existsSync(p)) {
				try {
					const { data } = await axios.get(f.url, { 
						responseType: 'arraybuffer', 
						timeout: 30000,
						headers: { 'User-Agent': 'Mozilla/5.0' }
					});
					writeFileSync(p, Buffer.from(data));
				} catch (e) {
					// Abaikan jika font emoji gagal download, canvas tetap jalan pakai Inter
					if (f.file !== 'NotoColorEmoji.ttf') {
						console.error('[canvas-font-fetch-error]', f.file, e.message);
					}
				}
			}
			if (existsSync(p)) {
				try { GlobalFonts.registerFromPath(p, f.family); } catch (_) {}
			}
		}
	} catch (err) {
		console.error('[ensureCanvasFonts-error]', err);
	}
	fontsReady = true;
}

export async function loadAvatarImage(ppUrl) {
	if (ppUrl) {
		try {
			return await loadImage(ppUrl);
		} catch (_) {}
	}
	if (existsSync(DEFAULT_AVATAR_PATH)) {
		try {
			return await loadImage(DEFAULT_AVATAR_PATH);
		} catch (_) {}
	}
	return null;
}

export const FONT_FAMILY = 'Inter, NotoEmoji, Arial, sans-serif';