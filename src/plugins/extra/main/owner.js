
let handler = async (m, { conn }) => {
  let owners = Array.isArray(global.owner) ? global.owner : [global.owner]
  let contacts = []

  for (let o of owners) {
    let num = String(o).replace(/[^0-9]/g, '')
    if (!num) continue
    contacts.push({
      displayName: global.botCreator || 'Owner',
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${global.botCreator || 'Owner'};;;\nFN:${global.botCreator || 'Owner'}\nitem1.TEL;waid=${num}:${num}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
    })
  }

  if (contacts.length === 0) {
    return m.reply('Nomor owner belum dikonfigurasi.')
  }

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: `${contacts.length} Kontak Owner`,
      contacts
    }
  }, { quoted: m })
}

handler.help = ['owner']
handler.tags = ['main']
handler.command = /^(owner|creator)$/i

export default handler
