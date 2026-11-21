// Sewa bot per grup + mode tidur bot + total pengguna
const kit = require('../../lib/kit')
const { panel } = require('../../lib/uitext')
const S = require('../../lib/engine/lumen_sewa')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const fmtDate = (t) => new Date(t).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Jakarta' })
async function targetGroup(c) {
  const link = (c.args.find((a) => /chat\.whatsapp\.com\//.test(a)) || '').match(/chat\.whatsapp\.com\/([\w-]+)/)?.[1]
  if (link) { const info = await c.sock.groupGetInviteInfo(link); return { jid: info.id, name: info.subject } }
  const id = c.args.find((a) => /@g\.us$/.test(a)); if (id) return { jid: id, name: '' }
  if (c.isGroup) { const md = await c.sock.groupMetadata(c.from); return { jid: c.from, name: md.subject } }
  throw bad('Tulis link grup / ID grup, atau jalankan di dalam grup.')
}
const dayArg = (c) => { const n = parseInt(c.args.find((a) => /^\d{1,4}$/.test(a))); if (!n || n < 1) throw bad(`Tulis jumlah hari. Contoh: ${c.prefix}${c.command} 30`); return n }

const specs = {
  sewa: { desc: 'Owner: sewakan bot ke grup selama N hari (di grup, atau sertakan link/ID grup)', usage: '<hari> [link grup]', example: '30', owner: true, args: true, run: async (c) => {
    const d = dayArg(c); const t = await targetGroup(c); const g = S.add(t.jid, d, t.name)
    return panel('SEWA BOT', [{ head: '🏷️ *GRUP*', lines: [t.name || t.jid, `Ditambah : ${d} hari`, `Berakhir : ${fmtDate(g.until)}`, `Sisa : ${S.days(S.left(g))} hari`] }])
  } },
  perpanjangsewa: { desc: 'Owner: perpanjang masa sewa grup', usage: '<hari> [link grup]', example: '30', owner: true, args: true, run: async (c) => {
    const d = dayArg(c); const t = await targetGroup(c); if (!S.st.data.groups[t.jid]) throw bad('Grup ini belum pernah disewa. Pakai .sewa')
    const g = S.add(t.jid, d, t.name); return `✅ Sewa diperpanjang ${d} hari.\nBerakhir: ${fmtDate(g.until)} (sisa ${S.days(S.left(g))} hari)`
  } },
  delsewa: { desc: 'Owner: hapus sewa suatu grup', usage: '[link grup]', owner: true, optional: true, run: async (c) => { const t = await targetGroup(c); delete S.st.data.groups[t.jid]; S.st.save(); return '🗑️ Data sewa grup dihapus.' } },
  listsewa: { desc: 'Owner: daftar semua grup yang menyewa bot', owner: true, run: async () => {
    const all = Object.entries(S.st.data.groups).sort((a, b) => a[1].until - b[1].until)
    if (!all.length) return 'Belum ada grup yang menyewa.'
    return panel('DAFTAR SEWA', [{ head: `🏷️ *${all.length} GRUP*`, lines: all.map(([j, g]) => `${S.left(g) > 0 ? '🟢' : '🔴'} ${g.name || j} — ${S.left(g) > 0 ? `${S.days(S.left(g))} hari lagi` : 'kedaluwarsa'}`) }], { tip: `Mode keluar otomatis: ${S.st.data.mode ? 'ON' : 'OFF'} (.sewamode on/off)` })
  } },
  ceksewa: { desc: 'Cek sisa masa sewa bot di grup ini', group: true, run: async (c) => {
    const g = S.st.data.groups[c.from]; if (!g) return '📭 Grup ini tidak tercatat menyewa bot.'
    return S.left(g) > 0 ? `🟢 Sewa aktif sampai *${fmtDate(g.until)}*\nSisa ${S.days(S.left(g))} hari.` : `🔴 Masa sewa berakhir ${fmtDate(g.until)}.`
  } },
  sewamode: { desc: 'Owner: bot otomatis keluar dari grup yang sewanya habis (on/off)', usage: 'on|off', owner: true, optional: true, run: async (c) => {
    const v = (c.args[0] || '').toLowerCase(); if (!['on', 'off'].includes(v)) return `Mode keluar otomatis: *${S.st.data.mode ? 'ON' : 'OFF'}*\n${c.prefix}sewamode on / off`
    S.st.data.mode = v === 'on'; S.st.save(); return `✅ Mode sewa ${v === 'on' ? 'diaktifkan: grup yang sewanya habis akan ditinggalkan bot' : 'dimatikan'}.`
  } },
  sleepmode: { desc: 'Owner: bot "tidur" di jam tertentu (hanya owner dilayani). Contoh: on 22:00 06:00', usage: 'on <dari> <sampai> | off', owner: true, optional: true, run: async (c) => {
    const s = S.st.data.sleep; const v = (c.args[0] || '').toLowerCase()
    if (v === 'off') { s.on = false; S.st.save(); return '☀️ Mode tidur dimatikan.' }
    if (v === 'on') {
      const ok = (t) => /^([01]?\d|2[0-3]):[0-5]\d$/.test(t || '')
      if (c.args[1] && (!ok(c.args[1]) || !ok(c.args[2]))) throw bad('Format jam HH:MM, contoh: .sleepmode on 22:00 06:00')
      if (c.args[1]) { s.from = c.args[1]; s.to = c.args[2] }
      s.on = true; S.st.save(); return `🌙 Mode tidur aktif ${s.from}–${s.to} WIB. Di jam itu bot hanya melayani owner.`
    }
    return `🌙 Mode tidur: *${s.on ? 'ON' : 'OFF'}* (${s.from}–${s.to} WIB)\n${c.prefix}sleepmode on 22:00 06:00 • ${c.prefix}sleepmode off`
  } },
  totaluser: { desc: 'Jumlah pengguna terdaftar & total perintah bot', run: async (c) => {
    // [core] data user xorizn-bot ada di database pilihan (lib/db.js), bukan lagi di database/users.json
    const n = require('../../lib/db').countUsers()
    return panel('STATISTIK BOT', [{ head: '📊 *DATA*', lines: [`Pengguna terdaftar : ${n.toLocaleString('id-ID')}`, `Total perintah : ${(c.plugins || []).reduce((a, p) => a + (Array.isArray(p.command) ? p.command.length : 1), 0)}`, `Grup menyewa : ${Object.keys(S.st.data.groups).length}`] }])
  } }
}
module.exports = kit.multi({ name: 'plus-sewa', category: 'owner', emoji: '🏷️', desc: 'Sewa bot per grup, mode tidur, statistik pengguna', specs, alias: { addsewa: 'sewa', extendsewa: 'perpanjangsewa', sleep: 'sleepmode', pengguna: 'totaluser', jumlahdatabase: 'totaluser' } })
