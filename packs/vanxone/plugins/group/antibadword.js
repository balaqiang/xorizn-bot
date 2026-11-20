const { getGroup, setGroup } = require('../../lib/groups')

module.exports = {
  name: 'antibadword',
  command: ['antibadword', 'antitoxic'],
  category: 'group',
  desc: 'Hapus pesan berisi kata terlarang',
  usage: 'on|off|add <kata>|del <kata>|list',
  admin: true,
  run: async ({ from, args, prefix, isBotAdmin, reply }) => {
    const g = getGroup(from)
    const words = g.badwords || []
    const sub = (args[0] || '').toLowerCase()
    const word = args.slice(1).join(' ').toLowerCase().trim()

    if (sub === 'on') {
      if (!isBotAdmin) return reply('Jadikan bot sebagai admin grup dulu supaya bisa menghapus pesan.')
      if (!words.length) return reply(`Daftar kata masih kosong. Tambah dulu: ${prefix}antibadword add <kata>`)
      setGroup(from, { badword: true })
      return reply('Antibadword aktif.')
    }
    if (sub === 'off') {
      setGroup(from, { badword: false })
      return reply('Antibadword dimatikan.')
    }
    if (sub === 'add') {
      if (!word) return reply(`Contoh: ${prefix}antibadword add kata`)
      if (words.includes(word)) return reply('Kata itu sudah ada di daftar.')
      setGroup(from, { badwords: [...words, word] })
      return reply(`Kata ditambahkan. Total ${words.length + 1} kata.`)
    }
    if (sub === 'del') {
      if (!words.includes(word)) return reply('Kata itu tidak ada di daftar.')
      setGroup(from, { badwords: words.filter((w) => w !== word) })
      return reply('Kata dihapus dari daftar.')
    }
    if (sub === 'list') return reply(words.length ? `*KATA TERLARANG*\n\n${words.map((w, i) => `${i + 1}. ${w}`).join('\n')}` : 'Daftar kata masih kosong.')

    await reply(
      [
        '*ANTIBADWORD*',
        `Status: ${g.badword ? 'aktif' : 'mati'} (${words.length} kata)`,
        '',
        `${prefix}antibadword add <kata>`,
        `${prefix}antibadword del <kata>`,
        `${prefix}antibadword list`,
        `${prefix}antibadword on | off`,
        '',
        'Pelanggar: pesan dihapus + warn, kick otomatis di batas warn.'
      ].join('\n')
    )
  }
}
