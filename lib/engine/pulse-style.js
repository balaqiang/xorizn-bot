// =====================================================================
//  lib/ztstyle.js — gaya teks vanXone untuk pesan bertombol vanXone:
//  huruf kecil small-caps, "⌯ judul", "- kunci : *nilai*", "▢ item".
//  Fungsi murni (tanpa efek samping).
// =====================================================================
'use strict'

const SMALLCAPS = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ',
  n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
}
const smallCaps = (s) => [...String(s)].map((c) => SMALLCAPS[c.toLowerCase()] || c).join('')


// ---------------------------------------------------------------- util kecil
const EMOJI_LEAD = /^(?:[\p{Extended_Pictographic}‍️⃣]+\s*)+/u
const stripLead = (s) => String(s || '').replace(EMOJI_LEAD, '').trim()
const plainMark = (s) => String(s || '').replace(/[*_~`]/g, '').trim()
const isFramed = (t) => (String(t).match(/^[ \t]*[╭╰┏┗┌└│┃┣├║╔╚]/gm) || []).length >= 3

function tone(text) {
  const t = String(text || '').trim()
  if (/^\s*(⏳|⌛|🔎|🔬)|^\s*(Mengunduh|Mencari|Membuat|Memproses|Menunggu|Sedang)/i.test(t)) return 'wait'
  if (/^\s*(❌|⚠️|🚫|⛔|✖)/.test(t) || /(^|\s)(gagal|error|tidak (ditemukan|bisa|valid|dapat)|ditolak|dilarang|kesalahan)(\s|[.!:]|$)/i.test(t.slice(0, 160))) return 'fail'
  if (/^\s*(✅|☑️|✔|🎉|🥳)/.test(t) || /^\s*(berhasil|sukses|selesai)\b/i.test(t)) return 'ok'
  if (/(^|\n)\s*(contoh|cara (pakai|penggunaan)|penggunaan|usage|format)\s*[:：]/i.test(t) && t.length < 600) return 'usage'
  return 'info'
}

// ---------------------------------------------------------------- parser teks -> blok
const KV = /^[\s>•▪▫◦➥➤►▸▹┃│┣┗├└·*\-–—]*(?:[\p{Extended_Pictographic}️⃣]+\s*)?\*?([^\s:：*.!?,][^:：.!?,\n]{0,30}?)\*?\s*[:：]\s*(\S.*)$/u
const LI = /^\s*(?:(\d{1,3})[.)]|[-•*▪▫◦➥➤►▸▹·])\s+(\S.*)$/u

function parse(text, meta = {}) {
  const src = String(text || '').replace(/\r/g, '').replace(/[ \t]+$/gm, '').trim()
  const lines = src.split('\n')
  const out = { tone: tone(src), title: '', blocks: [], raw: src }

  // judul = baris pertama pendek tanpa titik dua, diikuti baris kosong / data
  let i = 0
  const first = lines[0] || ''
  const f = plainMark(stripLead(first))
  if (f && f.length <= 48 && !/[:：]\s*\S/.test(first) && !/^https?:/i.test(f) && !/[.!?]$/.test(f) && lines.length > 1 && (lines[1].trim() === '' || KV.test(lines[1]) || LI.test(lines[1]))) {
    out.title = f
    i = 1
  }
  const push = (type, item) => {
    const last = out.blocks[out.blocks.length - 1]
    if (last && last.type === type && !last.sealed) last.items.push(item)
    else out.blocks.push({ type, items: [item] })
  }
  for (; i < lines.length; i++) {
    const ln = lines[i]
    if (!ln.trim()) {
      const last = out.blocks[out.blocks.length - 1]
      if (last) last.sealed = true
      continue
    }
    const kv = !/^\s*https?:/i.test(ln) && ln.match(KV)
    if (kv && !/\s{2,}/.test(kv[1]) && kv[1].split(/\s+/).length <= 4) { push('kv', [plainMark(kv[1]), kv[2].trim()]); continue }
    const li = ln.match(LI)
    if (li) { push('list', { n: li[1] || '', t: li[2].trim() }); continue }
    push('text', ln.trim())
  }
  out.hasData = out.blocks.some((b) => b.type === 'kv' || b.type === 'list')
  out.meta = meta
  return out
}


const TONE_WORD = { ok: 'success', fail: 'failed', wait: 'processing', usage: 'usage', info: '' }
const EMOJI_LEAD_RE = EMOJI_LEAD

// balasan tanpa data: [judul, isi]
function simple(p) {
  let body = p.blocks.map((b) => (b.type === 'text' ? b.items.join('\n') : '')).join('\n\n')
  if (p.title) return [p.title, body]
  return ['', body]
}


// ===== MODE 3 — ZEROTWO =====
function zerotwo(p, o = {}) {
  const S = smallCaps
  if (!p.hasData) {
    const [t, body] = simple(p)
    return t ? `${S(`*⌯ ${t}*`)}\n${body}` : body
  }
  const out = [S(`*⌯ ${p.title || o.title || TONE_WORD[p.tone] || 'info'}*`)]
  for (const b of p.blocks) {
    if (b.type === 'kv') for (const [k, v] of b.items) out.push(`- ${S(k)} : *${v}*`)
    else if (b.type === 'list') for (const it of b.items) out.push(`▢ ${it.t}`)
    else for (const t of b.items) out.push(t)
    out.push('')
  }
  while (out.length && out[out.length - 1] === '') out.pop()
  return out.join('\n')
}


// teks bebas -> gaya vanXone (teks yang sudah bergaya vanXone dibiarkan)
function style(text, meta = {}) {
  const t = String(text || '')
  if (!t.trim() || t.includes('⌯') || t.length > 3500) return t
  try { return zerotwo(parse(t, meta), meta) } catch { return t }
}

module.exports = { smallCaps, stripLead, plainMark, tone, parse, zerotwo, style }
