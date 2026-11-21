const statusText = {
  200: 'berhasil ditambahkan',
  403: 'tidak bisa ditambah langsung (privasi akun), kirim undangan manual',
  408: 'baru saja keluar dari grup',
  409: 'sudah ada di grup'
}

module.exports = {
  name: 'add',
  command: ['add'],
  category: 'group',
  desc: 'Tambah member lewat nomor',
  usage: '628xxx',
  admin: true,
  botAdmin: true,
  run: async ({ sock, from, args, prefix, reply }) => {
    const numbers = args
      .map((a) => a.replace(/[^0-9]/g, ''))
      .map((n) => (n.startsWith('0') ? `62${n.slice(1)}` : n))
      .filter((n) => n.length >= 8 && n.length <= 15)

    if (!numbers.length) return reply(`Masukkan nomor.\nContoh: ${prefix}add 628123456789`)

    const res = await sock.groupParticipantsUpdate(
      from,
      numbers.map((n) => `${n}@s.whatsapp.net`),
      'add'
    )
    const lines = res.map(
      (r) => `• ${String(r.jid).split('@')[0]}: ${statusText[r.status] || `gagal (kode ${r.status})`}`
    )
    await reply(lines.join('\n'))
  }
}
