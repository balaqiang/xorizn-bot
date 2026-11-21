/**
 ╔══════════════════════
     ⧉  [bingimage] — [search]
╚══════════════════════

  ✺ Type     : Plugin ESM
  ✺ Source   : https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R
  ✺ Creator  : SXZnightmare
  ✺ Scrape      : 
  [ ytta ]
  ✺ Scrape Maker : [ Z7 ]
  ✺ Req    : Z7 [ Theresa ex Apocalypse ]
*/

async function fetchText(url, headers = {}) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "id,en;q=0.9",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            ...headers
        },
        signal: controller.signal
    });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
}

function htmlUnescape(str) {
    return str
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}

function guessImageName(url) {
    try {
        const u = new URL(url);
        return decodeURIComponent(u.pathname.split("/").pop() || "image");
    } catch {
        return "image";
    }
}

function attrPick(tag, name) {
    const r = new RegExp(`${name}=["']([^"']+)["']`, "i");
    const m = r.exec(tag);
    return m ? m[1] : null;
}

function shuffleArray(arr, seed = 0) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = (i * seed + Date.now()) % a.length;
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

async function scrapeBingPage(query, start) {
    const q = encodeURIComponent(query.trim());
    const url = `https://www.bing.com/images/search?q=${q}&FORM=HDRSC2${start ? `&first=${start}` : ""}`;
    const html = await fetchText(url);
    const out = [];
    const tagRe = /<a[^>]*class=["'][^"']*\biusc\b[^"']*["'][^>]*>/gi;
    for (const tag of html.match(tagRe) || []) {
        try {
            const mAttr = attrPick(tag, "m");
            if (!mAttr) continue;
            const m = JSON.parse(htmlUnescape(mAttr));
            const img = m.murl || m.imgurl;
            if (!img) continue;
            out.push({
                image_name: guessImageName(img),
                preview_url: m.turl || null,
                original_url: img
            });
        } catch {}
    }
    return out;
}

async function getBingImages(query, limit) {
    const results = [];
    let start = 0;
    for (let i = 0; i < 3 && results.length < limit; i++) {
        const chunk = await scrapeBingPage(query, start);
        for (const r of chunk) {
            const exists = results.some(existing => existing.original_url === r.original_url);
            if (!exists) {
                results.push(r);
                if (results.length >= limit) break;
            }
        }
        start += 35;
    }
    return results;
}

export {
    scrapeBingPage,
    getBingImages
};

export default {
    scrapeBingPage,
    getBingImages
};
