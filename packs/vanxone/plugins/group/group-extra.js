// Perintah grup tambahan: antitagall/antitagsw/antivirtex/adminonly, bungkam, blacklist, intro, setwelcome/setbye, totag, pinpesan, kickme
const kit = require('../../lib/kit')
const { panel } = require('../../lib/uitext')
const { getTargets, userOf, getQuotedText } = require('../../lib/utils')
const A = require('../../lib/engine/lumen_group')
const groups = require('../../lib/groups')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const toggle = (key, label, desc) => ({ desc, usage: 'on|off', admin: true, run: async (c) => {
  const v = (c.args[0] || '').toLowerCase(); const g = A.G(c.from)
  if (!['on', 'off'].includes(v)) return `${label}: *${g[key] ? 'AKTIF' : 'mati'}*\nGunakan ${c.prefix}${c.command} on / off`
  g[key] = v === 'on'; A.st.save()
  return `✅ ${label} ${g[key] ? 'diaktifkan' : 'dimatikan'}.${g[key] ? '\n_Bot harus jadi admin grup agar bisa menghapus pesan._' : ''}`
} })
const text = (c) => kit.rest(c.body).trim() || getQuotedText(c.msg) || ''

const specs = {
  antitagall: toggle('antitagall', 'Anti tag-semua', 'Hapus pesan non-admin yang menandai banyak anggota sekaligus'),
  antitagsw: toggle('antitagsw', 'Anti tag status grup', 'Hapus pesan non-admin yang menandai grup lewat status'),
  antivirtex: toggle('antivirtex', 'Anti virus-teks', 'Hapus pesan teks virus/bug (sangat panjang atau karakter aneh) dari non-admin'),
  adminonly: toggle('adminonly', 'Mode adminonly', 'Hanya admin grup yang boleh memakai perintah bot di grup ini'),
  bungkam: { desc: 'Bungkam anggota: semua pesannya dihapus otomatis (mention/reply). `.bungkam list` untuk daftar', usage: '@user|list', admin: true, args: true, run: async (c) => {
    const g = A.G(c.from)
    if ((c.args[0] || '').toLowerCase() === 'list') return panel('DIBUNGKAM', [{ head: '🤐 *DAFTAR*', lines: g.muted.length ? g.muted.map((x) => `@${x}`) : ['(kosong)'] }])
    const t = getTargets(c.msg, c.args); if (!t.length) throw bad('Tag/reply anggota yang mau dibungkam.')
    for (const j of t) if (!g.muted.includes(userOf(j))) g.muted.push(userOf(j)); A.st.save()
    await c.sock.sendMessage(c.from, { text: `🤐 ${t.map((j) => '@' + userOf(j)).join(', ')} dibungkam. Lepas dengan ${c.prefix}unbungkam`, mentions: t }, { quoted: c.msg }); return null
  } },
  unbungkam: { desc: 'Lepaskan bungkam anggota', usage: '@user', admin: true, args: true, run: async (c) => {
    const t = getTargets(c.msg, c.args); const g = A.G(c.from); g.muted = g.muted.filter((x) => !t.some((j) => userOf(j) === x)); A.st.save()
    return `✅ Bungkam dilepas untuk ${t.length} anggota.`
  } },
  blacklist: { desc: 'Daftar hitam grup: orang di blacklist otomatis dikeluarkan saat masuk', usage: '<nomor|@user> | list', admin: true, args: true, run: async (c) => {
    const g = A.G(c.from)
    if ((c.args[0] || '').toLowerCase() === 'list') return panel('BLACKLIST', [{ head: '🚫 *NOMOR*', lines: g.blacklist.length ? g.blacklist : ['(kosong)'] }])
    const t = getTargets(c.msg, c.args).map(userOf); if (!t.length) throw bad('Tulis nomor (628xxx) atau tag orangnya.')
    for (const n of t) if (!g.blacklist.includes(n)) g.blacklist.push(n); A.st.save()
    return `🚫 ${t.length} nomor masuk blacklist.`
  } },
  delblacklist: { desc: 'Hapus nomor dari blacklist grup', usage: '<nomor|@user>', admin: true, args: true, run: async (c) => {
    const t = getTargets(c.msg, c.args).map(userOf); const g = A.G(c.from); g.blacklist = g.blacklist.filter((x) => !t.includes(x)); A.st.save(); return '✅ Dihapus dari blacklist.'
  } },
  setintro: { desc: 'Atur pesan perkenalan/aturan yang dikirim ke anggota baru', usage: '<teks>', admin: true, args: true, run: async (c) => { A.G(c.from).intro = text(c).slice(0, 1500); A.st.save(); return '✅ Intro grup disimpan.' } },
  intro: { desc: 'Tampilkan intro grup', group: true, run: async (c) => A.G(c.from).intro || `Belum ada intro. Admin: ${c.prefix}setintro <teks>` },
  delintro: { desc: 'Hapus intro grup', admin: true, run: async (c) => { A.G(c.from).intro = ''; A.st.save(); return '🗑️ Intro dihapus.' } },
  setwelcome: { desc: 'Atur teks sambutan anggota baru (@user, @group) & aktifkan', usage: '<teks>', admin: true, args: true, run: async (c) => { groups.setGroup(c.from, { welcome: true, welcomeText: text(c) }); return '✅ Teks welcome diatur & diaktifkan.' } },
  setbye: { desc: 'Atur teks perpisahan anggota keluar (@user, @group) & aktifkan', usage: '<teks>', admin: true, args: true, run: async (c) => { groups.setGroup(c.from, { leave: true, leaveText: text(c) }); return '✅ Teks perpisahan diatur & diaktifkan.' } },
  setpromote: { desc: 'Atur pesan saat anggota dijadikan admin (@user)', usage: '<teks>', admin: true, args: true, run: async (c) => { A.G(c.from).promoteText = text(c); A.st.save(); return '✅ Pesan promote diatur.' } },
  setdemote: { desc: 'Atur pesan saat admin diturunkan (@user)', usage: '<teks>', admin: true, args: true, run: async (c) => { A.G(c.from).demoteText = text(c); A.st.save(); return '✅ Pesan demote diatur.' } },
  totag: { desc: 'Kirim ulang pesan yang di-reply sambil menandai semua anggota', admin: true, run: async (c) => {
    const ctx = c.msg.message?.extendedTextMessage?.contextInfo; const q = text(c) || ctx?.quotedMessage?.conversation || ctx?.quotedMessage?.extendedTextMessage?.text || ''
    if (!q) throw bad('Reply pesan atau tulis teksnya.')
    const md = await c.sock.groupMetadata(c.from)
    await c.sock.sendMessage(c.from, { text: q, mentions: md.participants.map((p) => p.jid || p.id) }); return null
  } },
  pinpesan: { desc: 'Sematkan pesan yang di-reply (24 jam)', admin: true, run: async (c) => {
    const ctx = c.msg.message?.extendedTextMessage?.contextInfo; if (!ctx?.stanzaId) throw bad('Reply pesan yang mau disematkan.')
    await c.sock.sendMessage(c.from, { pin: { type: 1, time: 86400, key: { remoteJid: c.from, id: ctx.stanzaId, fromMe: false, participant: ctx.participant } } }); return null
  } },
  unpin: { desc: 'Lepas sematan pesan yang di-reply', admin: true, run: async (c) => {
    const ctx = c.msg.message?.extendedTextMessage?.contextInfo; if (!ctx?.stanzaId) throw bad('Reply pesan yang disematkan.')
    await c.sock.sendMessage(c.from, { pin: { type: 2, time: 0, key: { remoteJid: c.from, id: ctx.stanzaId, fromMe: false, participant: ctx.participant } } }); return null
  } },
  kickme: { desc: 'Owner: suruh bot keluar dari grup ini', group: true, run: async (c) => {
    if (!c.isOwner) throw bad('Hanya owner.')
    await c.sock.sendMessage(c.from, { text: '👋 Bot pamit. Terima kasih sudah memakai!' }); await c.sock.groupLeave(c.from); return null
  } },
  statusgroup: { desc: 'Ringkasan fitur proteksi grup yang aktif', admin: true, run: async (c) => {
    const g = A.G(c.from); const on = (v) => (v ? '✅' : '▫️')
    return panel('PROTEKSI GRUP', [{ head: '🛡️ *STATUS*', lines: [`${on(g.antitagall)} antitagall`, `${on(g.antitagsw)} antitagsw`, `${on(g.antivirtex)} antivirtex`, `${on(g.adminonly)} adminonly`, `🤐 dibungkam : ${g.muted.length}`, `🚫 blacklist : ${g.blacklist.length}`, `${on(g.intro)} intro`] }])
  } }
}
module.exports = kit.multi({ name: 'anya-group', category: 'group', emoji: '🛡️', desc: 'Anti tag-all/virtex, bungkam, blacklist, intro, setwelcome, totag, pin', specs, alias: { leavegc: 'kickme', out: 'kickme', tag: 'totag' } })
