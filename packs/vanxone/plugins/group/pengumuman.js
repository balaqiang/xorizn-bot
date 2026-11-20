module.exports = {
  name: 'pengumuman', command: ['pengumuman', 'announce', 'info2'], category: 'group', emoji: '📢', desc: 'Admin: kirim pengumuman rapi dan tag semua member secara tersembunyi', usage: '<isi pengumuman>', group: true, admin: true,
  run: async ({ sock, msg, from, sender, text, prefix, reply }) => {
    if (!text) return reply(`Contoh: ${prefix}pengumuman Besok kerja bakti jam 07.00 ya!`)
    const m = await sock.groupMetadata(from)
    const body = `📢 *PENGUMUMAN*\n\n${text}\n\n— _dari admin @${String(sender).split('@')[0].split(':')[0]}_`
    await sock.sendMessage(from, { text: body, mentions: [...m.participants.map((p) => p.id)] }, { quoted: msg })
  }
}
