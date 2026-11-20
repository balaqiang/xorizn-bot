const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

module.exports = {
  name: 'broadcast',
  command: ['bc', 'broadcast'],
  category: 'owner',
  desc: 'Kirim pesan ke semua grup',
  usage: '<pesan>',
  owner: true,
  run: async ({ sock, text, prefix, reply }) => {
    if (!text) return reply(`Contoh: ${prefix}bc pengumuman penting`)

    const groups = Object.keys(await sock.groupFetchAllParticipating())
    await reply(`Mengirim broadcast ke ${groups.length} grup...`)

    let sent = 0
    for (const jid of groups) {
      try {
        await sock.sendMessage(jid, { text })
        sent++
      } catch (err) {
        console.log(`[BC] gagal kirim ke ${jid}:`, err.message)
      }
      await sleep(2000)
    }
    await reply(`Broadcast selesai: ${sent}/${groups.length} grup berhasil.`)
  }
}
