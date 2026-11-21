// lib/fmt.js — format keluaran bergaya xorizn-bot (judul tebal, garis pemisah, baris "emoji *Label* : nilai", footer)
// Dipakai dua cara:
//   1) Helper untuk plugin:  fmt.card({ icon, title, rows, sections, tip })  /  fmt.usage(...)  /  fmt.ok(...)  /  fmt.fail(...)
//   2) install(sock): semua balasan TEKS fitur yang masih polos dirapikan otomatis (logika fitur tidak disentuh).
// Teks hasil format tetap terbaca oleh parser richui (judul, baris kv, divider, Contoh:).
'use strict'

const LINE = '──────────────────────'
const brand = () => String(global.botname || 'xorizn-bot')
const foot = () => `Powering ${brand()} Information System ✨`

const up = (s) => String(s || '').replace(/[-_]+/g, ' ').trim().toUpperCase()
const has = (v) => v !== undefined && v !== null && String(v).trim() !== '' && String(v).trim() !== '-'

// huruf tebal Unicode (𝗧𝗘𝗞𝗦) seperti di bot referensi; karakter non-ASCII dibiarkan
const bold = (str) =>
  [...String(str)]
    .map((c) => {
      const n = c.codePointAt(0)
      if (n >= 65 && n <= 90) return String.fromCodePoint(0x1d5d4 + n - 65)
      if (n >= 97 && n <= 122) return String.fromCodePoint(0x1d5ee + n - 97)
      if (n >= 48 && n <= 57) return String.fromCodePoint(0x1d7ec + n - 48)
      return c
    })
    .join('')
// "BERHASIL" -> "[ B E R H A S I L ]"
const spaced = (str) => `[ ${String(str).toUpperCase().split(/\s+/).map((w) => [...w].join(' ')).join('   ')} ]`

// baris info: ['Label', nilai, 'emoji'?]
const row = ([k, v, e]) => `${e ? `${e} ` : '▪️ '}*${k}* : ${v}`
const titleLine = (icon, t) => `「 ${icon ? `${icon} ` : ''}${bold(up(t))} 」`
const box = (head, lines) => [head ? `┌──「 ${bold(up(head))} 」` : '┌──────────────', ...lines.map((l) => `│ ${l}`), '└──────────────'].join('\n')
const divider = (head) => `✦┈┈๑ ${head} ๑┈┈✦`

// card({ icon, title, status, rows: [[k,v,e]], boxTitle, sections: [{ head, rows|lines }], text, tip, footer })
function card({ icon = '✨', title = '', status = '', rows = [], boxTitle = 'Detail', sections = [], text = '', tip = '', footer = true } = {}) {
  const out = []
  if (status) out.push(spaced(status), '')
  out.push(titleLine(icon, title))
  if (text) out.push('', String(text).trim())
  const base = rows.filter((r) => r && has(r[1])).map(row)
  if (base.length) out.push('', box(boxTitle, base))
  for (const sec of sections) {
    const rs = (sec.rows || []).filter((r) => r && has(r[1])).map(row)
    const ls = (sec.lines || []).filter(Boolean)
    if (!rs.length && !ls.length) continue
    out.push('', divider(sec.head), ...(rs.length ? [box('', rs)] : []), ...ls)
  }
  if (tip) out.push('', `_💡 ${tip}_`)
  if (footer) out.push('', typeof footer === 'string' ? footer : foot())
  return out.join('\n')
}

// cara pakai: usage({ prefix, command, desc, format, examples: [], notes: [] })
function usage({ prefix = '.', command = '', desc = '', format = '', examples = [], notes = [] } = {}) {
  const ex = [].concat(examples).filter(Boolean)
  return card({
    icon: '📖',
    status: 'Cara pakai',
    title: command,
    text: desc,
    rows: [...(format ? [['Format', `${prefix}${command} ${format}`.trim(), '📌']] : []), ...ex.map((e, i) => [`Contoh ${ex.length > 1 ? i + 1 : ''}`.trim(), e, '›'])],
    boxTitle: 'Panduan',
    tip: [].concat(notes).filter(Boolean).join(' • ')
  })
}
const ok = (msg, rows = []) => card({ icon: '✅', status: 'Berhasil', title: 'Berhasil', text: msg, rows })
const fail = (msg, tip = '') => card({ icon: '❌', status: 'Gagal', title: 'Gagal', text: msg, tip })

