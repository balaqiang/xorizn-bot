module.exports = {
  name: 'cekmember', command: ['cekmember', 'statgrup', 'komposisi'], category: 'group', emoji: '📈', desc: 'Statistik komposisi grup (owner/admin/member, nomor negara)', usage: '', group: true,
  run: async ({ sock, from, reply }) => {
    const m = await sock.groupMetadata(from)
    const ps = m.participants
    const sa = ps.filter((p) => p.admin === 'superadmin').length
    const ad = ps.filter((p) => p.admin === 'admin').length
    const cc = {}
    for (const p of ps) { const n = String(p.id).split('@')[0]; const k = n.startsWith('62') ? '🇮🇩 Indonesia (+62)' : n.startsWith('1') ? '🇺🇸 AS/Kanada (+1)' : n.startsWith('60') ? '🇲🇾 Malaysia (+60)' : n.startsWith('65') ? '🇸🇬 Singapura (+65)' : n.startsWith('91') ? '🇮🇳 India (+91)' : /@lid/.test(p.id) ? '🔒 ID tersembunyi' : '🌍 Lainnya'; cc[k] = (cc[k] || 0) + 1 }
    await reply(`📈 *KOMPOSISI GRUP*\n\n▬ *Nama:* ${m.subject}\n▬ *Total anggota:* ${ps.length}\n▬ *Owner grup:* ${sa}\n▬ *Admin:* ${ad}\n▬ *Member biasa:* ${ps.length - sa - ad}\n▬ *Dibuat:* ${m.creation ? new Date(m.creation * 1000).toLocaleDateString('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }) : '-'}\n\n*Asal nomor*\n${Object.entries(cc).sort((a, b) => b[1] - a[1]).map(([k, v]) => `➥ ${k}: ${v}`).join('\n')}`)
  }
}
