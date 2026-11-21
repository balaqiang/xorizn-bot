/**
 * Elysia AI — WhatsApp Bot
 * 
 * Library      : @whiskeysockets/baileys
 * Type         : Scraper Module | ESM
 * Recode       : (Your Name)
 * 
 * Official Channels:
 * • https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R
 * 
 * Copyright © sahril2nd 2026
 * All Rights Reserved.
 */

import * as cheerio from 'cheerio';

class BrandCrowdScraper {
	constructor() {
		this.BASE_URL = 'https://www.brandcrowd.com/maker/logos/page1';
	}

	async searchLogos(query) {
		if (!query) throw new Error('Query teks nama logo tidak boleh kosong.');

		const url = `${this.BASE_URL}?Text=${encodeURIComponent(query)}&TextChanged=true&SearchText&KeywordChanged=true&LogoStyle=0&FontStyles&Colors&FilterByTags`;

		const res = await fetch(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
			},
			signal: AbortSignal.timeout(25000)
		});

		if (!res.ok) throw new Error(`BrandCrowd respons gagal (${res.status})`);

		const html = await res.text();
		const $ = cheerio.load(html);

		const logos = $('img[src^="https://dynamic.brandcrowd.com"]')
			.map((_, el) => $(el).attr('src'))
			.get()
			.filter(Boolean);

		return logos;
	}
}

export default new BrandCrowdScraper();