// ikon baris berdasarkan label (dipakai juga oleh lib/zt.js)
const ROW_ICON = [
  [/^(judul|title)$|^nama( file| lagu| grup| bot)?$|^name$/i, '📝'], [/uploader|author|artis|channel|pembuat|creator|dari$|pengirim/i, '👤'],
  [/view|tonton|putar/i, '👁️'], [/like|suka/i, '❤️'], [/komen|comment/i, '💬'], [/share|bagikan/i, '🔁'], [/simpan|favorit|save/i, '🔖'],
  [/durasi|duration|lama/i, '⏱️'], [/ukuran|size|berat/i, '📦'], [/kualitas|resolusi|quality/i, '🎞️'], [/sumber|link|url|source|situs/i, '🔗'],
  [/tipe|jenis|type|media|kategori/i, '🏷️'], [/total|jumlah|item|count/i, '🧮'], [/ekstensi|format/i, '🧩'], [/repo|folder/i, '📁'], [/^id$|jid|nomor id/i, '🆔'],
  [/wilayah|region|negara|lokasi|kota|tempat/i, '🌍'], [/tanggal|tgl|upload|rilis|dibuat|waktu|jam|hari|date/i, '📅'], [/musik|sound|lagu|audio/i, '🎵'],
  [/deskripsi|bio|caption|keterangan|pesan|catatan/i, '📄'], [/uptime|aktif|runtime/i, '⏳'], [/mode/i, '⚙️'], [/prefix/i, '🔣'], [/fitur|plugin|perintah|command/i, '🧩'],
  [/user|pengguna|member|anggota|pemain|peserta/i, '👥'], [/node|versi|version/i, '🟢'], [/^os$|sistem/i, '🖥️'], [/cpu|prosesor|core/i, '🧠'], [/load|beban/i, '📈'],
  [/ram|memori|memory|storage|disk/i, '💾'], [/saldo|uang|money|bank|dompet|harga|biaya|tarif|hadiah|gaji|bayar|rp|total bayar/i, '💰'], [/level|lv/i, '🏅'], [/exp|xp|poin/i, '✨'],
  [/limit|kuota|sisa/i, '🎟️'], [/status|kondisi/i, '📡'], [/nomor|nomer|telp|hp|wa\b|number/i, '📱'], [/hasil|result|jawaban|skor|nilai/i, '🎯'], [/ping|latensi|kecepatan|speed/i, '⚡'],
  [/umur|usia|lahir/i, '🎂'], [/gender|kelamin/i, '🚻'], [/zodiak|shio/i, '♈'], [/cuaca|suhu|angin|hujan/i, '🌦️'], [/owner|admin/i, '👑'], [/grup|group/i, '👥'], [/warna|color/i, '🎨'],
  [/bahasa|language/i, '🌐'], [/email|mail/i, '📧'], [/password|kata sandi|kunci|key|token/i, '🔑'], [/peringkat|rank|juara/i, '🏆'], [/target|tujuan|penerima/i, '🎯'], [/alasan|sebab/i, '❓']
]
const rowIcon = (label, fb = '▪️') => (ROW_ICON.find(([re]) => re.test(String(label).trim())) || [, fb])[1]


// ---------------------------------------------------------------- kartu aksi grup (dipakai plugins/group/*)
const jidNum = (j) => String(j || '').split('@')[0].split(':')[0]
const nowWib = () => new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace('.', ':') + ' WIB'

// groupCard(sock, from, { icon, title, by, targets, ok, total, rows, note }) -> { text, mentions }
async function groupCard(sock, from, { icon = '👥', title, by, targets = [], ok, total, rows = [], note = '' } = {}) {
  let subject = '-'
  let size = ''
  try {
    const md = await sock.groupMetadata(from)
    subject = md.subject || '-'
    size = `${md.participants.length} anggota`
  } catch {}
  const mentions = [...new Set([by, ...targets].filter(Boolean))]
  const list = rows.slice()
  const lines = [
    ['Grup', subject, '👥'],
    ['Anggota', size, '🧮'],
    ['Dilakukan oleh', by ? `@${jidNum(by)}` : '', '👤'],
    ...(targets.length ? [['Target', targets.map((t) => `@${jidNum(t)}`).join(', '), '🎯']] : []),
    ...(total !== undefined ? [['Hasil', ok === total ? `✅ ${ok}/${total} berhasil` : ok ? `⚠️ ${ok}/${total} berhasil` : `❌ 0/${total} berhasil`, '📊']] : []),
    ...list,
    ['Waktu', nowWib(), '🕒']
  ]
  return { text: card({ icon, title, rows: lines, tip: note }), mentions }
}

