module.exports = {
  name: 'owner',
  command: ['owner'],
  category: 'info',
  desc: 'Kontak owner bot',
  run: async ({ sock, msg, from, config }) => {
    const name = `${config.botName} Owner`
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${name}`,
      `TEL;type=CELL;waid=${config.ownerNumber}:+${config.ownerNumber}`,
      'END:VCARD'
    ].join('\n')

    await sock.sendMessage(
      from,
      { contacts: { displayName: name, contacts: [{ vcard }] } },
      { quoted: msg }
    )
  }
}
