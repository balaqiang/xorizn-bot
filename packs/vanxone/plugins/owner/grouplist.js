module.exports = {
  name: 'grouplist',
  command: ['grouplist'],
  category: 'owner',
  desc: 'Daftar grup tempat bot berada',
  owner: true,
  run: async ({ sock, reply }) => {
    const groups = Object.values(await sock.groupFetchAllParticipating()).sort((a, b) => a.subject.localeCompare(b.subject))
    if (!groups.length) return reply('Bot belum ada di grup mana pun.')
    await reply([`*DAFTAR GRUP* (${groups.length})`, '', ...groups.map((g, i) => `${i + 1}. ${g.subject}\n   ${g.participants.length} member • ${g.id}`)].join('\n'))
  }
}