// ---------------------------------------------------------------- otomatis
const USAGE_START = /^(masukkan|masukan|kirim|isi|reply|balas|ketik|tulis|gunakan|pakai|tag|pilih|format|cara|contoh|sertakan|tentukan|berikan|tambahkan)\b/i
const FAIL_START = /^(❌|⚠️|🚫|✖️)/u
const OK_START = /^(✅|☑️|✔️)/u
const FAIL_WORD = /^(gagal|tidak (bisa|ada|dapat|ditemukan|valid|dikenali|didukung|cukup|boleh)|terlalu|maksimal|minimal|belum|bukan|ffmpeg belum|modul .* belum|antrian .* penuh|stiker animasi belum|server |link tidak|format tidak|nomor tidak|perintah tidak)/i
const KV = /^([A-Za-zÀ-ÿ][^:：\n*_`]{0,28}?)\s*[:：]\s+(\S.*)$/

// 'skip' = biarkan | 'titled' = sudah ada judul tebal (disamakan ke gaya baru) | '' = teks polos
function styled(t) {
  const lines = t.split('\n').map((l) => l.trim()).filter(Boolean)
  if (!lines.length) return 'skip'
  const first = lines[0]
  if (/^>/.test(first) || /^[┌┏╭╔]/u.test(first) || /[《「]/.test(first)) return 'skip' // panel .menu / sudah bergaya baru
  if (/^\[\s*(\S\s){2,}/.test(first) || lines.some((l) => /^✦┈┈๑/.test(l))) return 'skip'
  if (/```/.test(t)) return 'skip' // blok kode dibiarkan apa adanya
  if (lines.slice(0, 4).some((l) => /^[-─—―=_~]{6,}$/.test(l))) return 'titled' // gaya ZeroTwo lama (v1.25.0) -> naik ke gaya baru
  if (/^\p{Extended_Pictographic}?️?\s*\*[^*\n]{2,60}\*/u.test(first)) return 'titled'
  return ''
}

// "▬ *Key:* v" / "▬ Key: v" / "- Key: v" -> ['Key','v','emoji'] (atau null)
function kvParse(l) {
  let m = l.match(/^\s*[▬◉➥◦•›»▪️-]*\s*(?:\p{Extended_Pictographic}️?\s*)?\*([^*\n]+?):?\*\s*:?\s+(\S.*)$/u)
  if (m) return [m[1].trim(), m[2], rowIcon(m[1])]
  m = l.match(/^\s*[▬◉➥◦•›»]\s*([^:：\n*]{1,28}?)\s*[:：]\s+(\S.*)$/)
  if (m) return [m[1].trim(), m[2], rowIcon(m[1])]
  return null
}

// lines -> teks bergaya baru: baris kv dikumpulkan jadi kotak, sub-judul jadi pemisah ✦┈┈๑ ๑┈┈✦
function layout(lines, { boxTitle = 'Detail', plainKv = false } = {}) {
  const out = []
  let run = []
  let head = boxTitle
  const flush = () => {
    if (run.length) out.push(box(head, run.map(row)))
    run = []
  }
  for (const raw of lines) {
    const tr = raw.trim()
    if (!tr) { flush(); if (out.length && out[out.length - 1] !== '') out.push(''); continue }
    if (/^[-─—―=_~]{6,}$/.test(tr)) { flush(); continue }
    const sub = tr.match(/^(?:\p{Extended_Pictographic}️?\s*)?\*([^*\n]+)\*:?$/u)
    if (sub) { flush(); out.push(divider(sub[1].trim())); head = ''; continue }
    let kv = kvParse(raw)
    if (!kv && plainKv) {
      const m = tr.match(KV)
      if (m && !/^https?$/i.test(m[1]) && m[1].split(/\s+/).length <= 4) kv = [m[1].trim(), m[2], rowIcon(m[1])]
    }
    if (kv) run.push(kv)
    else { flush(); out.push(tr) }
  }
  flush()
  while (out.length && out[out.length - 1] === '') out.pop()
  return out.join('\n')
}

