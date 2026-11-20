// Alat grup: catatan, auto-respon, antidelete
const kit = require('../../lib/kit')
const gt = require('../../lib/grouptools')
const { panel } = require('../../lib/uitext')

const fail = (msg) => Object.assign(new Error(msg), { userMessage: msg })
const split = (c) => {
  const raw = kit.rest(c.body)
  const i = raw.indexOf('|')
  if (i < 0) return null
  const k = raw.slice(0, i).trim()
  const v = raw.slice(i + 1).trim()
  return k && v ? [k, v] : null
}

const specs = {
  addnote: { desc: 'Simpan catatan grup (admin)', usage: '<nama> | <isi>', example: 'wifi | Password: 12345', args: true, admin: true, run: async (c) => {
    const kv = split(c)
    if (!kv) throw fail(`Format: ${c.prefix}addnote nama | isi catatan`)
    if (kv[0].length > 30 || kv[1].length > 1500) throw fail('Nama maksimal 30 karakter, isi maksimal 1500 karakter.')
    gt.notes.set(c.from, kv[0], kv[1])
    return `✅ Catatan *${kv[0]}* disimpan. Lihat dengan ${c.prefix}getnote ${kv[0]}`
  } },
  getnote: { desc: 'Tampilkan catatan grup', usage: '<nama>', example: 'wifi', args: true, group: true, run: async (c) => {
    const n = gt.notes.get(c.from, c.text)
    if (!n) throw fail(`Catatan "${c.text}" tidak ada. Lihat daftar: ${c.prefix}listnote`)
    return `📒 *${c.text.toUpperCase()}*\n\n${n.text}`
  } },
  listnote: { desc: 'Daftar semua catatan grup', group: true, run: async (c) => {
    const l = gt.notes.list(c.from)
    return l.length ? panel('CATATAN GRUP', [{ head: `📒 *${l.length} CATATAN*`, lines: l.map((k) => `${k}  →  ${c.prefix}getnote ${k}`) }]) : `Belum ada catatan. Admin bisa menambah dengan ${c.prefix}addnote nama | isi`
  } },
  delnote: { desc: 'Hapus catatan grup (admin)', usage: '<nama>', args: true, admin: true, run: async (c) => (gt.notes.del(c.from, c.text) ? `🗑️ Catatan *${c.text}* dihapus.` : `Catatan "${c.text}" tidak ada.`) },
  setresp: { desc: 'Atur balasan otomatis ke kata tertentu (admin). Awali kata dengan ~ agar cocok jika terkandung', usage: '<kata> | <balasan>', example: 'halo | Halo {nama}, selamat datang!', args: true, admin: true, run: async (c) => {
    const kv = split(c)
    if (!kv) throw fail(`Format: ${c.prefix}setresp kata | balasan\nPakai {nama} untuk menyebut nama pengirim. Awali kata dengan ~ agar cocok bila kata terkandung di kalimat.`)
    const contains = kv[0].startsWith('~')
    const key = contains ? kv[0].slice(1).trim() : kv[0]
    if (!key || key.length > 40 || kv[1].length > 800) throw fail('Kata maksimal 40 karakter, balasan maksimal 800 karakter.')
    if (key.startsWith(c.prefix)) throw fail('Kata pemicu tidak boleh diawali prefix perintah.')
    gt.resp.set(c.from, key, kv[1], contains)
    return `✅ Auto-respon disimpan: ${contains ? 'mengandung' : 'tepat'} "${key}"`
  } },
  delresp: { desc: 'Hapus auto-respon (admin)', usage: '<kata>', args: true, admin: true, run: async (c) => (gt.resp.del(c.from, c.text.replace(/^~/, '')) ? `🗑️ Auto-respon "${c.text}" dihapus.` : 'Auto-respon itu tidak ada.') },
  listresp: { desc: 'Daftar auto-respon grup', group: true, run: async (c) => {
    const l = gt.resp.list(c.from)
    return l.length ? panel('AUTO-RESPON', [{ head: `🤖 *${l.length} ATURAN*`, lines: l.map(([k, v]) => `${v.contains ? '~' : ''}${k}  →  ${v.text.slice(0, 40)}${v.text.length > 40 ? '…' : ''}`) }]) : `Belum ada auto-respon. Admin: ${c.prefix}setresp kata | balasan`
  } },
  antidelete: { desc: 'Kirim ulang pesan yang dihapus anggota (admin, on/off)', usage: 'on | off', args: true, admin: true, run: async (c) => {
    const a = c.args[0].toLowerCase()
    if (!['on', 'off'].includes(a)) throw fail(`Pakai: ${c.prefix}antidelete on  atau  ${c.prefix}antidelete off`)
    gt.antidelete.set(c.from, a === 'on')
    return a === 'on' ? '✅ Antidelete aktif. Bot mulai mengingat pesan baru dan mengirim ulang yang dihapus.\n_Hanya pesan setelah fitur diaktifkan yang bisa dipulihkan._' : '✅ Antidelete dimatikan.'
  } }
}

module.exports = kit.multi({ name: 'grouptools', category: 'group', emoji: '🧰', desc: 'Catatan, auto-respon, antidelete', specs })