function normalizeTitled(t, meta) {
  const lines = t.split('\n').map((l) => l.replace(/\s+$/, ''))
  while (lines.length && (!lines[0].trim() || /^[-─—―=_~]{6,}$/.test(lines[0].trim()))) lines.shift()
  const head = lines.shift().trim()
  const hm = head.match(/^(\p{Extended_Pictographic}️?)?\s*\*([^*\n]+)\*\s*(.*)$/u)
  const icon = hm[1] || meta.icon || '✨'
  const out = [titleLine(icon, hm[2].trim())]
  const rest = [...(hm[3] ? [hm[3].replace(/^[—–:-]\s*/, '')] : []), ...lines]
  // footer lama (© nama / garis) dibuang supaya tidak dobel
  while (rest.length && (!rest[rest.length - 1].trim() || /^[-─—―=_~]{6,}$/.test(rest[rest.length - 1].trim()) || /^©/.test(rest[rest.length - 1].trim()))) rest.pop()
  while (rest.length && !rest[0].trim()) rest.shift()
  out.push('', layout(rest), '', foot())
  return out.join('\n')
}

function bodyOf(lines) {
  return layout(lines, { plainKv: true })
}

// text -> teks bergaya baru (atau teks asli bila tidak perlu)
function auto(text, meta = {}) {
  const t = String(text ?? '').replace(/\r/g, '').trim()
  if (!t || t.length > 3500) return text
  const st = styled(t)
  if (st === 'skip') return text
  if (st === 'titled') return normalizeTitled(t, meta)
  const cmd = String(meta.command || '').toLowerCase()
  const title = meta.title || cmd
  const lines = t.split('\n')
  const first = lines[0].trim()
  const prefix = meta.prefix || global.prefix || '.'
  const body = (arr) => bodyOf(arr.map((l) => l.trim()))

  if (meta.kind === 'denied') return card({ icon: '🚫', status: 'Akses ditolak', title: 'Akses ditolak', text: t })
  if (meta.kind === 'error') return card({ icon: '⚠️', status: 'Error', title: 'Terjadi kesalahan', text: t, tip: `Coba lagi nanti atau laporkan lewat ${prefix}report` })

  if (FAIL_START.test(first) || FAIL_WORD.test(first)) {
    const msg = t.replace(FAIL_START, '').trim()
    return card({ icon: '❌', status: 'Gagal', title: cmd || 'Gagal', text: body(msg.split('\n')), tip: cmd ? `Lihat cara pakai: ${prefix}cmd ${cmd}` : '' })
  }
  if (OK_START.test(first)) {
    const rest = t.replace(OK_START, '').trim().split('\n')
    return card({ icon: '✅', status: 'Berhasil', title: cmd || 'Berhasil', text: body(rest) })
  }
  if (USAGE_START.test(first) || /(^|\n)\s*(contoh|format)\s*\d*\s*:/i.test(t)) {
    const desc = []
    const ex = []
    for (const l of lines.map((x) => x.trim()).filter(Boolean)) {
      if (/^(contoh|format)\s*\d*\s*:/i.test(l) || (l.startsWith(prefix) && /^[a-z0-9]/i.test(l.slice(prefix.length)))) ex.push(l.replace(/^(contoh|format)\s*\d*\s*:\s*/i, ''))
      else desc.push(l)
    }
    return card({
      icon: '📖',
      status: 'Cara pakai',
      title: cmd || title,
      text: desc.length ? desc.join('\n') : 'Format perintah belum lengkap, ikuti contoh di bawah.',
      rows: ex.map((e, i) => [`Contoh ${ex.length > 1 ? i + 1 : ''}`.trim(), e, '›']),
      boxTitle: 'Panduan'
    })
  }

  // hasil biasa: judul dari nama fitur + isi dirapikan + footer
  return [titleLine(meta.icon || '✨', title), '', body(lines), '', foot()].join('\n')
}

// ---------------------------------------------------------------- header "Meta AI ✓ • EVP: <owner>"
// Kutipan palsu dari akun Meta AI (13135550002) berisi info pembayaran: WhatsApp menampilkan centang biru + nama di bawahnya.
function metaQuote() {
  const who = String(global.ownername || global.botname || 'xorizn-bot')
  const jid = '13135550002@s.whatsapp.net'
  const amount = { value: 999999999999999, offset: 0 }
  return {
    key: { fromMe: false, participant: jid, remoteJid: jid, id: `VX${Date.now().toString(36).toUpperCase()}` },
    message: {
      interactiveMessage: {
        body: { text: 'Payment Info' },
        nativeFlowMessage: {
          buttons: [
            {
              name: 'payment_info',
              buttonParamsJson: JSON.stringify({
                currency: 'IDR',
                total_amount: amount,
                reference_id: who,
                type: 'physical-goods',
                order: { status: 'pending', subtotal: amount, order_type: 'ORDER', items: [{ name: who, amount, quantity: 1, sale_amount: amount }] },
                payment_settings: [{ type: 'pix_static_code', pix_static_code: { merchant_name: who, key: who, key_type: 'EVP' } }],
                share_payment_status: false
              })
            }
          ]
        }
      }
    }
  }
}

// pasang di sock.sendMessage (dipanggil bot.js SETELAH richui supaya jadi lapisan terluar)
function install(sock) {
  if (sock.__fmt) return
  sock.__fmt = true
  const orig = sock.sendMessage.bind(sock)
  const rui = require('./richui')
  const denied = () => new Set(Object.values(global.__mess?.only || {}))
  sock.sendMessage = async (jid, content, options) => {
    try {
      if (
        content &&
        typeof content.text === 'string' &&
        Object.keys(content).every((k) => k === 'text' || (k === 'mentions' && !content.mentions?.length)) &&
        typeof jid === 'string' &&
        !/@(newsletter|broadcast)$|^status@/.test(jid)
      ) {
        const meta = rui.current()
        if (meta && meta.command && !meta.plain && global.uiFormat !== false) {
          const kind = denied().has(content.text) ? 'denied' : content.text === global.__mess?.error?.fitur ? 'error' : undefined
          const styledText = auto(content.text, { ...meta, kind, prefix: global.__prefix })
          if (styledText !== content.text) content = { ...content, text: styledText }
        }
      } else if (content && typeof content.caption === 'string' && content.caption.trim().length > 3 && typeof jid === 'string' && !/@(newsletter|broadcast)$|^status@/.test(jid)) {
        // keterangan gambar/video/dokumen ikut dirapikan
        const meta = rui.current()
        if (meta && meta.command && !meta.plain && global.uiFormat !== false) {
          const cap = auto(content.caption, { ...meta, prefix: global.__prefix })
          if (cap !== content.caption && cap.length <= 1024) content = { ...content, caption: cap }
          // mode RICH: tanpa emoji (keterangan media ikut dibersihkan)
          if (require('./uimode').isRich()) content = { ...content, caption: require('./fa').strip(content.caption).replace(/^[ \t]+(?=[*_\w])/gm, '').replace(/\n{3,}/g, '\n\n') }
        }
      }
    } catch (err) {
      console.log('[FMT] gagal merapikan, kirim apa adanya:', err.message)
    }
    // header "Meta AI ✓ + nama owner" di atas balasan perintah (matikan: global.uiQuote = 'off')
    try {
      const m2 = rui.current()
      const isMsg = content && (typeof content.text === 'string' || typeof content.caption === 'string')
      if (isMsg && m2 && m2.command && !m2.plain && global.uiQuote !== 'off' && typeof jid === 'string' && !/@(newsletter|broadcast)$|^status@/.test(jid)) {
        options = { ...(options || {}), quoted: metaQuote() }
      }
    } catch {}
    return orig(jid, content, options)
  }
}

module.exports = { LINE, foot, row, rowIcon, titleLine, card, usage, ok, fail, auto, install, groupCard, nowWib, jidNum, bold, spaced, box, divider, metaQuote }
